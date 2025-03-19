import { defineStore } from "pinia";
import type { Genre } from "~/types/types";

export const useMovieStore = defineStore("movieStore", {
  state: () => ({
    movieGenres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 18, name: "Drama" },
    ] as Genre[],
  }),
});
