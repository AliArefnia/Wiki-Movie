<template>
  <div>
    <div v-if="mediaDetail" class="relative min-h-screen text-white">
      <!-- Backdrop -->
      <Backdrop
        v-if="(mediaType === 'movie' || mediaType === 'tv') && backdropPath"
        :backdrop-path="backdropPath"
      ></Backdrop>

      <!-- Content Container -->
      <div
        :class="[
          'relative z-10 max-w-6xl mx-auto px-6 pb-10',
          mediaType === 'movie' || mediaType === 'tv'
            ? 'pt-40 sm:pt-20'
            : 'pt-10',
        ]"
      >
        <!-- Movie Header -->
        <div id="mediaDetail">
          <MediaDetail
            :media-detail="mediaDetail"
            :media-type="mediaType"
            :id="mediaDetail.id"
          ></MediaDetail>
        </div>

        <!-- Person Credits -->

        <div v-if="mediaType === 'person'">
          <SectionLazy>
            <BasePersonCredits :media="personCredits"></BasePersonCredits>
          </SectionLazy>
        </div>

        <!-- Trailer -->
        <div v-if="mediaType === 'movie' || mediaType === 'tv'">
          <h3 class="font-display mt-8 mx-4 text-2xl">Official Trailer</h3>
          <div v-if="officialTrailerKey">
            <SectionLazy>
              <BaseTrailerCard
                class="shrink-0 mx-2"
                :soloMovie="true"
                :officialTrailerKey="officialTrailerKey"
                :fallBackThumbnail="backdropUrl"
                :trailerName="officialTrailerName"
              />
            </SectionLazy>
          </div>
          <p v-else class="text-gray-400 text-center font-display mt-6">
            {{ officialTrailerName }}
          </p>
        </div>

        <SectionLazy
          v-if="mediaType === 'movie' || mediaType === 'tv'"
          height="100"
        >
          <BaseSimilarMoviesSection
            :movieId="Number(route.params.movieId)"
            :mediaType="mediaType"
          ></BaseSimilarMoviesSection>
        </SectionLazy>
        <!-- CastsAndCrews -->
        <div
          v-if="mediaType === 'movie' || mediaType === 'tv'"
          id="CastsAndCrews"
        >
          <SectionLazy height="100">
            <CastsAndCrews
              :mediaId="Number(route.params.movieId)"
              :mediaType="mediaType"
            ></CastsAndCrews>
          </SectionLazy>
        </div>
      </div>

        </SectionLazy>
      </div>

      <SectionLazy>
        <CommentSection :media-id="mediaDetail.id"></CommentSection>
      </SectionLazy>
    </div>
    <!-- Loading State -->
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center text-white"
    >
      <!-- loader -->
      <BaseLoader message="Loading Media Details!"></BaseLoader>
    </div>
    <p v-else class="text-gray-400 text-center font-display mt-6">
      No Details found!
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import BaseSimilarMoviesSection from "~/components/base/BaseSimilarMoviesSection.vue";
import BaseTrailerCard from "~/components/base/BaseTrailerCard.vue";
import PersonCredits from "~/components/MediaPage/PersonCredits.vue";
import CastsAndCrews from "~/components/MediaPage/CastsAndCrews.vue";
import MediaDetail from "~/components/MediaPage/MediaDetail.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import CommentSection from "~/components/MovieSections/CommentSection.vue";
import SectionLazy from "~/components/SectionLazy.vue";
import Backdrop from "~/components/MediaPage/Backdrop.vue";

import type {
  MovieDetail,
  TvDetail,
  PersonDetail,
  trailer,
  MediaDetailUnion,
  TvShow,
  Movie,
} from "~/types/types";

const route = useRoute();
const mediaType = ref<"movie" | "tv" | "person" | null>(null);
const mediaDetail = ref<MovieDetail | TvDetail | PersonDetail | null>(null);
const personCredits = ref<(Movie | TvShow)[]>([]);

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

onMounted(async () => {

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

const backdropPath = computed(() => {
  if (
    mediaDetail.value &&
    "backdrop_path" in mediaDetail.value &&
    mediaDetail.value.backdrop_path
  )
    return mediaDetail.value.backdrop_path;
});

definePageMeta({
  layout: "default",
  middleware: ["validate-media"],
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});

// Update page title
watch(mediaDetail, (val) => {
  if (!val) return;

  const titleChunk = "title" in val ? val.title : val.name;
  let description;
  if ("overview" in val) {
    description =
      val.overview?.slice(0, 150) || "Watch trailers, cast, and more.";
  } else {
    description = val.name + "Watch trailers, cast, and more.";
  }

  const imagePath = computed(() => {
    if ("poster_path" in val) {
      return val.poster_path
        ? `https://image.tmdb.org/t/p/w342${val.poster_path}`
        : val.backdrop_path
        ? `https://image.tmdb.org/t/p/w342${val.backdrop_path}`
        : "images/moviePlaceholder.png";
    }

    if ("profile_path" in val) {
      return val.profile_path
        ? `https://image.tmdb.org/t/p/w342${val.profile_path}`
        : "images/personPlaceholder.png";
    }
  });

  useHead({
    title: titleChunk,
    meta: [
      { name: "description", content: description },
      { property: "og:type", content: "video.movie" },
      { property: "og:title", content: titleChunk },
      { property: "og:description", content: description },
      { property: "og:image", content: imagePath },
    ],
  });
});
</script>
