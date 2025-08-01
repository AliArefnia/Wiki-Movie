<template>
  <div>
    <h3 class="font-display mt-8 mx-4 text-2xl">Official Trailer</h3>
    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center mt-6"
    >
      <BaseLoader message="Fetching trailer data..." />
    </div>
    <!-- Error -->
    <div v-else-if="error" class="flex justify-center items-center">
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>

    <!-- Success -->
    <div v-else-if="trailerdata">
      <p
        class="bg-black/50 text-white px-2 mx-4 py-1 rounded text-xs inline-block"
      >
        {{ trailerdata.name }}
      </p>
      <BaseTrailerCard
        :officialTrailerKey="trailerdata.key"
        :soloMovie="true"
        :fallBackThumbnail="fallBackThumbnail"
        :trailerName="trailerdata.name"
      >
      </BaseTrailerCard>
    </div>
    <!-- No Trailer -->
    <div v-else class="font-display mx-auto text-center text-gray-400">
      <p>No trailer available!</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseTrailerCard from "../base/BaseTrailerCard.vue";

import type { trailer } from "@/types/types";

const props = defineProps<{
  mediaId: number;
  mediaType: "movie" | "tv";
  fallBackThumbnail: string | undefined;
}>();

const {
  data: trailerdata,
  error,
  status,
  refresh,
} = useAsyncData(
  `Trailer-${props.mediaId}`,
  () =>
    $fetch<trailer>(
      `/api/MediaTrailer?mediaId=${props.mediaId}&mediaType=${props.mediaType} `
    ),
  {
    default: () => null,
  }
);
</script>
