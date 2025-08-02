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
      throw createError({ statusCode: 404, message: "mediaId not found" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("id,comment,created_at,user:user_id(id,name)")
      .eq("status", "approved")
      .eq("movie_id", mediaId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to fetch comments",
      });
    }

    return data;
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
