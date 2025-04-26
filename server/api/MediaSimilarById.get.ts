import type { Movie, TvShow } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const { mediaId, width, mediaType } = getQuery(event);

    if (!mediaId || !mediaType) {
      return { error: "Missing mediaId or mediaType in query" };
    }

    const IMAGE_URL = `https://image.tmdb.org/t/p/w${width}`;

    const response = await $fetch<{ results: any[] }>(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}/similar?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );
    return response.results.map((item) => {
      if (mediaType === "movie") {
        const movie: Movie = {
          id: item.id,
          media_type: "movie",
          title: item.title ?? "Untitled",
          vote_average: Number(item.vote_average?.toFixed(1) || 0),
          poster_path: `${IMAGE_URL}${item.poster_path}` || null,
          release_date: item.release_date?.slice(0, 4) ?? "N/A",
          genre_ids: item.genre_ids ?? [],
        };
        return movie;
      } else {
        const tvShow: TvShow = {
          id: item.id,
          media_type: "tv",
          name: item.name ?? "Untitled",
          vote_average: Number(item.vote_average?.toFixed(1) || 0),
          poster_path: `${IMAGE_URL}${item.poster_path}` || null,
          first_air_date: item.first_air_date?.slice(0, 4) ?? "N/A",
          genre_ids: item.genre_ids ?? [],
        };
        return tvShow;
      }
    });
  } catch (error) {
    console.log(error);
    console.error("Error fetching similar movies:", error);
    return { error: "Failed to fetch similar movies" };
  }
});
