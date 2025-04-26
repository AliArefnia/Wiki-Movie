import type { MediaItem, Movie, TvShow } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const { mediaId, mediaType } = getQuery(event);
    const config = useRuntimeConfig();

    if (!mediaId || !mediaType) {
      return { error: "Media ID or Media Type is required" };
    }

    const IMAGE_URL = "https://image.tmdb.org/t/p/w154";

    const response = await $fetch<any>(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    if (mediaType === "movie") {
      const movie: Movie = {
        id: response.id,
        media_type: "movie",
        title: response.title ?? "Untitled",
        vote_average: Number(response.vote_average?.toFixed(1) || 0),
        poster_path: `${IMAGE_URL}${response.poster_path}` || null,
        release_date: response.release_date?.slice(0, 4) ?? "N/A",
        genre_ids: response.genre_ids ?? [],
      };
      return movie;
    }
    if (mediaType === "tv") {
      const tvShow: TvShow = {
        id: response.id,
        media_type: "tv",
        name: response.name ?? "Untitled",
        vote_average: Number(response.vote_average?.toFixed(1) || 0),
        poster_path: `${IMAGE_URL}${response.poster_path}` || null,
        first_air_date: response.first_air_date?.slice(0, 4) ?? "N/A",
        genre_ids: response.genre_ids ?? [],
      };
      return tvShow;
    }
  } catch (error) {
    console.log(error);
    console.error("Error fetching movies by search:", error);
    return { error: "Failed to fetch movies by search" };
  }
});
