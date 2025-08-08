import { defineStore } from "pinia";
import type { Genre } from "~/types/types";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movieGenres: [] as Genre[],
    tvGenres: [] as Genre[],
    genresLoaded: false,
  }),

  getters: {
    getMovieGenres: (state) => state.movieGenres,
    getTvGenres: (state) => state.tvGenres,
  },
  actions: {
    setMovieGenres(genres: Genre[]) {
      this.movieGenres = genres;
    },
    setTvGenres(genres: Genre[]) {
      this.tvGenres = genres;
    },
    async fetchGenresOnce() {
      if (this.genresLoaded) return;

      try {
        const [movieGenres, tvGenres] = await Promise.all([
          $fetch<Genre[]>("/api/GetGenres?type=movie"),
          $fetch<Genre[]>("/api/GetGenres?type=tv"),
        ]);
        this.setMovieGenres(movieGenres);
        this.setTvGenres(tvGenres);
        this.genresLoaded = true;
      } catch (err) {
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to fetch genres",
          cause: err,
        });
      }
    },
  },
});
