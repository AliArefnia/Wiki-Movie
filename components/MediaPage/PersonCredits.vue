<template>
  <div class="mt-10">
    <h3 class="font-display mx-4 text-2xl">Person Credits</h3>
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
    <div v-else-if="credits?.length">
      <div class="flex py-4 w-full justify-around flex-wrap">
        <NuxtLink
          v-for="media in visibleMedia"
          :key="media.id"
          :to="`/${media.id}?mediaType=${media.media_type}`"
        >
          <BaseMovieCardSmall
            class="shrink-0 mx-2 my-2"
            :movieTitle="getTitle(media)"
            :releaseDate="getReleaseDate(media)"
            :rating="media.vote_average"
            :posterUrl="media.poster_path"
          />
        </NuxtLink>
      </div>
      <div
        v-if="visibleCount < sortedMedia.length"
        class="flex justify-center mt-6"
      >
        <BaseButton
          variant="accent"
          class="transition duration-300 shadow-md hover:cursor-pointer animate-pulse"
          @click="loadMore"
        >
          <svg
            class="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
          Show More
        </BaseButton>
      </div>
    </div>
    <!-- Empty -->
    <p v-else class="text-gray-400 text-center font-display mt-6">
      No Credits found!
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Movie, TvShow } from "@/types/types";

const props = defineProps<{
  personId: number;
}>();

const {
  data: credits,
  status,
  error,
  refresh,
} = useAsyncData<(Movie | TvShow)[]>(
  `Person-${props.personId}-credits`,
  () => $fetch(`/api/PersonCredits?id=${props.personId}`),
  { default: () => [] }
);

// Sort by date
const sortedMedia = computed(() => {
  return [...credits.value].sort((a, b) => {
    const dateA = new Date(getReleaseDate(a)).getTime() || 0;
    const dateB = new Date(getReleaseDate(b)).getTime() || 0;
    return dateB - dateA; // latest first
  });
});

// Pagination logic
const visibleCount = ref(10);
const visibleMedia = computed(() =>
  sortedMedia.value.slice(0, visibleCount.value)
);

const getTitle = (item: Movie | TvShow) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: Movie | TvShow) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

const loadMore = () => {
  visibleCount.value += 10;
};
</script>
