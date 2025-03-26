import type { userData } from "~/types/types";
import { defineStore } from "pinia";

export const useUserData = defineStore("userData", {
  state: () => ({
    user: null as null | userData,
    // user: {
    user: {
      id: "e7f775e1-a517-4f3a-bd9d-336680ed68f7",
      email: "kirkiri@gmail.com",
      wishList: [1, 2],
    },
  }),

  getters: {
    isLoggedIn: (state) => !!state.user?.id,
    userEmail: (state) => state.user?.email,
  },

  actions: {
    setUserData(userData: userData) {
      this.user = userData;
    },

    async toggleMovieWishList({ movieId }: { movieId: number }) {
      console.log(movieId);
      console.log(this.user);
      if (!this.user) return;

      let alreadyIsInList;
      const originalList = [...this.user.wishList];

      if (this.user?.wishList.includes(movieId)) {
        this.user.wishList = this.user.wishList.filter((id) => id !== movieId);
        alreadyIsInList = true;
        console.log(this.user.wishList);
      } else {
        this.user?.wishList.push(movieId);
        console.log(this.user.wishList);
      }

      try {
        await fetch("/api/user/userWishList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.user.id,
            movieId,
            action: alreadyIsInList ? "remove" : "add",
          }),
        });
      } catch (error) {
        console.error(error);
        this.user.wishList = originalList;
      }
    },


});
