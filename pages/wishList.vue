<template>
  <div class="bg-surface-dark pt-2">
    <div v-if="isInitialLoadDone">
      <div
        v-if="
          wishListMedia?.length === 0 && !isLoading && !error && isUserLoggedIn
        "
        class="text-gray-400 text-center font-display mt-6"
      >
        You can add movies to your wishlist by clicking the heart icon on the
        movie card.
      </div>
    </div>
    <div v-if="error" class="text-gray-400 text-center font-display mt-6">
      {{ error }}
    </div>
    <ClientOnly>
      <div
        v-if="!isUserLoggedIn"
        class="flex flex-col items-center justify-center gap-4 mt-10 text-center text-gray-300"
      >
        <NuxtImg
          src="/images/loginIllustration.svg"
          alt="Please log in"
          class="w-40 h-40 opacity-80"
        />
        <p class="text-lg font-semibold">Log in to view your wishlist</p>
        <BaseButton
          @click="
            () => router.push(`/login?from=${router.currentRoute.value.path}`)
          "
          class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          Log In
        </BaseButton>
      </div>
    </ClientOnly>
    <div v-if="isLoading" class="text-gray-400 text-center font-display mt-6">
      <BaseLoader></BaseLoader>
    </div>
    <div
      v-else
      class="grid grid-cols-3 gap-2 justify-items-center pt-2"
      :class="{ 'fade-in': !isLoading }"
    >
      <NuxtLink
        v-for="media in wishListMedia"
        :key="media.id"
        :to="`/${media.id}?mediaType=${media.media_type}&from=wishList`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="getTitle(media)"
          :rating="media.vote_average"
          :releaseDate="getReleaseDate(media)"
          :posterUrl="media.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Wish List",
});

import type { MediaItem, WishListItem } from "~/types/types";

import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";

import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import BaseButton from "~/components/base/BaseButton.vue";

const router = useRouter();
const userData = useUserData();
const isLoading = ref(false);
const wishListMedia = ref<MediaItem[] | null>([]);
const error = ref<string | null>("");
const isUserLoggedIn = computed(() => userData.isLoggedIn);
const isInitialLoadDone = ref(false);
const wishList = ref();

async function getWishListMedia(mediaId: Number, mediaType: "tv" | "movie") {
  try {
    const data = await $fetch<MediaItem>(
      `/api/MediaById?mediaId=${mediaId}&mediaType=${mediaType}`
    );
    wishListMedia.value?.push(data);
  } catch (err) {
    error.value = "Couldn't fetch wish list movies";
  } finally {
    isInitialLoadDone.value = true;
  }
}

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!isUserLoggedIn.value)
      throw new Error("You need to be signed in to see your saved movies.");
    wishList.value = userData.userWishList;
    await Promise.all(
      wishList.value?.map((media: WishListItem) =>
        getWishListMedia(media.id, media.mediaType)
      )
    );
  } catch (err) {
    error.value = (err as Error).message || "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
