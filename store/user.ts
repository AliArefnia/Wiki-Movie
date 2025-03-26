import type { userData } from "~/types/types";
import { defineStore } from "pinia";

export const useUserData = defineStore("userData", {
  state: () => ({
    // user: null as null | userData,
    user: null as userData | null,
    error: "",
  }),

  getters: {
    isLoggedIn: (state) => !!state.user?.id,
    userEmail: (state) => state.user?.email,
  },

  actions: {
    setUserData(userData: userData) {
      console.log(userData);
      this.user = userData;
    },

    async toggleMovieWishList({ movieId }: { movieId: number }) {
      if (!this.user) return;
      let alreadyIsInList;
      const originalList = [...this.user.wishList];

      if (this.user?.wishList.includes(movieId)) {
        this.user.wishList = this.user.wishList.filter((id) => id !== movieId);
        alreadyIsInList = true;
      } else {
        this.user?.wishList.push(movieId);
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

    async fetchUser() {
      console.log("fetchUser");
      const supabase: any = useNuxtApp().$supabase;
      const { data, error } = await supabase.auth.getUser();
      const userWishList: number[] = await this.getUserWishList(data.user.id);
      if (error) {
        this.error = error.message;
      } else {
        this.user = {
          id: data.user.id,
          email: data.user.email as string,
          wishList: userWishList || [],
        };
        console.log("user and wishList is here");
      }
    },

    async getUserWishList(userId: number) {
      try {
        const supabase: any = useNuxtApp().$supabase;

        const { data, error } = await supabase
          .from("users")
          .select("wish_list")
          .eq("id", userId)
          .single();

        console.log(data);

        if (error) {
          throw error;
        }

        console.log("User:", data);
        return data.wish_list;
      } catch (error: any) {
        console.error("Error fetching user wishList:", error.message);
        return null;
      }
    },

    logOut() {
});
