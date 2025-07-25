import type { Movie, TvShow, MediaItem } from "@/types/types";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const genreId = query.genreId;
    const mediaType = query.mediaType || "all";
    const page = query.page || 1;
    const imageQuality = query.width || 154;

    const IMAGE_URL = `https://image.tmdb.org/t/p/w${imageQuality}`;

    if (!genreId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Genre ID is required",
      });
    }

    const config = useRuntimeConfig();

    const headers = {
      Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
      accept: "application/json",
    };

    const fetchMovie = async () =>
      $fetch<{ results: Movie[] }>(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${genreId}&page=${page}`,
        { headers }
      );

    const fetchTv = async () =>
      $fetch<{ results: TvShow[] }>(
        `https://api.themoviedb.org/3/discover/tv?language=en-US&with_genres=${genreId}&page=${page}`,
        { headers }
      );

    const formatMovie = (movie: Movie): Movie => ({
      ...movie,
      media_type: "movie",
      title: movie.title ?? "Untitled",
      vote_average: Number(movie.vote_average.toFixed(1) || "N/A"),
      poster_path: movie.poster_path
        ? `${IMAGE_URL}${movie.poster_path}`
        : null,
      release_date: movie.release_date?.slice(0, 4) || "N/A",
      genre_ids: movie.genre_ids || [],
    });

    const formatTv = (tv: TvShow): TvShow => ({
      ...tv,
      media_type: "tv",
      name: tv.name ?? "Untitled",
      vote_average: Number(tv.vote_average.toFixed(1) || "N/A"),
      poster_path: tv.poster_path ? `${IMAGE_URL}${tv.poster_path}` : null,
      first_air_date: tv.first_air_date?.slice(0, 4) || "N/A",
      genre_ids: tv.genre_ids || [],
    });

    let combined: MediaItem[] = [];

    if (mediaType === "movie") {
      const movieData = await fetchMovie();
      combined = movieData.results.map(formatMovie);
    } else if (mediaType === "tv") {
      const tvData = await fetchTv();
      combined = tvData.results.map(formatTv);
    } else {
      const [movieData, tvData] = await Promise.all([fetchMovie(), fetchTv()]);
      combined = [
        ...movieData.results.map(formatMovie),
        ...tvData.results.map(formatTv),
      ];
    }

    return combined satisfies MediaItem[];
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return { error: "Failed to fetch movies by genre" };
  }
});
