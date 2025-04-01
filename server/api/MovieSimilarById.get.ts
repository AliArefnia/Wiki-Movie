import type { SimilarMovies } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const movieId = query.movieId;
    const posterWidth = query.width;

    const IMAGE_URL = `https://image.tmdb.org/t/p/w${posterWidth}`;

    const response = await $fetch<SimilarMovies>(
      `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );
    return response.results.map(
      ({ id, title, vote_average, poster_path, release_date }) => ({
        id,
        title,
        vote_average: Number(vote_average.toFixed(1)),
        poster_path: `${IMAGE_URL}${poster_path}`,
        release_date: release_date.slice(0, 4),
      })
    );
  } catch (error) {
    console.log(error);
    console.error("Error fetching similar movies:", error);
    return { error: "Failed to fetch similar movies" };
  }
});
