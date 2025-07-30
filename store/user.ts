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
    user_role: "",
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
    GetUserRole: (state) => state.user?.user_role,
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

    async fetchUser(user?: userData) {
      if (this.user) return;
      this.isUserLoaded = false;

      const supabase: any = useNuxtApp().$supabase;

      const authUser = user ?? (await supabase.auth.getUser()).data?.user;

      if (!authUser) {
        this.user = null;
        this.isUserLoaded = true;
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("name, user_role")
        .eq("id", authUser.id)
        .single();

      if (profileError) {
        this.error = profileError.message;
        this.isUserLoaded = true;
        return;
      }

      this.user = {
        id: authUser.id,
        email: authUser.email as string,
        name: profileData.name || null,
        created_at: authUser.created_at,
        wishList: [],
        watchList: [],
        favouritePersonList: [],
        user_role: profileData.user_role,
      };

      await this.getUserWishList(authUser.id);
      await this.getUserWatchList(authUser.id);
      await this.getUserFavouritePersonList(authUser.id);
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
        this.user?.favouritePersonList.push(
          ...(data.favourite_person_list ?? [])
        );
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
