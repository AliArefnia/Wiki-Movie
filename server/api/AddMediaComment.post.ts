import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.SUPABASE_URL,
  config.public.SUPABASE_KEY
);

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { comment, userId, mediaId } = body;

    if (!comment || !userId || !mediaId) {
      return { error: "Missing required fields" };
    }

    const { data, error } = await supabase.from("reviews").insert([
      {
        comment,
        user_id: userId,
        movie_id: mediaId,
      },
    ]);

    if (error) {
      console.error(error);
      return { error: "Failed to insert comment" };
    }

    return { success: true };
  } catch (e) {
    return { error: "Server error while inserting comment" };
  }
});
