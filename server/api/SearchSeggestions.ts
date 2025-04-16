// server/api/MovieBySearch.ts
import type { Movie, Person, MultiSearchResult } from "~/types/types";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const query = getQuery(event);
    const searchTerm = String(query.searchTerm || "").trim();
    const page = Number(query.page || 1);
    const encodedTerm = encodeURIComponent(searchTerm);

    const response = await $fetch<{ results: MultiSearchResult[] }>(
      `https://api.themoviedb.org/3/search/multi?query=${encodedTerm}&include_adult=true&language=en-US&page=${page}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${config.public.TMDB_API_KEY}`,
        },
      }
    );

    const movies: Movie[] = [];
    const people: Person[] = [];

    response.results.forEach((item) => {
      if (item.media_type === "movie") {
        movies.push({
          id: item.id,
          title: item.title ?? "Untitled",
          vote_average: Number(item.vote_average?.toFixed(1) || 0),
          poster_path: item.poster_path || "",
          release_date: item.release_date?.slice(0, 4) || "N/A",
          genre_ids: item.genre_ids || [],
        });
      }

      if (item.media_type === "person") {
        people.push({
          id: item.id,
          name: item.name ?? "Unknown",
          profile_path: item.profile_path || "",
          known_for: item.known_for || [],
          media_type: "person",
        });
      }
    });

    return { movies, people };
  } catch (error) {
    console.error("Error fetching movies/people by search:", error);
    return { error: "Failed to fetch search results" };
  }
});
