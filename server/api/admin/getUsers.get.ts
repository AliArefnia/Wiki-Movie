import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email");

  if (error) {
    return { error: error.message };
  }

  return data;
});
