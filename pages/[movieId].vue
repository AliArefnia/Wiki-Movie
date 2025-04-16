<template>
  <div v-if="movieDetail" class="relative min-h-screen text-white">
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
          :alt="movieDetail.title"
          class="w-72 rounded-lg shadow-lg"
        />

        <!-- Movie Details -->
        <div class="flex-1 space-y-5 mt-6 text-center md:text-left">
          <!-- Title & Tagline -->
          <div class="md:relative">
            <h1 class="text-4xl leading-tight font-display">
              {{ movieDetail.title }}
            </h1>
            <p v-if="movieDetail.tagline" class="text-lg text-gray-300 italic">
              "{{ movieDetail.tagline }}"
            </p>

            <BaseHeartButton
              class="md:absolute md:right-0 md:top-5"
              :isInWishList="isInWishList"
              @toggleMovieWishList="toggleMovieWishList()"
            ></BaseHeartButton>
          </div>

          <!-- Genre Badges -->
          <div class="flex flex-wrap gap-2 w-fit">
            <span
              v-for="genre in movieDetail.genres"
              :key="genre.id"
              class="bg-primary text-sm px-3 py-1 rounded-full font-medium"
            >
              {{ genre.name }}
            </span>
          </div>

          <!-- <button
              :disabled="loading"
              @click="toggleMovie(movie)"
              class="text-white p-2 rounded-full"
            >
              <Icon
                :name="isInWishList(movie) ? 'heart-filled' : 'heart-outline'"
                class="text-red-500"
              />
            </button> -->

          <!-- Overview -->
          <div class="bg-surface-card/50 p-4 rounded-lg shadow-md">
            <h2 class="text-xl font-light mb-2 text-primary">Overview</h2>
            <p class="text-gray-200 leading-relaxed font-display">
              {{ movieDetail.overview }}
            </p>
          </div>

          <!-- Movie Info -->
          <div
            class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-surface-dark/50 p-4 rounded-lg shadow-md"
          >
            <div>
              <p class="text-gray-400 text-sm">Release Date</p>
              <p class="font-light font-display">
                {{ movieDetail.release_date }}
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Runtime</p>
              <p class="font-light font-display">
                {{ movieDetail.runtime }} min
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Popularity</p>
              <p class="font-light font-display">
                {{ movieDetail.popularity }}
              </p>
            </div>
            <div>
              <p class="text-gray-400 text-sm">Rating</p>
              <p class="font-light font-display">
                {{ movieDetail.vote_average }}/10 ⭐
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
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
        :movieId="Number(route.params.movieId)"
      ></BaseSimilarMoviesSection>
      <BaseCastCrewSection
        :movieId="Number(route.params.movieId)"
      ></BaseCastCrewSection>
    </div>

    <!-- Loading State -->
  </div>
  <div v-else class="flex items-center justify-center min-h-screen text-white">
    <p>Loading movie details...</p>
  </div>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import type { MovieDetail, trailer } from "~/types/types";
import { useUserData } from "~/store/user";
import { useRoute } from "vue-router";
import BaseCastCrewSection from "~/components/base/BaseCastCrewSection.vue";
import BaseHeartButton from "~/components/base/BaseHeartButton.vue";

const userData = useUserData();
const route = useRoute();
const isLoadingWishList = ref(false);
const isInWishList = ref(false);
const officialTrailerKey = ref();
const officialTrailerName = ref("");
const movieTrailerUrl = "https://www.youtube.com/embed/";

const movieDetail = ref<MovieDetail | null>(null);

async function fetchMovieDetail() {
  try {
    const data = await $fetch<MovieDetail>(
      `/api/MovieDetail?movieId=${route.params.movieId}`
    );
    movieDetail.value = data;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  } finally {
  }
}

async function toggleMovieWishList() {
  try {
    const movieId = Number(route.params?.movieId);
    isLoadingWishList.value = true;
    await userData.toggleMovieWishList({ movieId });
    isLoadingWishList.value = false;
    isInWishList.value = !isInWishList.value;
  } catch (error) {
    console.error("Failed to toggle movie wish list:", error);
  }
}

onMounted(async () => {
  await fetchMovieDetail();
  if (userData.userWishList?.includes(Number(route.params?.movieId))) {
    isInWishList.value = true;
  }
  let data = await $fetch<trailer>(
    `/api/MovieTrailer?movieId=${Number(route.params.movieId)}`
  );
  if (!data) {
    officialTrailerKey.value = null;
    officialTrailerName.value = "No trailer available";
    return;
  }
  officialTrailerKey.value = data.key;
  officialTrailerName.value = data.name;
});

const posterUrl = computed(() =>
  movieDetail.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetail.value.poster_path}`
    : "/placeholder.jpg"
);

const backdropUrl = computed(() =>
  movieDetail.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movieDetail.value.backdrop_path}`
    : "/placeholder.jpg"
);

definePageMeta({
  layout: "genre-pages",
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}
</style>
