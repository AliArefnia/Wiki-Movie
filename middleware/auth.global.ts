import { useUserData } from "~/store/user";

export default defineNuxtRouteMiddleware(async () => {
  // skip middleware on server
  if (process.server) return;

  const userStore = useUserData();

  if (!userStore.isLoggedIn && !userStore.isUserLoaded) {
    try {
      await userStore.fetchUser();
    } catch (err) {}
  }
});
