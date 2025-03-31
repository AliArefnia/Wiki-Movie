<template>
  <div class="bg-surface-dark pt-2">
    <div v-if="isInitialLoadDone">
      <div
        v-if="
          wishListMovies?.length === 0 && !isLoading && !error && isUserLoggedIn
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
    <div v-if="isLoading" class="text-gray-400 text-center font-display mt-6">
      Loading...
    </div>
    <div
      v-else
      class="grid grid-cols-3 gap-2 justify-items-center pt-2"
      :class="{ 'fade-in': !isLoading }"
    >
      <NuxtLink
        v-for="movie in wishListMovies"
        :key="movie.id"
        :to="`/${movie.id}?from=wishList`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="movie.title"
          :rating="movie.vote_average"
          :releaseDate="movie.release_date"
          :posterUrl="movie.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useInfiniteScroll, useDebounceFn } from "@vueuse/core";
import type { Movie } from "~/types/types";
import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";
const router = useRouter();
const userData = useUserData();
// const page = ref(1);
const isLoading = ref(false);
const wishListMovies = ref<Movie[] | null>([]);
const error = ref<string | null>("");
const isUserLoggedIn = computed(() => userData.isLoggedIn);
const isInitialLoadDone = ref(false);
const wishList = ref();

async function getWishListMovies(movieId: Number) {
  try {
    const data = await $fetch<Movie>(`/api/MovieById?movieId=${movieId}`);
    wishListMovies.value?.push(data);
  } catch (err) {
    error.value = "Couldn't fetch wish list movies";
    console.log("error fetching searched movie");
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

// async function getWishListMovies() {
//   let data = await $fetch("/api/user/getUserWishList");
// }

// useInfiniteScroll(
//   document,
//   () => {
//     if (!isLoading.value) {
//       getWishListMovies();
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

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!isUserLoggedIn.value)
      throw new Error("Please log in to view your wish list.");

    wishList.value = userData.userWishList;

    wishList.value?.map((movieId: number) => {
      getWishListMovies(movieId);
    });
  } catch (err) {
    error.value = (err as Error).message || "Unknown error occurred";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped></style>
