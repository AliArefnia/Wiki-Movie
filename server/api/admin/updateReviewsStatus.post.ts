import { createClient } from "@supabase/supabase-js";

const config = useRuntimeConfig();

const supabase = createClient(
  `${config.public.SUPABASE_URL}`,
  `${config.public.SUPABASE_KEY}`
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { reviewId, status } = body;

  if (!["approved", "rejected", "pending"].includes(status)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId);

  if (error) return { error: error.message };
  return { success: true };
});
