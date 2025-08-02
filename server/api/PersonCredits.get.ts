import { CombinedCreditsResponse, Movie, TvShow } from "~/types/types";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const config = useRuntimeConfig();

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "id not found!",
    });
  }

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
  };

  try {
    const url = `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`;
    const data = await $fetch<CombinedCreditsResponse>(url, { headers });

    const personCredits = data.cast.map((item) => {
      if (item.media_type === "movie") {
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
    return personCredits;
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
