import type {
  userData,
  WishListItem,
  WatchListItem,
  FavouriePersonteItem,
} from "~/types/types";
import { defineStore } from "pinia";

export const useUserData = defineStore("userData", {
  state: () => ({
    // user: null as null | userData,
    user: null as userData | null,
    error: "",
    isUserLoaded: false,
    userWishList: [] as WishListItem[],
    userWatchList: [] as WatchListItem[],
    userFavouritePersonList: [] as FavouriePersonteItem[],
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
    GetUserWishList: (state) => state.user?.wishList,
    GetUserWatchList: (state) => state.user?.watchList,
    GetUserFavouritePersonList: (state) => state.user?.favouritePersonList,
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

    async toggleMovieWatchList({
      movieId,
      mediaType,
    }: {
      movieId: number;
      mediaType: "tv" | "movie";
    }) {
      if (!this.user) return;
      let watchedMedia = { id: movieId, mediaType: mediaType };
      const originalList = [...this.user.watchList];

      const alreadyIsInList = this.user?.watchList.some(
        (media) => media.id === movieId
      );

      if (alreadyIsInList) {
        this.user.watchList = this.user.watchList.filter(
          (media) => media.id !== movieId
        );
      } else {
        this.user?.watchList.push(watchedMedia);
      }

      try {
        await fetch("/api/user/userWatchList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.user.id,
            watchedMedia,
            action: alreadyIsInList ? "remove" : "add",
          }),
        });
      } catch (error) {
        console.error(error);
        this.user.watchList = originalList;
      }
    },

    async toggleFavouritePerson({
      personId,
      mediaType,
    }: {
      personId: number;
      mediaType: "person";
    }) {
      if (!this.user) return;
      let favouritePerson = { id: personId, mediaType: mediaType };
      const originalList = [...this.user.favouritePersonList];

      const alreadyIsInList = this.user?.favouritePersonList.some(
        (person) => person.id === personId
      );

      if (alreadyIsInList) {
        this.user.favouritePersonList = this.user.favouritePersonList.filter(
          (person) => person.id !== personId
        );
      } else {
        this.user?.favouritePersonList.push(favouritePerson);
      }

      try {
        await fetch("/api/user/userFavouritePersonList", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: this.user.id,
            favouritePerson,
            action: alreadyIsInList ? "remove" : "add",
          }),
        });
      } catch (error) {
        console.error(error);
        this.user.favouritePersonList = originalList;
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
          watchList: [],
          favouritePersonList: [],
        };
      }
      await this.getUserWishList(data.user.id);
      await this.getUserWatchList(data.user.id);
      await this.getUserFavouritePersonList(data.user.id);
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
    async getUserWatchList(userId: number) {
      if (!userId) return null;
      try {
        const supabase: any = useNuxtApp().$supabase;
        const { data, error } = await supabase
          .from("users")
          .select("watch_list")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }
        this.user?.watchList.push(...(data.watch_list ?? []));
      } catch (error: any) {
        console.error("Error fetching user watchList:", error.message);
        return null;
      }
    },
    async getUserFavouritePersonList(userId: number) {
      if (!userId) return null;
      try {
        const supabase: any = useNuxtApp().$supabase;
        const { data, error } = await supabase
          .from("users")
          .select("favourite_person_list")
          .eq("id", userId)
          .single();

        if (error) {
          throw error;
        }
        console.log(data);
        this.user?.favouritePersonList.push(
          ...(data.favourite_person_list ?? [])
        );
        console.log(this.user?.favouritePersonList);
      } catch (error: any) {
        console.error(
          "Error fetching user Favourite Person List:",
          error.message
        );
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
