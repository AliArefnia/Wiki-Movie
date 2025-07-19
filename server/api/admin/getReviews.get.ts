import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const status = query.status;

  let supaQuery = supabase
    .from("reviews")
    .select("id, comment, status, created_at, movie_id, user:user_id(id, name)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    supaQuery = supaQuery.eq("status", status);
  }

  const { data, error } = await supaQuery;

  if (error) return { error: error.message };
  return data;
});
