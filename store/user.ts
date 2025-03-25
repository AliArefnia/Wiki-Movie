import type { userData } from "~/types/types";
import { defineStore } from "pinia";

export const useUserData = defineStore("userData", {
  state: () => ({
    user: null as null | userData,
    // user: {

  getters: {
    isLoggedIn: (state) => !!state.user?.id,
    userEmail: (state) => state.user?.email,
  },

  actions: {
    setUserData(userData: userData) {
      this.user = userData;
    },

});
