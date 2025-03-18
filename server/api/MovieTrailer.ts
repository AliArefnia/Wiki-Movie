import type { MovieListWithTrailer, MovieGet } from "@/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const moviesResponse = await $fetch<MovieGet>(
      `https://api.themoviedb.org/3/trending/movie/week?&with_video=true`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.TMDB_API_KEY} `,
        },
      }
    );

    const moviesWithTrailers: MovieListWithTrailer = {
      results: await Promise.all(
        moviesResponse.results.map(async (movie) => {
          const trailerMovies = await $fetch<{
            results: { key: string; type: string; official: boolean }[];
          }>(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${config.TMDB_API_KEY}`,
            },
          });

          const officialTrailer = trailerMovies.results.find(
            (video) => video.type === "Trailer" && video.official === true
          );

          return {
            ...movie,
            officialTrailerKey: officialTrailer ? officialTrailer.key : null,
          };
        })
      ),
    };

    console.log(moviesResponse);
    return moviesWithTrailers;
  } catch (error) {
    console.error("Error fetching movie Trailer:", error);
    return { error: "Failed to fetch movie trailer" };
  }
});
