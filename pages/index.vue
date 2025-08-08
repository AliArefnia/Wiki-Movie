<template>
  <div id="mainPage">
    <Hero />

    <div v-if="loading" class="flex justify-center items-center">
      <BaseLoader message="Fetching Genres..." />
    </div>

    <div v-else-if="error" class="flex justify-center items-center">
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>

    <div v-else-if="movieGenres.length !== 0 && tvGenres.length !== 0">
      <GenreSection />
      <keep-alive>
        <SectionLazy v-for="genre in movieGenres" :key="'movie-' + genre.id">
          <BaseMovieSection
            :genreId="genre.id"
            :genreName="genre.name"
            mediaType="movie"
          />
        </SectionLazy>
      </keep-alive>

      <keep-alive>
        <SectionLazy v-for="genre in tvGenres" :key="'tv-' + genre.id">
          <BaseMovieSection
            :genreId="genre.id"
            :genreName="genre.name"
            mediaType="tv"
          />
        </SectionLazy>
      </keep-alive>
    </div>

    <p v-else class="font-display mx-auto text-gray-400">No Genres Found</p>
  </div>
</template>

<script setup lang="ts">
import { useMovieStore } from "~/store/store";
import GenreSection from "~/components/Genres/GenreList.vue";
import BaseMovieSection from "~/components/Genres/GenreMovies.vue";
import SectionLazy from "~/components/base/SectionLazy.vue";

const movieStore = useMovieStore();

const error = ref<Error | null>(null);
const loading = ref(true);

try {
  await movieStore.fetchGenresOnce();
} catch (err) {
  error.value = err as Error;
} finally {
  loading.value = false;
}

const movieGenres = computed(() => movieStore.getMovieGenres);
const tvGenres = computed(() => movieStore.getTvGenres);

function refresh() {
  movieStore.genresLoaded = false;
  loading.value = true;
  movieStore
    .fetchGenresOnce()
    .catch((err) => (error.value = err))
    .finally(() => (loading.value = false));
}

definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});

useHead({
  title: "Home",
  meta: [
    {
      name: "description",
      content:
        "Watch details, trailers, and cast for Movie Title on Wiki Movie.",
    },
    {
      name: "keywords",
      content: "movies, trailers, actors, Movies",
    },
  ],
});
</script>
