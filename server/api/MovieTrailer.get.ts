import type { trailerOfMovie } from "@/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const movieId = query.movieId;

    const moviesResponse = await $fetch<trailerOfMovie>(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY} `,
        },
      }
    );
    return moviesResponse.results.find(
      (video) => video.type === "Trailer" && video.official === true
    );
  } catch (error) {
    console.error("Error fetching movie Trailer:", error);
    return { error: "Failed to fetch movie trailer" };
  }
});
