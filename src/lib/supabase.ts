import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jnyqemghjbdujskpufel.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpueXFlbWdoamJkdWpza3B1ZmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzOTYyMTUsImV4cCI6MjEwMzk3MjIxNX0.boWwwtaKWWNHKRlv3NXxWfOXza19oK1OH3jfAoCOSRg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
