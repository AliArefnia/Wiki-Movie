import { defineStore } from "pinia";
import type { Genre } from "~/types/types";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movieGenres: [] as Genre[],
    tvGenres: [] as Genre[],
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
  },
});
