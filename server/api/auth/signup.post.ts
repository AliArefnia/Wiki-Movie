import { createClient } from "@supabase/supabase-js";
const config = useRuntimeConfig();

const supabase = createClient(
  `${config.SUPABASE_URL}`,
  `${config.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const { error: insertError } = await supabase.from("users").insert([
    {
      email,
    },
  ]);

  if (insertError) {
    return { error: insertError.message };
  }

  return {
    user: data.user,
    message: "User signed up successfully!",
  };
});
