import type { TrendingMoviesResponse } from "@/types/types";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const posterWidth = query.width;
    const IMAGE_URL = `https://image.tmdb.org/t/p/w${posterWidth}`;

    const response = await $fetch<TrendingMoviesResponse>(
      "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
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
        poster_path: `${IMAGE_URL}${poster_path}`,
        release_date: release_date.slice(0, 4),
        genre_ids,
      })
    );
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return { error: "Failed to fetch trending movies" };
  }
});
