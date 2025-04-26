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

      <BaseMediaDetail
        :media-detail="mediaDetail"
        :media-type="mediaType"
        :id="mediaDetail.id"
      ></BaseMediaDetail>
      <!-- Trailer -->
      <div v-if="mediaType === 'movie' || mediaType === 'tv'">
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
  <div v-else class="flex items-center justify-center min-h-screen text-white">
    <p>Loading media details...</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import BaseCastCrewSection from "~/components/base/BaseCastCrewSection.vue";

import BaseSimilarMoviesSection from "~/components/base/BaseSimilarMoviesSection.vue";
import BaseTrailerCard from "~/components/base/BaseTrailerCard.vue";
import BaseMediaDetail from "~/components/base/BaseMediaDetail.vue";
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
const movieTrailerUrl = "https://www.youtube.com/embed/";

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
