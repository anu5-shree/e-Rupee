export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }

  public: {
    Tables: {
      offline_transfers: {
        Row: {
          amount: number
          created_at: string
          id: string
          note: string | null
          receiver_name: string | null
          receiver_phone: string
          status: string
          synced_at: string | null
          user_id: string
        }

        Insert: {
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          receiver_name?: string | null
          receiver_phone: string
          status?: string
          synced_at?: string | null
          user_id: string
        }

        Update: {
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          receiver_name?: string | null
          receiver_phone?: string
          status?: string
          synced_at?: string | null
          user_id?: string
        }

        Relationships: []
      }

      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          wallet_balance: number
          wallet_id: string
        }

        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          wallet_balance?: number
          wallet_id?: string
        }

        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          wallet_balance?: number
          wallet_id?: string
        }

        Relationships: []
      }

      transactions: {
        Row: {
          amount: number
          counterparty: string
          created_at: string
          id: string
          note: string | null
          type: string
          user_id: string
        }

        Insert: {
          amount: number
          counterparty: string
          created_at?: string
          id?: string
          note?: string | null
          type: string
          user_id: string
        }

        Update: {
          amount?: number
          counterparty?: string
          created_at?: string
          id?: string
          note?: string | null
          type?: string
          user_id?: string
        }

        Relationships: []
      }
    }

    Views: {
      [_ in never]: never
    }

    Functions: {
     load_erupee: {
  Args: {
    _amount: number
    _source?: string
  }
  Returns: Json
}

      transfer_erupee: {
        Args: {
          _amount: number
          _note?: string
          _receiver_phone: string
        }
        Returns: Json
      }
    }

    Enums: {
      [_ in never]: never
    }

    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema =
  DatabaseWithoutInternals[Extract<keyof DatabaseWithoutInternals, "public">]

export const Constants = {
  public: {
    Enums: {},
  },
} as const