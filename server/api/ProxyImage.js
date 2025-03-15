export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const path = query.path;
  console.log("proxy image get called");

  if (!path) {
    throw createError({ statusCode: 400, message: "Missing image path" });
  }

  const imageUrl = `https://image.tmdb.org/t/p/w154${path}`;

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) throw new Error("Failed to fetch image");

    // Set correct headers for images
    setResponseHeader(event, "Content-Type", "image/jpeg");

    return send(event, await response.arrayBuffer());
  } catch (error) {
    console.error("Error fetching image:", error);
    return { error: "Failed to fetch image" };
  }
});
