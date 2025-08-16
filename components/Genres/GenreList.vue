<template>
  <div>
    <div class="flex justify-center gap-4 mt-4">
      <button
        class="px-4 py-2 rounded-full text-white font-semibold hover:cursor-pointer hover:scale-105 transition-transform"
        :class="{
          'bg-primary': active === 'movie',
          'bg-gray-700': active !== 'movie',
        }"
        @click="active = 'movie'"
      >
        Movie Genres
      </button>
      <button
        class="px-4 py-2 rounded-full text-white font-semibold hover:cursor-pointer hover:scale-105 transition-transform"
        :class="{
          'bg-primary': active === 'tv',
          'bg-gray-700': active !== 'tv',
        }"
        @click="active = 'tv'"
      >
        TV Genres
      </button>
    </div>

    <Transition name="fade" mode="out-in">
      <div :key="active" class="flex overflow-auto py-4 mt-4 px-4">
        <NuxtLink
          v-for="genre in activeGenres"
          :key="genre.id"
          :to="`/genre/${genre.name}?mediaType=${active}`"
        >
          <BaseGenreCard
            class="shrink-0 mx-2 hover:bg-primary"
            :genreName="genre.name"
          />
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMovieStore } from "~/store/store";
import BaseGenreCard from "./BaseGenreCard.vue";

const active = ref<"movie" | "tv">("movie");
const store = useMovieStore();

const movieGenres = computed(() => store.getMovieGenres);
const tvGenres = computed(() => store.getTvGenres);

const activeGenres = computed(() =>
  active.value === "movie" ? movieGenres.value : tvGenres.value
);
</script>
