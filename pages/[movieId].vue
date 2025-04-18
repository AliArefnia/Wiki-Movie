<template>
  <div v-if="mediaDetail" class="relative min-h-screen text-white">
    <!-- Backdrop Image -->
    <div
      class="absolute inset-0 bg-cover bg-center opacity-30"
      :style="{ backgroundImage: `url(${backdropUrl})` }"
    ></div>

    <!-- Content Container -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-10">
      <!-- Movie Header -->
      <div
        class="flex flex-col md:flex-row items-center md:items-start md:space-x-6"
      >
        <!-- Movie Poster -->
        <img
          :src="posterUrl"
          :alt="displayTitle"
          class="w-72 rounded-lg shadow-lg"
        />

        <!-- Movie Details -->
        <div class="flex-1 space-y-5 mt-6 text-center md:text-left">
          <!-- Title & Tagline -->
          <div class="md:relative">
            <h1 class="text-4xl leading-tight font-display">
              {{ displayTitle }}
            </h1>
            <p v-if="displayTagline" class="text-lg text-gray-300 italic">
              "{{ displayTagline }}"
            </p>

            <BaseHeartButton
              v-if="mediaType !== 'person'"
              class="md:absolute md:right-0 md:top-5"
              :isInWishList="isInWishList"
              @toggleMovieWishList="toggleMovieWishList()"
            ></BaseHeartButton>
          </div>

          <!-- Genre Badges -->
          <div v-if="mediaGenres" class="flex flex-wrap gap-2 w-fit">
            <span
              v-for="genre in mediaGenres"
              :key="genre.id"
              class="bg-primary text-sm px-3 py-1 rounded-full font-medium"
            >
              {{ genre.name }}
            </span>
          </div>

          <!-- Overview -->
          <div class="bg-surface-card/50 p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-light mb-2 text-primary">
              {{ mediaType === "person" ? "Biography" : "Overview" }}
            </h2>
            <p class="text-gray-200 leading-relaxed font-display">
              {{ displayOverview }}
            </p>
          </div>

          <!-- Movie Info -->
          <div
            class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-surface-dark/50 p-4 rounded-lg shadow-md"
          >
            <!-- Movie or TV -->
            <template v-if="mediaType !== 'person'">
              <div>
                <p class="text-gray-400 text-sm">
                  {{
                    mediaType === "movie" ? "Release Date" : "First Air Date"
                  }}
                </p>
                <p class="font-light font-display">
                  {{ movieDetail?.release_date || tvDetail?.first_air_date }}
                </p>
              </div>
              <div v-if="mediaType === 'movie'">
                <p class="text-gray-400 text-sm">Runtime</p>
                <p class="font-light font-display">
                  {{ movieDetail?.runtime }} min
                </p>
              </div>
              <div v-if="mediaType === 'tv'">
                <p class="text-gray-400 text-sm">Seasons</p>
                <p class="font-light font-display">
                  {{ tvDetail?.number_of_seasons }}
                </p>
              </div>
              <div>
                <p class="text-gray-400 text-sm">Rating</p>
                <p class="font-light font-display">
                  {{ displayVoteAverage }}/10 ⭐
                </p>
              </div>
            </template>
            <!-- Person Info -->
            <template v-else>
              <div>
                <p class="text-gray-400 text-sm">Known For</p>
                <p class="font-light font-display">
                  {{ personDetail?.known_for_department }}
                </p>
              </div>
              <div>
                <p class="text-gray-400 text-sm">Birthday</p>
                <p class="font-light font-display">
                  {{ personDetail?.birthday || "N/A" }}
                </p>
              </div>
              <div>
                <p class="text-gray-400 text-sm">Place of Birth</p>
                <p class="font-light font-display">
                  {{ personDetail?.place_of_birth || "N/A" }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Trailer -->
      <div v-if="mediaType === 'movie' || mediaType === 'tv'">
        <h3 class="font-display mt-8 mx-4 text-2xl">Official Trailer</h3>
        <BaseTrailerCard
          v-if="officialTrailerKey"
          class="shrink-0 mx-2"
          :soloMovie="true"
          :trailerUrl="`${movieTrailerUrl}${officialTrailerKey.value}/videos`"
          :fallBackThumbnail="backdropUrl"
          :trailerName="officialTrailerName"
        />
        <p v-else class="text-gray-400 text-center font-display mt-6">
          {{ officialTrailerName }}
        </p>
      </div>

      <BaseSimilarMoviesSection
        v-if="mediaType === 'movie'"
        :movieId="Number(route.params.movieId)"
      ></BaseSimilarMoviesSection>
      <BaseCastCrewSection
        v-if="mediaType === 'movie'"
        :movieId="Number(route.params.movieId)"
      ></BaseCastCrewSection>
    </div>

    <!-- Loading State -->
  </div>
  <div v-else class="flex items-center justify-center min-h-screen text-white">
    <p>Loading media details...</p>
  </div>
</template>

<script setup lang="ts">
import { useUserData } from "~/store/user";
import { useRoute } from "vue-router";
import BaseCastCrewSection from "~/components/base/BaseCastCrewSection.vue";
import BaseHeartButton from "~/components/base/BaseHeartButton.vue";
import BaseSimilarMoviesSection from "~/components/base/BaseSimilarMoviesSection.vue";
import BaseTrailerCard from "~/components/base/BaseTrailerCard.vue";
import type {
  MovieDetail,
  TvDetail,
  PersonDetail,
  trailer,
  MediaDetailUnion,
} from "~/types/types";

const route = useRoute();
const userData = useUserData();
const mediaType = route.params.mediaType as "movie" | "tv" | "person";
const mediaDetail = ref<MovieDetail | TvDetail | PersonDetail | null>(null);

const isLoadingWishList = ref(false);
const isInWishList = ref(false);
const officialTrailerKey = ref();
const officialTrailerName = ref("");
const movieTrailerUrl = "https://www.youtube.com/embed/";

// const movieDetail = ref<MovieDetail | null>(null);

const movieDetail = computed(() =>
  mediaType.value === "movie" ? (mediaDetail.value as MovieDetail) : null
);

const tvDetail = computed(() =>
  mediaType.value === "tv" ? (mediaDetail.value as TvDetail) : null
);

const personDetail = computed(() =>
  mediaType.value === "person" ? (mediaDetail.value as PersonDetail) : null
);

const displayTitle = computed(() => {
  return (
    (mediaDetail.value as MovieDetail)?.title ||
    (mediaDetail.value as TvDetail)?.name ||
    (mediaDetail.value as PersonDetail)?.name ||
    "Unknown Title"
  );
});

const displayOverview = computed(() => {
  return mediaType.value === "person"
    ? (mediaDetail.value as PersonDetail)?.biography
    : (mediaDetail.value as MovieDetail | TvDetail)?.overview;
});
const displayVoteAverage = computed(() => {
  return mediaType.value !== "person"
    ? (mediaDetail.value as MovieDetail | TvDetail)?.vote_average
    : null;
});
const mediaGenres = computed(() => {
  return mediaType.value !== "person"
    ? (mediaDetail.value as MovieDetail | TvDetail)?.genres
    : null;
});

const displayTagline = computed(() => {
  return (mediaDetail.value as MovieDetail | TvDetail)?.tagline;
});

async function fetchMediaDetail() {
  try {
    const id = route.params.movieId;
    console.log(id);
    const rawData = await $fetch<MediaDetailUnion>(`/api/MediaDetail?id=${id}`);
    console.log(rawData);
    mediaType.value = rawData.media_type;
    mediaDetail.value = parseMediaDetail(rawData);
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  } finally {
  }
}

async function toggleMovieWishList() {
  try {
    const id = Number(route.params.id);
    isLoadingWishList.value = true;
    await userData.toggleMovieWishList({ movieId: id });
    isLoadingWishList.value = false;
    isInWishList.value = !isInWishList.value;
  } catch (error) {
    console.error("Failed to toggle movie wish list:", error);
  }
}

onMounted(async () => {
  await fetchMediaDetail();

  if (mediaType !== "person") {
    if (userData.userWishList?.includes(Number(route.params.id))) {
      isInWishList.value = true;
    }

    const data = await $fetch<trailer>(
      `/api/MovieTrailer?movieId=${Number(route.params.id)}`
    );

    if (!data) {
      officialTrailerKey.value = null;
      officialTrailerName.value = "No trailer available";
    } else {
      officialTrailerKey.value = data.key;
      officialTrailerName.value = data.name;
    }
  }
});

const posterUrl = computed(() => {
  if (!mediaDetail.value) return "/placeholder.jpg";

  if ("poster_path" in mediaDetail.value) {
    return mediaDetail.value.poster_path
      ? `https://image.tmdb.org/t/p/w500${mediaDetail.value.poster_path}`
      : "/placeholder.jpg";
  }

  if ("profile_path" in mediaDetail.value) {
    return mediaDetail.value.profile_path
      ? `https://image.tmdb.org/t/p/w500${mediaDetail.value.profile_path}`
      : "/placeholder.jpg";
  }

  return "/placeholder.jpg";
});

const backdropUrl = computed(() => {
  if (
    mediaDetail.value &&
    "backdrop_path" in mediaDetail.value &&
    mediaDetail.value.backdrop_path
  ) {
    return `https://image.tmdb.org/t/p/w1280${mediaDetail.value.backdrop_path}`;
  }
  return "/placeholder.jpg";
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
