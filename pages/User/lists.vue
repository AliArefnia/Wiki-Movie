<template>
  <div class="bg-surface-dark pt-2">
    <div class="tabs flex justify-center gap-4 mb-4 text-white">
      <button
        v-if="isUserLoggedIn"
        v-for="tab in tabs"
        :key="tab.key"
        @click="selectTab(tab.key as 'wishlist' | 'watchlist')"
        :class="[
          'px-4 py-2 rounded-full hover:cursor-pointer transition-all duration-300 hover:scale-105',
          activeTab === tab.key ? 'bg-primary' : 'bg-gray-700',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <UserListPage
      :mediaList="
        activeTab === 'wishlist'
          ? wishListMedia
          : activeTab === 'watchlist'
          ? watchListMedia
          : favouritePersonListMedia
      "
      :type="
        activeTab === 'wishlist'
          ? 'movie'
          : activeTab === 'watchlist'
          ? 'movie'
          : 'person'
      "
      :loading="isLoading"
      :error="error"
      :isUserLoggedIn="isUserLoggedIn"
      :isInitialLoadDone="isInitialLoadDone"
      :from="`user/lists?tab=${activeTab}`"
      :emptyText="
        activeTab === 'wishlist'
          ? 'You can add movies to your wishlist by clicking the heart icon in the movie page.'
          : activeTab === 'watchlist'
          ? 'You can add movies to your Watch List by clicking the Eye icon in the movie page.'
          : 'You can add your favorite person to your favourite person List by clicking the person icon in the person page.'
      "
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: false,
  pageTransition: { name: "page", mode: "out-in" },
});
useHead({ title: "My Lists" });

import { useUserData } from "~/store/user";
import { useRouter, useRoute } from "vue-router";
import UserListPage from "~/components/Wishes/UserListPage.vue";
import type {
  MediaItem,
  WishListItem,
  WatchListItem,
  Person,
  FavouriePersonteItem,
} from "~/types/types";

const router = useRouter();
const route = useRoute();
const userData = useUserData();

const tabs = [
  { label: "Wishlist", key: "wishlist" },
  { label: "Watchlist", key: "watchlist" },
  { label: "Fav Person", key: "favouritePerson" },
];

const activeTab = ref<"wishlist" | "watchlist" | "favouritePerson">("wishlist");

const wishListMedia = ref<MediaItem[]>([]);
const watchListMedia = ref<MediaItem[]>([]);
const favouritePersonListMedia = ref<Person[]>([]);
const error = ref<string | null>(null);
const isLoading = ref(false);
const isInitialLoadDone = ref(false);
const isUserLoggedIn = computed(() => userData.isLoggedIn);

async function getMedia(mediaId: number, mediaType: "tv" | "movie" | "person") {
  return await $fetch<MediaItem | Person>(
    `/api/MediaById?mediaId=${mediaId}&mediaType=${mediaType}`
  );
}

function selectTab(tabKey: "wishlist" | "watchlist" | "favouritePerson") {
  activeTab.value = tabKey;
  router.push({ query: { ...route.query, tab: tabKey } });
}

onMounted(async () => {
  isLoading.value = true;
  try {
    if (!isUserLoggedIn.value)
      throw new Error("Please Log In/Sign up first to View Your Lists.");

    const [wish, watch, faVourite] = await Promise.all([
      Promise.all(
        (userData.GetUserWishList ?? []).map((item: WishListItem) =>
          getMedia(item.id, item.mediaType).catch(() => null)
        )
      ),
      Promise.all(
        (userData.GetUserWatchList ?? []).map((item: WatchListItem) =>
          getMedia(item.id, item.mediaType).catch(() => null)
        )
      ),
      Promise.all(
        (userData.GetUserFavouritePersonList ?? []).map(
          (item: FavouriePersonteItem) =>
            getMedia(item.id, item.mediaType).catch(() => null)
        )
      ),
    ]);

    wishListMedia.value = wish.filter(Boolean) as MediaItem[];
    watchListMedia.value = watch.filter(Boolean) as MediaItem[];
    favouritePersonListMedia.value = faVourite.filter(Boolean) as Person[];
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    isLoading.value = false;
    isInitialLoadDone.value = true;
  }

  const tab = route.query.tab;
  if (tab === "wishlist" || tab === "watchlist" || tab === "favouritePerson") {
    activeTab.value = tab;
  } else {
    router.replace({ query: { ...route.query, tab: "wishlist" } });
  }
});
</script>
