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
      <div v-if="!isUserLoggedIn" class="flex justify-center">
        <button
          @click="
            () => router.push(`/login?from=${router.currentRoute.value.path}`)
          "
          class="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Log In
        </button>
      </div>
    </ClientOnly>
    <div v-if="isLoading" class="text-gray-400 text-center font-display mt-6">
      Loading...
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
});
// import { useInfiniteScroll, useDebounceFn } from "@vueuse/core";
import type { MediaItem, WishListItem } from "~/types/types";
import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
const router = useRouter();
const userData = useUserData();
// const page = ref(1);
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

// const debouncedSearch = useDebounceFn(async () => {
//   if (searchQuery.value.length > 2) {
//     page.value = 1;
//     searchMovie.value = [];
//     await getMovieBySearch();
//   } else {
//     return;
//   }
// }, 400);

// watch(searchQuery, debouncedSearch);

// async function getMovieBySearch() {
//   if (page.value > 10 || searchQuery.value === "") return;
//   try {
//     isLoading.value = true;
//     let data = await $fetch<Movie[]>(
//       `/api/MovieBySearch?searchTerm=${searchQuery.value}&page=${page.value}`
//     );
//     console.log(data);
//     searchMovie.value.push(...data);

//     page.value++;
//   } catch (error) {
//     console.log("error fetching searched movie");
//   } finally {
//     isLoading.value = false;
//   }
// }

// async function getWishListMedia() {
//   let data = await $fetch("/api/user/getUserWishList");
// }

// useInfiniteScroll(
//   document,
//   () => {
//     if (!isLoading.value) {
//       getWishListMedia();
//     }
//   },
//   { distance: 100 }
// );

// watch(
//   () => userData.isUserLoaded,
//   (loaded) => {
//     if (loaded) {
//       console.log(userData.userWishList);
//     }
//   }
// );

const getTitle = (item: MediaItem) =>
  item.media_type === "movie" ? item.title : item.name;

const getReleaseDate = (item: MediaItem) =>
  item.media_type === "movie" ? item.release_date : item.first_air_date;

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!isUserLoggedIn.value)
      throw new Error("Please log in to view your wish list.");
    wishList.value = userData.userWishList;
    wishList.value?.map((media: WishListItem) => {
      getWishListMedia(media.id, media.mediaType);
    });
  } catch (err) {
    error.value = (err as Error).message || "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
