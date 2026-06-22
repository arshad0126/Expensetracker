import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-url-please-setup.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key-please-setup';

export const isSupabaseConfigured = 
  !!process.env.REACT_APP_SUPABASE_URL && 
  !!process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables are missing! Cloud sync will be disabled. ' +
    'Please create a .env file with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
