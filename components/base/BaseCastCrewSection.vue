<!-- /components/sections/CastCrewSection.vue -->
<template>
  <div class="bg-surface-dark mt-10 text-white">
    <h3 class="font-display mx-4 text-2xl">Top Cast</h3>
    <div class="flex overflow-auto py-4">
      <div v-for="person in cast" :key="person.id" class="shrink-0 mx-2">
        <BasePersonCard
          :personName="person.name"
          :role="person.character"
          :profileUrl="`https://image.tmdb.org/t/p/w185${person.profile_path}`"
        />
      </div>
    </div>

    <h3 class="font-display mx-4 text-2xl mt-6">Crew</h3>
    <div class="flex overflow-auto py-4">
      <div v-for="person in crew" :key="person.id" class="shrink-0 mx-2">
        <BasePersonCard
          :personName="person.name"
          :role="person.job"
          :profileUrl="`https://image.tmdb.org/t/p/w185${person.profile_path}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieCastCrew, CastMember, CrewMember } from "~/types/types";
import BasePersonCard from "~/components/base/BasePersonCard.vue";

const props = defineProps<{
  movieId: number;
}>();

const cast = ref<CastMember[]>([]);
const crew = ref<CrewMember[]>([]);

onMounted(async () => {
  try {
    const data = await $fetch<MovieCastCrew>(
      `/api/MovieCastCrewById?movieId=${props.movieId}`
    );
    cast.value = data.cast;
    crew.value = data.crew;
  } catch (error) {
    console.error("Failed to fetch cast/crew:", error);
  }
});
</script>
