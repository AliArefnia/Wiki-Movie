<template>
  <div>
    <!-- Loading -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center min-h-[260px]"
    >
      <BaseLoader message="Fetching Media Detail..." />
    </div>
    <!-- Error -->
    <div
      v-else-if="error"
      class="flex justify-center items-center min-h-[260px]"
    >
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>
    <!-- Success -->
    <div v-if="mediaDetail" class="relative min-h-screen text-white">
      <!-- Backdrop -->
      <Backdrop
        v-if="(mediaType === 'movie' || mediaType === 'tv') && backdropPath"
        :backdrop-path="backdropPath"
        :media-name="displayTitle"
      ></Backdrop>

      <!-- Content Container -->
      <div
        :class="[
          'relative z-10 max-w-6xl mx-auto px-2 sm:px-6',
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
        <div v-if="mediaType === 'person'" id="personCredits">
          <SectionLazy height="100">
            <PersonCredits :person-id="mediaDetail.id"></PersonCredits>
          </SectionLazy>
        </div>

        <!-- Trailer -->
        <div v-if="mediaType === 'movie' || mediaType === 'tv'" id="trailer">
          <SectionLazy height="100">
            <Trailer
              :mediaId="mediaDetail.id"
              :media-type="mediaType"
              :fall-back-thumbnail="backdropPath"
            ></Trailer>
          </SectionLazy>
        </div>

        <!-- SimilarMovies -->
        <div
          v-if="mediaType === 'movie' || mediaType === 'tv'"
          id="SimilarMovies"
        >
          <SectionLazy height="100">
            <SimilarMovies
              :movieId="Number(route.params.movieId)"
              :mediaType="mediaType"
            ></SimilarMovies>
          </SectionLazy>
        </div>
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

      <!-- Comments -->
      <div id="comments">
        <SectionLazy>
          <Comments :media-id="mediaDetail.id"></Comments>
        </SectionLazy>
      </div>
    </div>
    <!-- Empty -->
    <p v-else class="text-gray-400 text-center font-display mt-6">
      No Details found!
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import PersonCredits from "~/components/MediaPage/PersonCredits.vue";
import CastsAndCrews from "~/components/MediaPage/CastsAndCrews.vue";
import SimilarMovies from "~/components/MediaPage/SimilarMovies.vue";
import Trailer from "~/components/MediaPage/Trailer.vue";
import MediaDetail from "~/components/MediaPage/MediaDetail.vue";
import Comments from "~/components/MediaPage/Comments.vue";
import SectionLazy from "~/components/base/SectionLazy.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import Backdrop from "~/components/MediaPage/Backdrop.vue";

import type { MediaDetailUnion, MovieDetail, TvDetail } from "~/types/types";

const route = useRoute();
const id = computed(() => route.params.movieId);

const mediaType = (route.query.mediaType || null) as
  | "movie"
  | "tv"
  | "person"
  | null;

const {
  data: mediaDetail,
  status,
  error,
  refresh,
} = useAsyncData(`MediaDetail-${route.params.movieId}`, () =>
  $fetch<MediaDetailUnion>(
    `/api/MediaDetail?id=${id.value}&media_type=${mediaType}`
  )
);

const backdropPath = computed(() => {
  if (
    mediaDetail.value &&
    "backdrop_path" in mediaDetail.value &&
    mediaDetail.value.backdrop_path
  )
    return mediaDetail.value.backdrop_path;
});

const displayTitle = computed(() => {
  return (
    (mediaDetail.value as MovieDetail)?.title ||
    (mediaDetail.value as TvDetail)?.name
  );
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
    description = val.name + "Watch movies, casts, and more.";
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
