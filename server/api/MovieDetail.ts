import type { MovieDetail } from "~/types/types";

export default defineEventHandler(async (event) => {
  const { movieId } = getQuery(event);
  const config = useRuntimeConfig();

  try {
    const response = await $fetch<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    return {
      ...response,
      vote_average: Number(response.vote_average.toFixed(1) || 0),
      popularity: Number(response.popularity.toFixed(2) || 0),
      release_date: response.release_date.slice(0, 4) || "N/A",
    };
  } catch (error) {
    console.error("Error fetching movie Detail:", error);
    return { error: "Failed to fetch movie Detail" };
  }
});
