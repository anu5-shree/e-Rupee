
REVOKE ALL ON FUNCTION public.transfer_erupee(text, numeric, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.load_erupee(numeric, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.transfer_erupee(text, numeric, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.load_erupee(numeric, text) TO authenticated;
