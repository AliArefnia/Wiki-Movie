import { defineStore } from "pinia";
import type { Genre } from "~/types/types";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movieGenres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 35, name: "Comedy" },
      { id: 27, name: "Horror" },
      { id: 10749, name: "Romance" },
      // { id: 18, name: "Drama" },
      // { id: 16, name: "Animation" },
      // { id: 53, name: "Thriller" },

      // { id: 80, name: "Crime" },
      // { id: 99, name: "Documentary" },
      // { id: 12, name: "Adventure" },
      // { id: 10751, name: "Family" },
      // { id: 14, name: "Fantasy" },
      // { id: 36, name: "History" },
      // { id: 10402, name: "Music" },
      // { id: 9648, name: "Mystery" },
      // { id: 10770, name: "TV Movie" },
      // { id: 10752, name: "War" },
      // { id: 37, name: "Western" },
    ] as Genre[],
    tvGenres: [
      { id: 10759, name: "Action & Adventure" },
      { id: 80, name: "Crime" },
      { id: 18, name: "Drama" },
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 16, name: "Animation" },
      // { id: 35, name: "Comedy" },
      // { id: 99, name: "Documentary" },
      // { id: 10751, name: "Family" },
      // { id: 10762, name: "Kids" },
      // { id: 9648, name: "Mystery" },
      // { id: 10763, name: "News" },
      // { id: 10764, name: "Reality" },
      // { id: 10766, name: "Soap" },
      // { id: 10767, name: "Talk" },
      // { id: 10768, name: "War & Politics" },
      // { id: 37, name: "Western" },
    ] as Genre[],
  }),

  getters: {
    getMovieGenres: (state) => state.movieGenres,
    getTvGenres: (state) => state.tvGenres,
  },
});
