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
      throw createError({
        statusCode: 404,
        statusMessage: "Comment/User/mediaId not found",
      });
    }

    const { data, error } = await supabase.from("reviews").insert([
      {
        comment,
        user_id: userId,
        movie_id: mediaId,
      },
    ]);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message || "Failed to insert comment",
      });
    }

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
