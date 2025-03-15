export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const genreId = query.genreId;

  if (!genreId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Genre ID is required",
    });
  }

  const config = useRuntimeConfig();
  const response = await $fetch(
    `https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=${genreId}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${config.TMDB_API_KEY}`,
      },
    }
  );

  return response;
});
