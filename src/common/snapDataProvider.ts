import { supabaseDataProvider } from "ra-supabase";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const client = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_API_KEY,
) as SupabaseClient;

const baseProvider = supabaseDataProvider({
  instanceUrl: import.meta.env.VITE_SUPABASE_URL,
  apiKey: import.meta.env.VITE_SUPABASE_API_KEY,
  supabaseClient: client,
});

const snapDataProvider = {
  ...baseProvider,
  createMany: async (resource: string, params: any) => {
    const { data, error } = await client.from(resource).insert(params.data);
    if (error) throw new Error(error.message);
    return { data };
  },
};

export { snapDataProvider, client as supabaseClient };
