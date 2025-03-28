<template>
  <div class="bg-surface-dark pt-2">
    <div
      v-if="wishListMovies?.length === 0 && !isLoading"
      class="text-gray-400 text-center font-display mt-6"
    >
      You can add movies to your wishlist by clicking the heart icon on the
      movie card.
    </div>
    <div v-if="error" class="text-gray-400 text-center font-display mt-6">
      {{ error }}
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
        :to="`/${movie.id}?from=wishlist`"
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
import type { Movie } from "~/types/types";
import { useUserData } from "~/store/user";

const userData = useUserData();
const isLoading = ref(false);
const wishListMovies = ref<Movie[] | null>([]);
const error = ref<string | null>(null);

async function getWishListMovies(movieId: Number) {
  try {
    isLoading.value = true;
    const data = await $fetch<Movie>(`/api/MovieById?movieId=${movieId}`);
    wishListMovies.value?.push(data);
  } catch (err) {
    error.value = "Couldn't fetch wish list movies";
    console.log("error fetching searched movie");
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  const wishList = userData.userWishList;

  wishList?.map((movieId) => {
    getWishListMovies(movieId);
  });
});
</script>

<style scoped></style>
