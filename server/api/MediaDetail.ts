import type { MovieDetail, TvDetail, PersonDetail } from "~/types/types";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id } = getQuery(event);
  const config = useRuntimeConfig();

  if (!id) {
    return { error: "Missing ID" };
  }

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
  };

  const mediaTypes: {
    type: "movie" | "tv" | "person";
    url: string;
  }[] = [
    {
      type: "movie",
      url: `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    },
    {
      type: "tv",
      url: `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
    },
    {
      type: "person",
      url: `https://api.themoviedb.org/3/person/${id}?language=en-US`,
    },
  ];

  for (const { type, url } of mediaTypes) {
    try {
      const res = await $fetch<MovieDetail | TvDetail | PersonDetail>(url, {
        headers,
      });

      if (res && res.id) {
        if (type === "movie") {
          const movie = res as MovieDetail;
          return {
            ...movie,
            media_type: "movie",
            vote_average: Number(movie.vote_average?.toFixed(1) || 0),
            popularity: Number(movie.popularity?.toFixed(2) || 0),
            release_date: movie.release_date?.slice(0, 4) || "N/A",
          };
        }

        if (type === "tv") {
          const tv = res as TvDetail;
          return {
            ...tv,
            media_type: "tv",
            vote_average: Number(tv.vote_average?.toFixed(1) || 0),
            popularity: Number(tv.popularity?.toFixed(2) || 0),
            release_date: tv.first_air_date?.slice(0, 4) || "N/A",
          };
        }

        if (type === "person") {
          const person = res as PersonDetail;
          return {
            ...person,
            media_type: "person",
          };
        }
      }
    } catch {
      // keep looping to next type
    }
  }

  return { error: `No media detail found for ID: ${id}` };
});
