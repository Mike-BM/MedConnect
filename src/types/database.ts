export interface Database {
  public: {
    Tables: {
      hospitals: {
        Row: {
          id: string;
          name: string;
          location: string;
          departments: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          departments: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          departments?: string[];
          created_at?: string;
        };
      };
      doctors: {
        Row: {
          id: string;
          hospital_id: string;
          name: string;
          specialization: string;
          availability: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          hospital_id: string;
          name: string;
          specialization: string;
          availability: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          hospital_id?: string;
          name?: string;
          specialization?: string;
          availability?: string[];
          created_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          contact_info: string;
          medical_history: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          contact_info: string;
          medical_history?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          contact_info?: string;
          medical_history?: string;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string;
          date: string;
          time: string;
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          doctor_id: string;
          date: string;
          time: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          doctor_id?: string;
          date?: string;
          time?: string;
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
    };
  };
}

export type Hospital = Database['public']['Tables']['hospitals']['Row'];
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Patient = Database['public']['Tables']['patients']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];