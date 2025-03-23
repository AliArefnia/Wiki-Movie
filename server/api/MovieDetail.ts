import type { MovieDetail } from "~/types/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const movieId = query.movieId;

  const config = useRuntimeConfig();

  try {
    const response = await $fetch<MovieDetail>(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.TMDB_API_KEY}`,
        },
      }
    );

    return {
      ...response,
      vote_average: Number(response.vote_average.toFixed(1)),
      popularity: Number(response.popularity.toFixed(2)),
      release_date: response.release_date.slice(0, 4),
    };
  } catch (error) {
    console.error("Error fetching movie Detail:", error);
    return { error: "Failed to fetch movie Detail" };
  }
});
