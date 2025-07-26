export default defineNuxtRouteMiddleware(async (to, from) => {
  // CUSTOM 404 PAGE
  if (!to.matched.length) {
    return navigateTo("/404");
  }
});
