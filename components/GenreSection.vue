<template>
  <div class="flex overflow-auto py-4 mt-2">
    <NuxtLink
      v-for="genre in movieGenres"
      :key="genre.id"
      :to="`/genre/${genre.name}`"
    >
      <BaseGenreCard class="shrink-0 mx-2" :genreName="genre.name" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { useMovieStore } from "~/store/store";

const movieStore = useMovieStore();
const movieGenres = computed(() => movieStore.getMovieGenres);
</script>
