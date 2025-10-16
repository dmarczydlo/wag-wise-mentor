export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      events: {
        Row: {
          completed_date: string | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          puppy_id: string;
          scheduled_date: string;
          title: string;
          type: string;
        };
        Insert: {
          completed_date?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id: string;
          scheduled_date: string;
          title: string;
          type: string;
        };
        Update: {
          completed_date?: string | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id?: string;
          scheduled_date?: string;
          title?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
        ];
      };
      feeding_logs: {
        Row: {
          actual_portion: number | null;
          actual_time: string | null;
          completed: boolean | null;
          created_at: string | null;
          id: string;
          notes: string | null;
          puppy_id: string;
          scheduled_feeding_id: string | null;
        };
        Insert: {
          actual_portion?: number | null;
          actual_time?: string | null;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id: string;
          scheduled_feeding_id?: string | null;
        };
        Update: {
          actual_portion?: number | null;
          actual_time?: string | null;
          completed?: boolean | null;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id?: string;
          scheduled_feeding_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "feeding_logs_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "feeding_logs_scheduled_feeding_id_fkey";
            columns: ["scheduled_feeding_id"];
            isOneToOne: false;
            referencedRelation: "feeding_schedules";
            referencedColumns: ["id"];
          },
        ];
      };
      feeding_schedules: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          id: string;
          meal_number: number;
          portion_grams: number;
          puppy_id: string;
          target_time: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          meal_number: number;
          portion_grams: number;
          puppy_id: string;
          target_time: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          meal_number?: number;
          portion_grams?: number;
          puppy_id?: string;
          target_time?: string;
        };
        Relationships: [
          {
            foreignKeyName: "feeding_schedules_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
        ];
      };
      food_assignments: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          end_date: string | null;
          food_type_id: string;
          id: string;
          percentage: number | null;
          puppy_id: string;
          start_date: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          end_date?: string | null;
          food_type_id: string;
          id?: string;
          percentage?: number | null;
          puppy_id: string;
          start_date?: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          end_date?: string | null;
          food_type_id?: string;
          id?: string;
          percentage?: number | null;
          puppy_id?: string;
          start_date?: string;
        };
        Relationships: [
          {
            foreignKeyName: "food_assignments_food_type_id_fkey";
            columns: ["food_type_id"];
            isOneToOne: false;
            referencedRelation: "food_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "food_assignments_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
        ];
      };
      food_types: {
        Row: {
          brand_name: string;
          calories_per_100g: number | null;
          created_at: string | null;
          fat_percent: number | null;
          feeding_guidelines: Json | null;
          id: string;
          product_name: string;
          protein_percent: number | null;
        };
        Insert: {
          brand_name: string;
          calories_per_100g?: number | null;
          created_at?: string | null;
          fat_percent?: number | null;
          feeding_guidelines?: Json | null;
          id?: string;
          product_name: string;
          protein_percent?: number | null;
        };
        Update: {
          brand_name?: string;
          calories_per_100g?: number | null;
          created_at?: string | null;
          fat_percent?: number | null;
          feeding_guidelines?: Json | null;
          id?: string;
          product_name?: string;
          protein_percent?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          language_preference: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          language_preference?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          language_preference?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      puppies: {
        Row: {
          activity_level: string | null;
          birthday: string;
          breed: string;
          characteristics: Json | null;
          created_at: string | null;
          current_weight: number | null;
          id: string;
          name: string;
          owner_id: string;
          photo_url: string | null;
          target_weight: number | null;
          updated_at: string | null;
        };
        Insert: {
          activity_level?: string | null;
          birthday: string;
          breed: string;
          characteristics?: Json | null;
          created_at?: string | null;
          current_weight?: number | null;
          id?: string;
          name: string;
          owner_id: string;
          photo_url?: string | null;
          target_weight?: number | null;
          updated_at?: string | null;
        };
        Update: {
          activity_level?: string | null;
          birthday?: string;
          breed?: string;
          characteristics?: Json | null;
          created_at?: string | null;
          current_weight?: number | null;
          id?: string;
          name?: string;
          owner_id?: string;
          photo_url?: string | null;
          target_weight?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "puppies_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      routines: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          frequency: string;
          id: string;
          puppy_id: string;
          target_time: string | null;
          title: string;
          type: string;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          frequency: string;
          id?: string;
          puppy_id: string;
          target_time?: string | null;
          title: string;
          type: string;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          frequency?: string;
          id?: string;
          puppy_id?: string;
          target_time?: string | null;
          title?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "routines_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
        ];
      };
      weight_records: {
        Row: {
          created_at: string | null;
          id: string;
          notes: string | null;
          puppy_id: string;
          recorded_date: string;
          weight_kg: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id: string;
          recorded_date?: string;
          weight_kg: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          puppy_id?: string;
          recorded_date?: string;
          weight_kg?: number;
        };
        Relationships: [
          {
            foreignKeyName: "weight_records_puppy_id_fkey";
            columns: ["puppy_id"];
            isOneToOne: false;
            referencedRelation: "puppies";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
