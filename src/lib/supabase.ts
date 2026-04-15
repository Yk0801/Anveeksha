import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder_key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error("CRITICAL: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing from .env, or the Vite server needs a restart to pick them up.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
