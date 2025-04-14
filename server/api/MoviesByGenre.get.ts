import type { MoviesByGenre } from "@/types/types";
const IMAGE_URL = "https://image.tmdb.org/t/p/w154";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const genreId = query.genreId;
    const page = query.page;

    if (!genreId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Genre ID is required",
      });
    }

    const config = useRuntimeConfig();
    const response = await $fetch<MoviesByGenre>(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${genreId}&page=${page}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    return response.results.map(
      ({ id, title, vote_average, poster_path, release_date, genre_ids }) => ({
        id,
        title: title ?? "Untitled",
        vote_average: Number(vote_average.toFixed(1) || 0),
        poster_path: `${IMAGE_URL}${poster_path}`,
        release_date: release_date.slice(0, 4) || "N/A",
        genre_ids: genre_ids || [],
      })
    );
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return { error: "Failed to fetch movies by genre" };
  }
});
