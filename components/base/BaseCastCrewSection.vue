<!-- /components/sections/CastCrewSection.vue -->
<template>
  <div class="mt-10 text-white">
    <h3 class="font-display mx-4 text-2xl">Top Cast</h3>
    <div class="flex overflow-auto py-4">
      <NuxtLink
        v-if="cast.length"
        v-for="person in cast"
        :key="person.id"
        :to="`/${person.id}?mediaType=${'person'}`"
        class="shrink-0 mx-2"
      >
        <BasePersonCard
          :personName="person.name"
          :role="person.character"
          :profileUrl="person.profile_path"
        />
      </NuxtLink>
      <p v-else class="font-display mx-auto">No Cast Found</p>
    </div>

    <h3 class="font-display mx-4 text-2xl mt-6">Crew</h3>
    <div class="flex overflow-auto py-4">
      <NuxtLink
        v-if="crew.length"
        v-for="person in crew"
        :key="person.id"
        :to="`/${person.id}?mediaType=${'person'}`"
        class="shrink-0 mx-2"
      >
        <BasePersonCard
          :personName="person.name"
          :role="person.job"
          :profileUrl="person.profile_path"
        />
      </NuxtLink>
      <p v-else class="font-display mx-auto">No Crew Found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieCastCrew, CastMember, CrewMember } from "~/types/types";
import BasePersonCard from "~/components/base/BasePersonCard.vue";

const props = defineProps<{
  mediaId: number;
  mediaType: "movie" | "tv";
}>();

const cast = ref<CastMember[]>([]);
const crew = ref<CrewMember[]>([]);

onMounted(async () => {
  try {
    const data = await $fetch<MovieCastCrew>(
      `/api/MediaCastCrewById?mediaId=${props.mediaId}&mediaType=${props.mediaType}`
    );
    cast.value = data.cast;
    crew.value = data.crew;
  } catch (error) {
    console.error("Failed to fetch cast/crew:", error);
  }
});
</script>
