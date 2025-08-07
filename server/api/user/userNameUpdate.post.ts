import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, userName } = body;

  try {
    if (!userId || !userName) {
      throw createError({
        statusCode: 404,
        statusMessage: "User/Name not found",
      });
    }

    const { error } = await supabase
      .from("users")
      .update({ name: userName })
      .eq("id", userId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return {
      message: "User Name updated",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
