<template>
  <div>
    <div
      v-if="
        isInitialLoadDone &&
        mediaList?.length === 0 &&
        !loading &&
        !error &&
        isUserLoggedIn
      "
      class="text-gray-400 text-center font-display mt-6"
    >
      {{ emptyText }}
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
        <p class="text-lg font-semibold">Log in to view your list</p>
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

    <div v-if="loading" class="text-gray-400 text-center font-display mt-6">
      <BaseLoader />
    </div>

    <div
      v-else
      class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-2"
      :class="{ 'fade-in': !loading }"
    >
      <NuxtLink
        v-for="media in mediaList"
        :key="media.id"
        :to="`/${media.id}?mediaType=${media.media_type}&from=${from}`"
      >
        <BaseMovieCardSmall
          class="shrink-0 mx-2"
          :movieTitle="media.media_type === 'movie' ? media.title : media.name"
          :rating="media.vote_average"
          :releaseDate="
            media.media_type === 'movie'
              ? media.release_date
              : media.first_air_date
          "
          :posterUrl="media.poster_path"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import BaseButton from "~/components/base/BaseButton.vue";

import type { MediaItem } from "~/types/types";

const props = defineProps<{
  mediaList: MediaItem[] | null;
  loading: boolean;
  error: string | null;
  isUserLoggedIn: boolean;
  isInitialLoadDone: boolean;
  from: string;
  emptyText: string;
}>();

const router = useRouter();
</script>
