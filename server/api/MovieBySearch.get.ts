import type { MovieGet } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const { width, searchTerm, page } = getQuery(event);

    const IMAGE_URL = `https://image.tmdb.org/t/p/w${width}`;

    const response = await $fetch<MovieGet>(
      `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&include_adult=false&language=en-US&page=${page}`,
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
    console.log(error);
    console.error("Error fetching movies by search:", error);
    return { error: "Failed to fetch movies by search" };
  }
});
