import type { Movie, MovieGet } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const config = useRuntimeConfig();

    const searchTerm = query.searchTerm;
    const page = query.page;

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
        title,
        vote_average: Number(vote_average.toFixed(1)),
        poster_path,
        release_date: release_date.slice(0, 4),
        genre_ids,
      })
    );
  } catch (error) {
    console.log(error);
    console.error("Error fetching movies by search:", error);
    return { error: "Failed to fetch movies by search" };
  }
});
