import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase.functions.invoke('send-inquiry', {
  body: { name: 'Test', email: 'test@example.com', phone: '123', message: 'test' }
}).then(res => {
  console.log("RESPONSE:", res);
}).catch(err => {
  console.error("ERROR:", err);
});
