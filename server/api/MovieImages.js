export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const API_URL =
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
  const API_KEY = config.TMDB_API_KEY;

  if (!API_KEY) {
    throw createError({ statusCode: 500, message: "API Key is missing!" });
  }

  const cacheTime = 3600; // 1 hour cache
  setResponseHeader(
    event,
    "Cache-Control",
    `s-maxage=${cacheTime}, stale-while-revalidate`
  );

  try {
    const response = await fetch(API_URL, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch TMDB data");

    const data = await response.json();

    // Modify poster URLs to use your Nuxt API instead
    data.results = data.results.map((movie) => ({
      ...movie,
      poster_path: `/api/ProxyImage?path=${movie.poster_path}`, // Proxy image URL
    }));

    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { error: "Failed to fetch movies" };
  }
});
