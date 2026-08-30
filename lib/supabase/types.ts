export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    is_pro: boolean
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    subscription_end_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    is_pro?: boolean
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    subscription_end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    is_pro?: boolean
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    subscription_end_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            expenses: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    date: string
                    description: string | null
                    id: string
                    type: string
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string | null
                    date: string
                    description?: string | null
                    id?: string
                    type?: string
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date?: string
                    description?: string | null
                    id?: string
                    type?: string
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            recurring_transactions: {
                Row: {
                    active: boolean | null
                    amount: number
                    category: string
                    created_at: string
                    description: string | null
                    frequency: string
                    id: string
                    last_processed: string | null
                    next_run: string
                    payday_day_of_month: number | null
                    payday_rule: string | null
                    start_date: string
                    type: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    active?: boolean | null
                    amount: number
                    category: string
                    created_at?: string
                    description?: string | null
                    frequency: string
                    id?: string
                    last_processed?: string | null
                    next_run: string
                    payday_day_of_month?: number | null
                    payday_rule?: string | null
                    start_date: string
                    type: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    active?: boolean | null
                    amount?: number
                    category?: string
                    created_at?: string
                    description?: string | null
                    frequency?: string
                    id?: string
                    last_processed?: string | null
                    next_run?: string
                    payday_day_of_month?: number | null
                    payday_rule?: string | null
                    start_date?: string
                    type?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
            }
            user_settings: {
                Row: {
                    categories: Json
                    created_at: string
                    currency_code: string
                    currency_symbol: string
                    id: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    categories?: Json
                    created_at?: string
                    currency_code?: string
                    currency_symbol?: string
                    id?: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    categories?: Json
                    created_at?: string
                    currency_code?: string
                    currency_symbol?: string
                    id?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
