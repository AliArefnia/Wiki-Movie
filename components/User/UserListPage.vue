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
        <div>
          <BaseButton
            variant="accent"
            @click="
              () => router.push(`/login?from=${router.currentRoute.value.path}`)
            "
            class="mx-2"
          >
            Log In
          </BaseButton>
          <BaseButton
            variant="accent"
            @click="
              () =>
                router.push(`/signup?from=${router.currentRoute.value.path}`)
            "
          >
            Sign up
          </BaseButton>
        </div>
      </div>
    </ClientOnly>

    <div v-if="loading" class="text-gray-400 text-center font-display mt-6">
      <BaseLoader />
    </div>
    <Transition name="fade-slide" mode="out-in">
      <template v-if="mediaItems.length">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-2"
          :class="{ 'fade-in': !loading }"
        >
          <NuxtLink
            v-for="media in mediaItems"
            :key="media.id"
            :to="`/${media.id}?mediaType=${media.media_type}&from=${from}`"
          >
            <BaseMovieCardSmall
              class="shrink-0 mx-2"
              :movieTitle="
                media.media_type === 'movie' ? media.title : media.name
              "
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
      </template>

      <template v-else-if="personItems.length">
        <div
          class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center pt-2"
          :class="{ 'fade-in': !loading }"
        >
          <NuxtLink
            v-for="media in personItems"
            :key="media.id"
            :to="`/${media.id}?mediaType=${media.media_type}&from=${from}`"
          >
            <BasePersonCard
              class="shrink-0 mx-2"
              :personName="media.name"
              :profileUrl="media.profile_path"
            />
          </NuxtLink>
        </div>
      </template>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseMovieCardSmall from "~/components/MovieSections/BaseMovieCardSmall.vue";
import BasePersonCard from "../base/BasePersonCard.vue";
import BaseLoader from "~/components/base/BaseLoader.vue";
import BaseButton from "~/components/base/BaseButton.vue";

import type { MediaItem, Person } from "~/types/types";

const props = defineProps<{
  mediaList: MediaItem[] | Person[] | null;
  type: "movie" | "person";
  loading: boolean;
  error: string | null;
  isUserLoggedIn: boolean;
  isInitialLoadDone: boolean;
  from: string;
  emptyText: string;
}>();

const mediaItems = computed(() =>
  props.type === "movie" && props.mediaList
    ? (props.mediaList as MediaItem[])
    : []
);

const personItems = computed(() =>
  props.type === "person" && props.mediaList
    ? (props.mediaList as Person[])
    : []
);
const router = useRouter();
</script>
