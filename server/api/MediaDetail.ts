import type { MovieDetail } from "~/types/types";

export default defineEventHandler(async (event) => {
  const { mediaType, id } = getQuery(event);
  const config = useRuntimeConfig();

  if (!mediaType || !id) {
    return { error: "Missing mediaType or id" };
  }

  try {
    const response = await $fetch<MovieDetail>(
      `https://api.themoviedb.org/3/${mediaType}/${id}?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    if (mediaType === "movie" || mediaType === "tv") {
      response.vote_average = Number(response.vote_average.toFixed(1) || 0);
      response.popularity = Number(response.popularity.toFixed(2) || 0);
      response.release_date = response.release_date?.slice(0, 4) || "N/A";
    }

    return response;
  } catch (error) {
    console.error("Error fetching movie Detail:", error);
    return { error: "Failed to fetch movie Detail" };
  }
});
