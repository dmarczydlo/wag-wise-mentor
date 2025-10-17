export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          language_preference: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          language_preference?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          language_preference?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      puppies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          breed: string;
          birthday: string;
          current_weight: number | null;
          target_weight: number | null;
          activity_level: string;
          photo_url: string | null;
          characteristics: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          breed: string;
          birthday: string;
          current_weight?: number | null;
          target_weight?: number | null;
          activity_level?: string;
          photo_url?: string | null;
          characteristics?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          breed?: string;
          birthday?: string;
          current_weight?: number | null;
          target_weight?: number | null;
          activity_level?: string;
          photo_url?: string | null;
          characteristics?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      weight_records: {
        Row: {
          id: string;
          puppy_id: string;
          weight_kg: number;
          recorded_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          weight_kg: number;
          recorded_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          weight_kg?: number;
          recorded_date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      food_types: {
        Row: {
          id: string;
          brand_name: string;
          product_name: string;
          protein_percent: number | null;
          fat_percent: number | null;
          calories_per_100g: number | null;
          feeding_guidelines: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand_name: string;
          product_name: string;
          protein_percent?: number | null;
          fat_percent?: number | null;
          calories_per_100g?: number | null;
          feeding_guidelines?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand_name?: string;
          product_name?: string;
          protein_percent?: number | null;
          fat_percent?: number | null;
          calories_per_100g?: number | null;
          feeding_guidelines?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      food_assignments: {
        Row: {
          id: string;
          puppy_id: string;
          food_type_id: string;
          percentage: number;
          start_date: string;
          end_date: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          food_type_id: string;
          percentage?: number;
          start_date?: string;
          end_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          food_type_id?: string;
          percentage?: number;
          start_date?: string;
          end_date?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      feeding_schedules: {
        Row: {
          id: string;
          puppy_id: string;
          meal_number: number;
          target_time: string;
          portion_grams: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          meal_number: number;
          target_time: string;
          portion_grams: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          meal_number?: number;
          target_time?: string;
          portion_grams?: number;
          active?: boolean;
          created_at?: string;
        };
      };
      feeding_logs: {
        Row: {
          id: string;
          puppy_id: string;
          scheduled_feeding_id: string | null;
          actual_time: string;
          actual_portion: number | null;
          notes: string | null;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          scheduled_feeding_id?: string | null;
          actual_time?: string;
          actual_portion?: number | null;
          notes?: string | null;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          scheduled_feeding_id?: string | null;
          actual_time?: string;
          actual_portion?: number | null;
          notes?: string | null;
          completed?: boolean;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          puppy_id: string;
          type: string;
          title: string;
          scheduled_date: string;
          completed_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          type: string;
          title: string;
          scheduled_date: string;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          type?: string;
          title?: string;
          scheduled_date?: string;
          completed_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      routines: {
        Row: {
          id: string;
          puppy_id: string;
          type: string;
          title: string;
          frequency: string;
          target_time: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          type: string;
          title: string;
          frequency: string;
          target_time?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          type?: string;
          title?: string;
          frequency?: string;
          target_time?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: {
          [key: string]: never;
        };
        Returns: undefined;
      };
      update_updated_at: {
        Args: {
          [key: string]: never;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
