import type { Movie, TvShow } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const { mediaId, mediaType } = getQuery(event);

    if (!mediaId || !mediaType) {
      throw createError({
        statusCode: 400,
        statusMessage: "mediaId or mediaType not found!",
      });
    }

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
          vote_average: Number(item.vote_average?.toFixed(1) || "N/A"),
          poster_path: item.poster_path ?? null,
          release_date: item.release_date?.slice(0, 4) ?? "N/A",
          genre_ids: item.genre_ids ?? [],
        };
        return movie;
      } else {
        const tvShow: TvShow = {
          id: item.id,
          media_type: "tv",
          name: item.name ?? "Untitled",
          vote_average: Number(item.vote_average?.toFixed(1) || "N/A"),
          poster_path: item.poster_path ?? null,
          first_air_date: item.first_air_date?.slice(0, 4) ?? "N/A",
          genre_ids: item.genre_ids ?? [],
        };
        return tvShow;
      }
    });
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
