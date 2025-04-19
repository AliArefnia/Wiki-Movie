import type { MovieDetail, TvDetail, PersonDetail } from "~/types/types";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id, media_type } = getQuery(event);

  const config = useRuntimeConfig();

  if (!id || !media_type) {
    return { error: "Missing ID or media type" };
  }

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
  };

  const url = `https://api.themoviedb.org/3/${media_type}/${id}?language=en-US`;

  try {
    const res = await $fetch<MovieDetail | TvDetail | PersonDetail>(url, {
      headers,
    });

    if (res && res.id) {
      switch (media_type) {
        case "movie":
          const movie = res as MovieDetail;
          return {
            ...movie,
            media_type: "movie",
            vote_average: Number(movie.vote_average?.toFixed(1) || 0),
            popularity: Number(movie.popularity?.toFixed(2) || 0),
            release_date: movie.release_date?.slice(0, 4) || "N/A",
          };

        case "tv":
          const tv = res as TvDetail;
          return {
            ...tv,
            media_type: "tv",
            vote_average: Number(tv.vote_average?.toFixed(1) || 0),
            popularity: Number(tv.popularity?.toFixed(2) || 0),
            release_date: tv.first_air_date?.slice(0, 4) || "N/A",
          };

        case "person":
          const person = res as PersonDetail;
          return {
            ...person,
            media_type: "person",
          };
      }
    }
  } catch (e) {
    return { error: `Failed to fetch ${media_type} with ID ${id}` };
  }

  return { error: `No detail found for ${media_type} with ID: ${id}` };
});
