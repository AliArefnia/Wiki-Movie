<template>
  <div>
    <h3 class="font-display mt-12 mx-2 sm:mx-4 text-2xl">
      {{ props.mediaType === "tv" ? "Watch TV Show" : "Watch Movie" }}
    </h3>
    <div class="text-white flex flex-col items-center">
      <div v-if="props.mediaType === 'tv'" class="w-full">
        <div
          class="bg-surface-card rounded-2xl p-6 max-w-xl min-w-[185px] sm:min-w-md mx-auto"
        >
          <div class="space-y-6">
            <div>
              <label
                for="season-select"
                class="block mb-3 text-sm font-semibold text-gray-300 tracking-wide"
                >Select Season</label
              >
              <select
                id="season-select"
                v-model="selectedSeason"
                class="w-full bg-surface-dark text-white text-sm sm:text-base rounded-full px-6 py-3 border border-transparent shadow-sm hover:shadow-lg cursor-pointer transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-btn-primary focus:ring-offset-2 focus:ring-offset-surface-card"
              >
                <option
                  v-for="season in mediaSeasons"
                  :key="season.season_number"
                  :value="season.season_number"
                >
                  {{ season.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="episode-select"
                class="block mb-3 text-sm font-semibold text-gray-300 tracking-wide"
                >Select Episode</label
              >
              <select
                id="episode-select"
                v-model="selectedEpisode"
                :disabled="episodes.length === 0"
                class="w-full bg-surface-dark text-white text-sm sm:text-base rounded-full px-6 py-3 border border-transparent shadow-sm hover:shadow-lg cursor-pointer transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-btn-primary focus:ring-offset-2 focus:ring-offset-surface-card disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option
                  v-for="ep in episodes"
                  :key="ep.episode_number"
                  :value="ep.episode_number"
                >
                  {{ ep.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="mt-10 rounded-xl overflow-hidden shadow-lg max-w-2xl mx-auto"
        >
          <StreamingPlayer
            :mediaType="props.mediaType"
            :mediaId="props.mediaId"
            :season="selectedSeason ?? undefined"
            :episode="selectedEpisode ?? undefined"
          />
        </div>
      </div>
      <div
        v-else
        class="w-full max-w-xl mt-4 rounded-xl overflow-hidden shadow-lg"
      >
        <StreamingPlayer
          :mediaType="props.mediaType"
          :mediaId="props.mediaId"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import StreamingPlayer from "~/components/MediaPage/StreamingPlayer.vue";
import type { Season } from "~/types/types";

const props = defineProps<{
  mediaId: number;
  mediaType: "movie" | "tv";
  mediaSeasons?: Season[];
}>();

const selectedSeason = ref<number | null>(
  props.mediaSeasons?.[0]?.season_number ?? null
);
const selectedEpisode = ref<number | null>(1);
const episodes = ref<{ episode_number: number; name: string }[]>([]);

watch(
  selectedSeason,
  (newSeason) => {
    if (!newSeason || props.mediaType !== "tv" || !props.mediaSeasons) {
      episodes.value = [];
      selectedEpisode.value = null;
      return;
    }

    const season = props.mediaSeasons.find(
      (s) => s.season_number === newSeason
    );

    if (!season) {
      episodes.value = [];
      selectedEpisode.value = null;
      return;
    }

    const count = season.episode_count || 0;
    episodes.value = Array.from({ length: count }, (_, i) => ({
      episode_number: i + 1,
      name: `Episode ${i + 1}`,
    }));

    selectedEpisode.value = episodes.value.length ? 1 : null;
  },
  { immediate: true }
);
</script>
