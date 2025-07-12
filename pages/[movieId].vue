<template>
  <div v-if="mediaDetail" class="relative min-h-screen text-white">
    <div
      v-if="mediaType === 'movie' || mediaType === 'tv'"
      class="relative h-[500px] w-full bg-cover bg-center"
      :style="{ backgroundImage: `url(${backdropUrl})` }"
    >
      <div class="absolute inset-0 bg-black opacity-60"></div>
    </div>
    <div
      v-else
      class="relative h-[300px] w-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center"
    ></div>

    <!-- Content Container -->
    <div class="relative z-10 -mt-56 max-w-6xl mx-auto px-6 pb-10">
      <!-- Movie Header -->

      <BaseMediaDetail
        :media-detail="mediaDetail"
        :media-type="mediaType"
        :id="mediaDetail.id"
      ></BaseMediaDetail>
      <!-- Trailer -->
      <div v-if="mediaType === 'movie' || mediaType === 'tv'">
        <h3 class="font-display mt-8 mx-4 text-2xl">Official Trailer</h3>
        <BaseTrailerCard
          v-if="officialTrailerKey"
          class="shrink-0 mx-2"
          :soloMovie="true"
          :officialTrailerKey="officialTrailerKey"
          :fallBackThumbnail="backdropUrl"
          :trailerName="officialTrailerName"
        />
        <p v-else class="text-gray-400 text-center font-display mt-6">
          {{ officialTrailerName }}
        </p>
      </div>

      <BaseSimilarMoviesSection
        v-if="mediaType === 'movie' || mediaType === 'tv'"
        :movieId="Number(route.params.movieId)"
        :mediaType="mediaType"
      ></BaseSimilarMoviesSection>
      <BaseCastCrewSection
        v-if="mediaType === 'movie' || mediaType === 'tv'"
        :mediaId="Number(route.params.movieId)"
        :mediaType="mediaType"
      ></BaseCastCrewSection>
    </div>

    <!-- Loading State -->
  </div>
  <div
    v-else
    class="absolute inset-0 flex items-center justify-center text-white"
  >
    <!-- loader -->
    <BaseLoader message="Loading Media Details!"></BaseLoader>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BaseCastCrewSection from "~/components/base/BaseCastCrewSection.vue";

import BaseSimilarMoviesSection from "~/components/base/BaseSimilarMoviesSection.vue";
import BaseTrailerCard from "~/components/base/BaseTrailerCard.vue";
import BaseMediaDetail from "~/components/base/BaseMediaDetail.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import type {
  MovieDetail,
  TvDetail,
  PersonDetail,
  trailer,
  MediaDetailUnion,
} from "~/types/types";

const route = useRoute();
const mediaType = ref<"movie" | "tv" | "person" | null>(null);
const mediaDetail = ref<MovieDetail | TvDetail | PersonDetail | null>(null);

const officialTrailerKey = ref();
const officialTrailerName = ref("");

function parseMediaDetail(data: any): MovieDetail | TvDetail | PersonDetail {
  const mediaType = data.media_type;
  if (mediaType === "movie") {
    const movie: MovieDetail = {
      id: data.id,
      title: data.title,
      genre_ids: data.genre_ids || [],
      vote_average: data.vote_average,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date,
      popularity: data.popularity,
      runtime: data.runtime,
      overview: data.overview,
      genres: data.genres || [],
      tagline: data.tagline,
    };
    return movie;
  }

  if (mediaType === "tv") {
    const tv: TvDetail = {
      id: data.id,
      name: data.name,
      genre_ids: data.genre_ids || [],
      vote_average: data.vote_average,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      first_air_date: data.first_air_date,
      popularity: data.popularity,
      overview: data.overview,
      number_of_seasons: data.number_of_seasons,
      genres: data.genres || [],
      tagline: data.tagline,
    };
    return tv;
  }

  const person: PersonDetail = {
    id: data.id,
    name: data.name,
    profile_path: data.profile_path,
    biography: data.biography,
    birthday: data.birthday,
    place_of_birth: data.place_of_birth,
    popularity: data.popularity,
    known_for_department: data.known_for_department,
  };
  return person;
}

async function fetchMediaDetail() {
  try {
    const id = route.params.movieId;
    mediaType.value = route.query.mediaType as "movie" | "tv" | "person" | null;

    const rawData = await $fetch<MediaDetailUnion>(
      `/api/MediaDetail?id=${id}&media_type=${mediaType.value}`
    );
    mediaType.value = rawData.media_type;
    mediaDetail.value = parseMediaDetail(rawData);
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  } finally {
  }
}

onMounted(async () => {
  if (!route.query.mediaType || !route.params.movieId) {
    console.error("Missing media type or ID");
    return;
  }
  await fetchMediaDetail();

  if (mediaType.value !== "person") {
    const data = await $fetch<trailer>(
      `/api/MediaTrailer?mediaId=${mediaDetail.value?.id}&mediaType=${mediaType.value} `
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
  layout: "movie-page",
watch(mediaDetail, (val) => {
  if (!val) return;

  const titleChunk = "title" in val ? val.title : val.name;

  useHead({
    title: titleChunk,
  });
});
</script>

<style>
body {
  font-family: "Inter", sans-serif;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out both;
}
</style>
