import { createClient } from "@supabase/supabase-js";
const config = useRuntimeConfig();

const supabase = createClient(
  `${config.SUPABASE_URL}`,
  `${config.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  return {
    user: data.user,
    session: data.session,
    message: "Logged in successfully!",
  };
});
