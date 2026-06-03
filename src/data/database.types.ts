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
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bake_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      bake_executions: {
        Row: {
          cost: number
          finished_at: string
          id: string
          quantity_multiplier: number
          recipe_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          cost: number
          finished_at?: string
          id?: string
          quantity_multiplier?: number
          recipe_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          cost?: number
          finished_at?: string
          id?: string
          quantity_multiplier?: number
          recipe_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bake_executions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "bake_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      bake_ingredients: {
        Row: {
          created_at: string
          id: string
          name: string
          package_price: number
          package_size: number
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          package_price: number
          package_size: number
          unit: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          package_price?: number
          package_size?: number
          unit?: string
        }
        Relationships: []
      }
      bake_recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string | null
          node_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          node_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string | null
          node_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bake_recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "bake_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bake_recipe_ingredients_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "bake_workflow_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      bake_recipes: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          name: string
          prep_time_minutes: number
          yield: number
          yield_unit: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          name: string
          prep_time_minutes: number
          yield: number
          yield_unit: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          name?: string
          prep_time_minutes?: number
          yield?: number
          yield_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "bake_recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "bake_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bake_workflow_nodes: {
        Row: {
          content: string | null
          created_at: string
          duration: number | null
          id: string
          order_index: number
          recipe_id: string | null
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          order_index: number
          recipe_id?: string | null
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          order_index?: number
          recipe_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bake_workflow_nodes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "bake_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_accounts: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          channel: string
          created_at: string
          delivery_status: string
          destination: string
          id: string
          payload: Json
          provider_message_id: string | null
          sent_at: string | null
          ticket_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          delivery_status?: string
          destination: string
          id?: string
          payload?: Json
          provider_message_id?: string | null
          sent_at?: string | null
          ticket_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          delivery_status?: string
          destination?: string
          id?: string
          payload?: Json
          provider_message_id?: string | null
          sent_at?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          client_account_id: string
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          client_account_id: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          client_account_id?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size_bytes: number
          id: string
          mime_type: string
          storage_path: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size_bytes: number
          id?: string
          mime_type: string
          storage_path: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size_bytes?: number
          id?: string
          mime_type?: string
          storage_path?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          ticket_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          ticket_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_events_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          author_type: string
          channel: string
          created_at: string
          external_id: string | null
          id: string
          message: string
          message_type: string
          ticket_id: string
          visibility: string
        }
        Insert: {
          author_type: string
          channel: string
          created_at?: string
          external_id?: string | null
          id?: string
          message: string
          message_type?: string
          ticket_id: string
          visibility?: string
        }
        Update: {
          author_type?: string
          channel?: string
          created_at?: string
          external_id?: string | null
          id?: string
          message?: string
          message_type?: string
          ticket_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          client_account_id: string
          closed_at: string | null
          created_at: string
          description: string
          id: string
          origin_channel: string
          product_id: string
          protocol: string
          requester_email: string | null
          requester_name: string
          requester_whatsapp: string | null
          resolution_details: string | null
          resolution_public: boolean
          resolution_summary: string | null
          resolved_at: string | null
          status: string
          subject: string | null
          updated_at: string
          widget_channel_id: string | null
        }
        Insert: {
          client_account_id: string
          closed_at?: string | null
          created_at?: string
          description: string
          id?: string
          origin_channel?: string
          product_id: string
          protocol: string
          requester_email?: string | null
          requester_name: string
          requester_whatsapp?: string | null
          resolution_details?: string | null
          resolution_public?: boolean
          resolution_summary?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          widget_channel_id?: string | null
        }
        Update: {
          client_account_id?: string
          closed_at?: string | null
          created_at?: string
          description?: string
          id?: string
          origin_channel?: string
          product_id?: string
          protocol?: string
          requester_email?: string | null
          requester_name?: string
          requester_whatsapp?: string | null
          resolution_details?: string | null
          resolution_public?: boolean
          resolution_summary?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          widget_channel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_widget_channel_id_fkey"
            columns: ["widget_channel_id"]
            isOneToOne: false
            referencedRelation: "widget_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      widget_channels: {
        Row: {
          created_at: string
          environment: string
          id: string
          is_active: boolean
          primary_color: string | null
          product_id: string
          welcome_text: string | null
          widget_key: string
        }
        Insert: {
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          primary_color?: string | null
          product_id: string
          welcome_text?: string | null
          widget_key: string
        }
        Update: {
          created_at?: string
          environment?: string
          id?: string
          is_active?: boolean
          primary_color?: string | null
          product_id?: string
          welcome_text?: string | null
          widget_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "widget_channels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      widget_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          widget_channel_id: string
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          widget_channel_id: string
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          widget_channel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "widget_domains_widget_channel_id_fkey"
            columns: ["widget_channel_id"]
            isOneToOne: false
            referencedRelation: "widget_channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_ticket_protocol: { Args: never; Returns: string }
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
