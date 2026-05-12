
-- offline_transfers table
CREATE TABLE public.offline_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  receiver_phone text NOT NULL,
  receiver_name text,
  amount numeric NOT NULL CHECK (amount > 0),
  note text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','synced','failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  synced_at timestamptz
);

ALTER TABLE public.offline_transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own offline transfers" ON public.offline_transfers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own offline transfers" ON public.offline_transfers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own offline transfers" ON public.offline_transfers
  FOR UPDATE USING (auth.uid() = user_id);

-- Atomic transfer function
CREATE OR REPLACE FUNCTION public.transfer_erupee(
  _receiver_phone text,
  _amount numeric,
  _note text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _sender uuid := auth.uid();
  _sender_balance numeric;
  _sender_name text;
  _receiver_id uuid;
  _receiver_name text;
BEGIN
  IF _sender IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount IS NULL OR _amount <= 0 THEN RAISE EXCEPTION 'Invalid amount'; END IF;

  SELECT wallet_balance, full_name INTO _sender_balance, _sender_name
    FROM profiles WHERE id = _sender FOR UPDATE;

  IF _sender_balance < _amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;

  SELECT id, full_name INTO _receiver_id, _receiver_name
    FROM profiles WHERE phone = _receiver_phone LIMIT 1;

  -- Debit sender
  UPDATE profiles SET wallet_balance = wallet_balance - _amount, updated_at = now()
    WHERE id = _sender;

  -- Credit receiver if exists on the network
  IF _receiver_id IS NOT NULL THEN
    UPDATE profiles SET wallet_balance = wallet_balance + _amount, updated_at = now()
      WHERE id = _receiver_id;
    INSERT INTO transactions (user_id, type, counterparty, amount, note)
      VALUES (_receiver_id, 'receive', COALESCE(_sender_name, 'e₹ User'), _amount, _note);
  END IF;

  INSERT INTO transactions (user_id, type, counterparty, amount, note)
    VALUES (_sender, 'send', COALESCE(_receiver_name, '+91 ' || _receiver_phone), _amount, _note);

  RETURN jsonb_build_object('ok', true, 'receiver_found', _receiver_id IS NOT NULL);
END $$;

-- Load (top-up) function
CREATE OR REPLACE FUNCTION public.load_erupee(_amount numeric, _source text DEFAULT 'Bank Account')
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount IS NULL OR _amount <= 0 THEN RAISE EXCEPTION 'Invalid amount'; END IF;

  UPDATE profiles SET wallet_balance = wallet_balance + _amount, updated_at = now()
    WHERE id = _uid;

  INSERT INTO transactions (user_id, type, counterparty, amount, note)
    VALUES (_uid, 'receive', _source, _amount, 'Wallet top-up');

  RETURN jsonb_build_object('ok', true);
END $$;

-- Realtime
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.offline_transfers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offline_transfers;
