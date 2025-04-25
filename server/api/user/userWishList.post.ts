import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, wishedMedia, action } = body;
  const { data: user, error: getError } = await supabase
    .from("users")
    .select("wish_list")
    .eq("id", userId)
    .single();

  if (getError || !user)
    return { error: getError?.message || "User not found" };

  const updatedList =
    action === "add"
      ? [...user.wish_list, wishedMedia]
      : user.wish_list.filter(
          (media: { id: number; mediaType: "tv" | "movie" }) =>
            media.id !== wishedMedia.id
        );

  const { error } = await supabase
    .from("users")
    .update({ wish_list: updatedList })
    .eq("id", userId);

  if (error) return { error: error.message };
  return { message: "Wishlist updated" };
});
