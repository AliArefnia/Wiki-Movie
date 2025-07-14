import type { MovieGet, SearchResult } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const { width, searchTerm, page } = getQuery(event);

    const IMAGE_URL = `https://image.tmdb.org/t/p/w${width}`;

    const response = await $fetch<{ results: SearchResult[] }>(
      `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=false&language=en-US&page=${page}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    return response.results
      .map((item: any): SearchResult | null => {
        if (item.media_type === "movie") {
          return {
            id: item.id,
            media_type: "movie",
            title: item.title || "Untitled",
            vote_average: Number((item.vote_average ?? 0).toFixed(1)),
            poster_path: item.poster_path
              ? `${IMAGE_URL}${item.poster_path}`
              : null,
            release_date: (item.release_date || "N/A").slice(0, 4),
            genre_ids: item.genre_ids || [],
          };
        } else if (item.media_type === "tv") {
          return {
            id: item.id,
            media_type: "tv",
            name: item.name || "Untitled",
            vote_average: Number((item.vote_average ?? 0).toFixed(1)),
            poster_path: item.poster_path
              ? `${IMAGE_URL}${item.poster_path}`
              : null,
            first_air_date: (item.first_air_date || "N/A").slice(0, 4),
            genre_ids: item.genre_ids || [],
          };
        } else if (item.media_type === "person") {
          return {
            id: item.id,
            media_type: "person",
            name: item.name,
            profile_path: item.profile_path
              ? `${IMAGE_URL}${item.profile_path}`
              : null,
            known_for: item.known_for.map((kf: any) => ({
              id: kf.id,
              title: kf.title,
              name: kf.name,
              media_type: kf.media_type,
              poster_path: kf.poster_path
                ? `${IMAGE_URL}${kf.poster_path}`
                : null,
            })),
            known_for_department: item.known_for_department,
          };
        }

        return null;
      })
      .filter((item): item is SearchResult => item !== null);
  } catch (error) {
    console.error("Error fetching movies by search:", error);
    return { error: "Failed to fetch movies by search" };
  }
});
