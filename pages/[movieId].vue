<script setup lang="ts">
import type { MovieDetail } from "~/types/types";
import { useRoute } from "vue-router";

const route = useRoute();
const movieDetail = ref<MovieDetail | null>(null);

async function fetchMovieDetail() {
  try {
    const data = await $fetch<MovieDetail>(
      `/api/MovieDetail?movieId=${route.params.movieId}`
    );
    console.log(data);
    movieDetail.value = data;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  } finally {
  }
}

onMounted(async () => {
  await fetchMovieDetail();
});
definePageMeta({
  layout: "genre-pages",
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
