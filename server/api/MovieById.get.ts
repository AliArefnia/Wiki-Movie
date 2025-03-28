import type { Movie } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const config = useRuntimeConfig();
    const movieId = query.movieId;

    const IMAGE_URL = "https://image.tmdb.org/t/p/w154";

    const response = await $fetch<Movie>(
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
      id: response.id,
      title: response.title,
      vote_average: Number(response.vote_average.toFixed(1)),
      poster_path: `${IMAGE_URL}${response.poster_path}`,
      release_date: response.release_date.slice(0, 4),
      genre_ids: response.genre_ids,
    };
  } catch (error) {
    console.log(error);
    console.error("Error fetching movies by search:", error);
    return { error: "Failed to fetch movies by search" };
  }
});
