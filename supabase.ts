import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from './env';

let supabaseClient: SupabaseClient | null = null;

if (ENV.SUPABASE_URL && ENV.SUPABASE_KEY) {
  try {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);
    console.log('⚡ Supabase Client initialized successfully.');
  } catch (err) {
    console.warn('⚠️ Supabase client initialization failed, falling back to local auth mode.');
  }
} else {
  console.log('ℹ️ Supabase credentials not provided. Operating in standalone local authentication mode.');
}

export const supabase = supabaseClient;
