import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId } = body;

  if (!userId) {
    throw createError({ statusCode: 400, message: "Missing userId" });
  }

  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) {
    return {
      status: 500,
      message: "Failed to delete user",
      error: error.message,
    };
  }

  return { status: 200, message: "User deleted successfully" };
});
