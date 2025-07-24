export default defineNuxtRouteMiddleware((to) => {
  const id = to.params.movieId;
  const mediaType = to.query.mediaType;

  if (
    !id ||
    !mediaType ||
    !["movie", "tv", "person"].includes(mediaType.toString())
  ) {
    throw createError({
      statusCode: 404,
      statusMessage: "Missing or Invalid Media ID/Type",
    });
  }
});
