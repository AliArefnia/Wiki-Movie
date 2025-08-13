import type { MovieDetail, TvDetail, PersonDetail } from "~/types/types";
import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const { id, media_type } = getQuery(event);

  const config = useRuntimeConfig();

  if (!id || !media_type) {
    throw createError({
      statusCode: 400,
      statusMessage: "id or media_type not found!",
    });
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

    if (!res || !res.id) {
      throw createError({ statusCode: 404, message: "Media not found" });
    }

    if (media_type === "movie" && isMovieDetail(res)) {
      return {
        media_type: "movie",
        id: res.id,
        title: res.title,
        vote_average: Number(res.vote_average?.toFixed(1) || "0.0"),
        popularity: Number(res.popularity?.toFixed(2) || "0.0"),
        release_date: res.release_date?.slice(0, 4) || "N/A",
        poster_path: res.poster_path,
        backdrop_path: res.backdrop_path,
        runtime: res.runtime,
        overview: res.overview,
        tagline: res.tagline,
        genres: res.genres ?? [],
        genre_ids: res.genres?.map((g: any) => g.id) ?? [],
      };
    }

    if (media_type === "tv" && isTvDetail(res)) {
      return {
        media_type: "tv",
        id: res.id,
        name: res.name,
        vote_average: Number(res.vote_average?.toFixed(1) || "0.0"),
        popularity: Number(res.popularity?.toFixed(2) || "0.0"),
        release_date: res.first_air_date?.slice(0, 4) || "N/A",
        poster_path: res.poster_path,
        backdrop_path: res.backdrop_path,
        overview: res.overview,
        tagline: res.tagline,
        genres: res.genres ?? [],
        genre_ids: res.genres?.map((g: any) => g.id) ?? [],
        number_of_seasons: res.number_of_seasons,
        seasons: res.seasons,
      };
    }

    if (media_type === "person" && isPersonDetail(res)) {
      return {
        media_type: "person",
        id: res.id,
        name: res.name,
        profile_path: res.profile_path,
        biography: res.biography,
        birthday: res.birthday,
        place_of_birth: res.place_of_birth,
        popularity: res.popularity,
        known_for_department: res.known_for_department,
      };
    }

    throw createError({ statusCode: 400, message: "Invalid media type" });
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Failed to fetch media detail",
    });
  }
});

function isMovieDetail(obj: any): obj is MovieDetail {
  return "title" in obj && "runtime" in obj;
}

function isTvDetail(obj: any): obj is TvDetail {
  return "name" in obj && "number_of_seasons" in obj;
}

function isPersonDetail(obj: any): obj is PersonDetail {
  return "biography" in obj && "known_for_department" in obj;
}
