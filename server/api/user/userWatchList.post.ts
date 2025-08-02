import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, watchedMedia, action } = body;

  try {
    const { data: user, error: getError } = await supabase
      .from("users")
      .select("watch_list")
      .eq("id", userId)
      .single();

    if (getError || !user) {
      throw createError({
        statusCode: 404,
        statusMessage: getError?.message || "User not found",
      });
    }

    const updatedList =
      action === "add"
        ? [...(user.watch_list || []), watchedMedia]
        : user.watch_list.filter(
            (media: { id: number; mediaType: "tv" | "movie" }) =>
              media.id !== watchedMedia.id
          );

    const { error } = await supabase
      .from("users")
      .update({ watch_list: updatedList })
      .eq("id", userId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return {
      message: "Watch list updated",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
