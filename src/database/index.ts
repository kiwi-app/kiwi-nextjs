import * as supabase from '@supabase/supabase-js';

let client: supabase.SupabaseClient | null = null;

export default function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_KIWI_SUPABASE_URL) throw 'kiwi supabase url must be informed';
  if (!process.env.NEXT_PUBLIC_KIWI_SUPABASE_ANON_KEY) throw 'kiwi supabase anon key must be informed';
  
  if (!client) {
    client = supabase.createClient(
      `${process.env.NEXT_PUBLIC_KIWI_SUPABASE_URL}`,
      `${process.env.NEXT_PUBLIC_KIWI_SUPABASE_ANON_KEY}`,
      {
        global: {
          fetch: fetch.bind(globalThis),
        },
      },
    );
  }

  return client;
}
