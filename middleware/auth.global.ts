import { useUserData } from "~/store/user";

export default defineNuxtRouteMiddleware(async () => {
  // skip middleware on server
  if (process.server) return;

  const userStore = useUserData();

  if (!userStore.isLoggedIn && !userStore.getIsUserLoaded) {
    try {
      await userStore.fetchUser();
    } catch (err) {
      console.warn("User not authenticated.");
    }
  }
});
