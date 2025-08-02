import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, favouritePerson, action } = body;

  try {
    const { data: user, error: getError } = await supabase
      .from("users")
      .select("favourite_person_list")
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
        ? [...(user.favourite_person_list || []), favouritePerson]
        : user.favourite_person_list.filter(
            (person: { id: number; mediaType: "person" }) =>
              person.id !== favouritePerson.id
          );

    const { error } = await supabase
      .from("users")
      .update({ favourite_person_list: updatedList })
      .eq("id", userId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }
    return {
      message: "Favorite person list updated",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
