import type { trailerOfMovie } from "@/types/types";

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

    const moviesResponse = await $fetch<trailerOfMovie>(
      `https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY} `,
        },
      }
    );
    return moviesResponse.results.find(
      (video) => video.type === "Trailer" && video.official === true
    );
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
