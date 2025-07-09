import type { userData } from "~/types/types";
import { defineStore } from "pinia";

export const useUserData = defineStore("userData", {
  state: () => ({
    // user: null as null | userData,
    user: null as userData | null,
    error: "",
    isUserLoaded: false,
  }),

  getters: {
    userInfo: (state) => {
      return {
        id: state.user?.id,
        email: state.user?.email,
      };
    },
    isLoggedIn: (state) => !!state.user?.id,
    getIsUserLoaded: (state) => !!state.isUserLoaded,
    userEmail: (state) => state.user?.email,
    userJoinDate: (state) => state.user?.created_at,
    userName: (state) => state.user?.name,
    userWishList: (state) => state.user?.wishList,
  },

  actions: {
    setUserData(userData: userData) {
      this.user = userData;
    },

    async toggleMovieWishList({
      movieId,
      mediaType,
    }: {
      movieId: number;
      mediaType: "tv" | "movie";
    }) {
      if (!this.user) return;
      let wishedMedia = { id: movieId, mediaType: mediaType };
      const originalList = [...this.user.wishList];

      const alreadyIsInList = this.user?.wishList.some(
        (media) => media.id === movieId
      );

      if (alreadyIsInList) {
        this.user.wishList = this.user.wishList.filter(
          (media) => media.id !== movieId
        );
      } else {
        this.user?.wishList.push(wishedMedia);
      }

      try {
        await fetch("/api/user/userWishList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.user.id,
            wishedMedia,
            action: alreadyIsInList ? "remove" : "add",
          }),
        });
      } catch (error) {
        console.error(error);
        this.user.wishList = originalList;
      }
    },

    async fetchUser() {
      if (this.isUserLoaded) return;
      this.isUserLoaded = false;
      const supabase: any = useNuxtApp().$supabase;
      const { data, error } = await supabase.auth.getUser();
      if (!data.user) {
        console.warn("No user is currently logged in");
        this.user = null;
        this.isUserLoaded = true;
        return;
      }
      if (error) {
        this.error = error.message;
      } else {
        this.user = {
          id: data.user.id,
          email: data.user.email as string,
          name: data.user.name,
          wishList: [],
          created_at: data.user.created_at,
        };
      }
      await this.getUserWishList(data.user.id);
      this.isUserLoaded = true;
    },

    async getUserWishList(userId: number) {
      if (!userId) return null;
      try {
        const supabase: any = useNuxtApp().$supabase;
        const { data, error } = await supabase
          .from("users")
          .select("wish_list")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }
        this.user?.wishList.push(...(data.wish_list ?? []));
      } catch (error: any) {
        console.error("Error fetching user wishList:", error.message);
        return null;
      }
    },

    async logOut() {
      const supabase: any = useNuxtApp().$supabase;
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});
