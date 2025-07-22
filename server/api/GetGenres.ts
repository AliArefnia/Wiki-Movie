import type { Genre } from "~/types/types";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const type = query.type === "tv" ? "tv" : "movie";

  const response = await $fetch<{ genres: Genre[] }>(
    `https://api.themoviedb.org/3/genre/${type}/list?language=en-US`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
      },
    }
  );
  return response.genres;
});
