import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_url_here') && 
  !supabaseAnonKey.includes('your_supabase_anon_key_here') &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-key';

if (!isConfigured) {
  console.warn('Supabase environment variables not configured. Please click "Connect to Supabase" to set up your database.');
}

export const supabase = isConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
