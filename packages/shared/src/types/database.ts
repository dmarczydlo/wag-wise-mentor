export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          role: string;
          is_email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          role?: string;
          is_email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          role?: string;
          is_email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      puppies: {
        Row: {
          id: string;
          name: string;
          breed: string;
          birth_date: string;
          weight: number;
          owner_id: string;
          photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          breed: string;
          birth_date: string;
          weight: number;
          owner_id: string;
          photos?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          breed?: string;
          birth_date?: string;
          weight?: number;
          owner_id?: string;
          photos?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      medical_records: {
        Row: {
          id: string;
          puppy_id: string;
          type: string;
          description: string;
          date: string;
          veterinarian?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          type: string;
          description: string;
          date: string;
          veterinarian?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          type?: string;
          description?: string;
          date?: string;
          veterinarian?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      weight_records: {
        Row: {
          id: string;
          puppy_id: string;
          weight: number;
          date: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          puppy_id: string;
          weight: number;
          date: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          puppy_id?: string;
          weight?: number;
          date?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
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
  };
}
