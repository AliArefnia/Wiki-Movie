<!-- /components/sections/CastCrewSection.vue -->
<template>
  <div class="mt-10 text-white">
    <h3 class="font-display mx-4 text-2xl">Top Cast</h3>
    <div class="flex overflow-auto py-4">
      <!-- Loading -->
      <div
        v-if="status === 'pending'"
        class="flex justify-center items-center min-h-[260px]"
      >
        <BaseLoader message="Fetching Person Credits..." />
      </div>
      <!-- Error -->
      <div
        v-else-if="error"
        class="flex justify-center items-center min-h-[260px]"
      >
        <BaseErrorContainer :error="error" :refresh="refresh" />
      </div>
      <!-- Success -->
      <NuxtLink
        v-if="castCrew?.cast.length"
        v-for="person in castCrew?.cast"
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
      <!-- Empty -->
      <p
        v-else-if="castCrew?.cast.length === 0 && !error"
        class="font-display mx-auto text-gray-400"
      >
        No Cast Found
      </p>
      <BaseErrorContainer v-if="error" :error="error" :refresh="refresh">
      </BaseErrorContainer>
    </div>

    <h3 class="font-display mx-4 text-2xl mt-6">Crew</h3>
    <div class="flex overflow-auto py-4">
      <NuxtLink
        v-if="castCrew && status === 'success'"
        v-for="person in castCrew?.crew"
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
      <p
        v-else-if="
          castCrew?.crew.length === 0 && !error && status === 'success'
        "
        class="font-display mx-auto text-gray-400"
      >
        No Crew Found
      </p>
      <BaseErrorContainer v-if="error" :error="error" :refresh="refresh">
      </BaseErrorContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieCastCrew } from "~/types/types";
import BasePersonCard from "~/components/base/BasePersonCard.vue";

const props = defineProps<{
  mediaId: number;
  mediaType: "movie" | "tv";
}>();

const {
  data: castCrew,
  status,
  error,
  refresh,
} = useAsyncData<MovieCastCrew>("movieCastCrew", () =>
  $fetch(
    `/api/MediaCastCrewById?mediaId=${props.mediaId}&mediaType=${props.mediaType}`
  )
);
</script>
