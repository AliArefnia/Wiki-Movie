<template>
  <div
    class="flex flex-col md:flex-row items-center md:items-start md:space-x-6"
  >
    <!-- Movie Poster -->

    <div class="relative aspect-[2/3] rounded-lg bg-gray-800">
      <!-- Actual Image -->
      <NuxtImg
        v-if="posterUrl"
        class="w-72 rounded-lg shadow-lg transition-opacity duration-300"
        :src="posterUrl"
        :alt="displayTitle"
        @load="loaded = true"
        format="webp"
        :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
        decoding="async"
        fetchpriority="high"
      />

      <!-- Placeholder Image (fallback) -->
      <NuxtImg
        v-else
        src="/images/moviePlaceholder.png"
        alt="No Poster"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Skeleton while loading -->
      <div
        v-if="!loaded"
        class="absolute inset-0 animate-pulse bg-gray-700"
      ></div>
    </div>

    <!-- Movie Details -->
    <div class="flex-1 space-y-5 mt-6 text-center md:text-left">
      <!-- Title & Tagline & controls -->
      <div class="md:relative flex flex-col md:flex-row justify-between">
        <div class="mb-3 md:m-0">
          <h1 class="text-4xl leading-tight font-display">
            {{ displayTitle }}
          </h1>
          <p v-if="displayTagline" class="text-lg text-gray-300 italic">
            "{{ displayTagline }}"
          </p>
        </div>
        <section
          id="watchControls"
          class="flex flex-col justify-center items-center"
        >
          <BaseHeartButton
            v-if="mediaType !== 'person' && userData.user"
            class=""
            :isInWishList="isInWishList"
            @toggleMovieWishList="toggleMovieWishList()"
          ></BaseHeartButton>
          <BaseEyeButton
            v-if="mediaType !== 'person' && userData.user"
            :isWatched="isInWatchList"
            @toggleMovieWatched="toggleMovieWatched()"
          >
          </BaseEyeButton>
          <BasePersonButton
            v-if="mediaType === 'person' && userData.user"
            :isFavouritePerson="isInFavouritePersonList"
            @toggleFavouritePerson="toggleFavouritePerson()"
          >
          </BasePersonButton>
        </section>
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
        <p class="text-gray-200 leading-relaxed font-display lg:text-lg">
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
              {{ mediaType === "movie" ? "Release Date" : "First Air Date" }}
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
</template>
<script setup lang="ts">
import type { MovieDetail, TvDetail, PersonDetail } from "~/types/types";
import { useUserData } from "~/store/user";
import BaseHeartButton from "./BaseHeartButton.vue";
import BaseEyeButton from "./BaseEyeButton.vue";
import BasePersonButton from "./BasePersonButton.vue";

const props = defineProps<{
  mediaType: "movie" | "tv" | "person" | null;
  mediaDetail: MovieDetail | TvDetail | PersonDetail;
  id: number;
}>();

const userData = useUserData();
const isLoadingWishList = ref(false);
const isLoadingWatchList = ref(false);
const isLoadingFavouritePersonList = ref(false);
const isInWishList = ref(false);
const isInFavouritePersonList = ref(false);
const loaded = ref(false);
const isInWatchList = ref(false);

const movieDetail = computed(() =>
  props.mediaType === "movie" ? (props.mediaDetail as MovieDetail) : null
);

const tvDetail = computed(() =>
  props.mediaType === "tv" ? (props.mediaDetail as TvDetail) : null
);

const personDetail = computed(() =>
  props.mediaType === "person" ? (props.mediaDetail as PersonDetail) : null
);

const displayTitle = computed(() => {
  return (
    (props.mediaDetail as MovieDetail)?.title ||
    (props.mediaDetail as TvDetail)?.name ||
    (props.mediaDetail as PersonDetail)?.name ||
    "Unknown Title"
  );
});

const displayOverview = computed(() => {
  return props.mediaType === "person"
    ? (props.mediaDetail as PersonDetail)?.biography
    : (props.mediaDetail as MovieDetail | TvDetail)?.overview;
});
const displayVoteAverage = computed(() => {
  return props.mediaType !== "person"
    ? (props.mediaDetail as MovieDetail | TvDetail)?.vote_average
    : null;
});
const mediaGenres = computed(() => {
  return props.mediaType !== "person"
    ? (props.mediaDetail as MovieDetail | TvDetail)?.genres
    : null;
});
const displayTagline = computed(() => {
  return (props.mediaDetail as MovieDetail | TvDetail)?.tagline;
});

const posterUrl = computed(() => {
  if ("poster_path" in props.mediaDetail) {
    return props.mediaDetail.poster_path
      ? `https://image.tmdb.org/t/p/w500${props.mediaDetail.poster_path}`
      : props.mediaDetail.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${props.mediaDetail.backdrop_path}`
      : "images/moviePlaceholder.png";
  }

  if ("profile_path" in props.mediaDetail) {
    return props.mediaDetail.profile_path
      ? `https://image.tmdb.org/t/p/w185${props.mediaDetail.profile_path}`
      : "images/personPlaceholder.png";
  }

  // return "/images/moviePlaceholder.png";
});

async function toggleMovieWishList() {
  try {
    const id = Number(props.id);
    isLoadingWishList.value = true;
    await userData.toggleMovieWishList({
      movieId: id,
      mediaType: props.mediaType as "tv" | "movie",
    });
    isLoadingWishList.value = false;
    isInWishList.value = !isInWishList.value;
  } catch (error) {
    console.error("Failed to toggle movie wish list:", error);
  }
}
async function toggleMovieWatched() {
  try {
    const id = Number(props.id);
    isLoadingWatchList.value = true;
    await userData.toggleMovieWatchList({
      movieId: id,
      mediaType: props.mediaType as "tv" | "movie",
    });
    isLoadingWatchList.value = false;
    isInWatchList.value = !isInWatchList.value;
  } catch (error) {
    console.error("Failed to toggle movie Watch list:", error);
  }
}
async function toggleFavouritePerson() {
  try {
    const id = Number(props.id);
    isLoadingFavouritePersonList.value = true;
    await userData.toggleFavouritePerson({
      personId: id,
      mediaType: props.mediaType as "person",
    });
    isLoadingFavouritePersonList.value = false;
    isInFavouritePersonList.value = !isInFavouritePersonList.value;
  } catch (error) {
    console.error("Failed to toggle favourite person list:", error);
  }
}

onMounted(() => {
  if (props.mediaType !== "person") {
    isInWishList.value =
      userData.GetUserWishList?.some((media) => media.id === props.id) ?? false;
    isInWatchList.value =
      userData.GetUserWatchList?.some((media) => media.id === props.id) ??
      false;
  }
  if (props.mediaType === "person") {
    isInFavouritePersonList.value =
      userData.GetUserFavouritePersonList?.some(
        (person) => person.id === props.id
      ) ?? false;
  }
});
</script>
