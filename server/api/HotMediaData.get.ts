import type { Movie, TvShow, HotMedia } from "@/types/types";
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const NUMBER_OF_SELECTED_MOVIES = 7;
    const NUMBER_OF_SELECTED_TVS = 3;
    const query = getQuery(event);
    const mediaType = query.type || "all";

    const fetchHeaders = {
      accept: "application/json",
      Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
    };

    const fetchMovies: () => Promise<Movie[]> = async () => {
      const { results } = await $fetch<{ results: Movie[] }>(
        "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
        { headers: fetchHeaders }
      );
      return results.map((movie) => ({
        ...movie,
        media_type: "movie",
        title: movie.title ?? "Untitled",
        poster_path: movie.poster_path ?? null,
        vote_average: Number(movie.vote_average.toFixed(1) || "N/A"),
        release_date: movie.release_date?.slice(0, 4) ?? "N/A",
        genre_ids: movie.genre_ids ?? [],
      }));
    };

    const fetchTVs: () => Promise<TvShow[]> = async () => {
      const { results } = await $fetch<{ results: TvShow[] }>(
        "https://api.themoviedb.org/3/trending/tv/day?language=en-US",
        { headers: fetchHeaders }
      );
      return results.map((tv) => ({
        id: tv.id,
        media_type: "tv",
        name: tv.name ?? "Untitled",
        vote_average: Number(tv.vote_average.toFixed(1) || "N/A"),
        poster_path: tv.poster_path ?? null,
        first_air_date: tv.first_air_date?.slice(0, 4) ?? "N/A",
        genre_ids: tv.genre_ids ?? [],
      }));
    };

    let selectedForHero: HotMedia[] = [];

    if (mediaType === "movie") {
      const movies = await fetchMovies();
      selectedForHero = movies.slice(0, NUMBER_OF_SELECTED_MOVIES);
    } else if (mediaType === "tv") {
      const tvs = await fetchTVs();
      selectedForHero = tvs.slice(0, NUMBER_OF_SELECTED_TVS);
    } else {
      const [movies, tvs] = await Promise.all([fetchMovies(), fetchTVs()]);
      const selectedMovies = movies.slice(0, NUMBER_OF_SELECTED_MOVIES);
      const selectedTVs = tvs.slice(0, NUMBER_OF_SELECTED_TVS);
      selectedForHero = [...selectedMovies, ...selectedTVs];
    }

    return selectedForHero;
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.message || "Internal Server Error",
    });
  }
});
