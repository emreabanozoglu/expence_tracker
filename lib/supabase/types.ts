// Database Types for Supabase

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            expenses: {
                Row: {
                    id: string
                    user_id: string
                    type: 'income' | 'expense'
                    amount: number
                    category: string
                    description: string | null
                    date: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type?: 'income' | 'expense'
                    amount: number
                    category: string
                    description?: string | null
                    date: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'income' | 'expense'
                    amount?: number
                    category?: string
                    description?: string | null
                    date?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            user_settings: {
                Row: {
                    id: string
                    user_id: string
                    currency_code: string
                    currency_symbol: string
                    categories: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    currency_code?: string
                    currency_symbol?: string
                    categories?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    currency_code?: string
                    currency_symbol?: string
                    categories?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
