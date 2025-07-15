import { createClient } from "@supabase/supabase-js";
const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  try {
    const { mediaId } = getQuery(event);

    if (!mediaId) {
      return { error: "Missing media Id!" };
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id,comment,created_at,user:user_id(name)")
      .eq("movie_id", mediaId);

    return data;
  } catch (error) {
    return { error: "Failed to fetch comments for movie" };
  }
});
