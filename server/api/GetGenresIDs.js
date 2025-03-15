export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await $fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
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
