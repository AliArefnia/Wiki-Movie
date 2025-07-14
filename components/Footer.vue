<template>
  <div
    class="flex justify-around bg-surface-card text-white shadow-lg sticky bottom-0 py-2 z-20"
  >
    <NuxtLink to="/"
      ><BaseButton
        variant="footer"
        @click="footerTabSelected('home')"
        :active="activeFooterTab === 'home'"
        ><LayoutGrid /></BaseButton
    ></NuxtLink>
    <NuxtLink to="/search">
      <BaseButton
        variant="footer"
        @click="footerTabSelected('search')"
        :active="activeFooterTab === 'search'"
        ><Search
      /></BaseButton>
    </NuxtLink>
    <NuxtLink to="/user/lists">
      <BaseButton
        variant="footer"
        @click="footerTabSelected('wishList')"
        :active="activeFooterTab === 'wishList'"
        ><Heart
      /></BaseButton>
    </NuxtLink>
    <ClientOnly>
      <NuxtLink v-if="userData.isLoggedIn" to="/user/profile">
        <BaseButton
          variant="footer"
          @click="footerTabSelected('user')"
          :active="activeFooterTab === 'user'"
          ><User
        /></BaseButton>
      </NuxtLink>
      <NuxtLink v-else to="/login">
        <BaseButton
          variant="footer"
          @click="footerTabSelected('user')"
          :active="activeFooterTab === 'user'"
          ><User
        /></BaseButton>
      </NuxtLink>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { LayoutGrid, Search, Heart, User } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useUserData } from "~/store/user";

const userData = useUserData();

const route = useRoute();

const activeFooterTab = ref("");

function footerTabSelected(tab: string) {
  activeFooterTab.value = tab;
}

watch(
  () => route.path,
  (newPath) => {
    if (newPath.includes("/search") || route.query.from === "search")
      activeFooterTab.value = "search";
    else if (newPath.includes("/lists") || route.query.from === "wishList")
      activeFooterTab.value = "wishList";
    else if (newPath.includes("/user") || route.query.from === "user")
      activeFooterTab.value = "user";
    else if (newPath.includes("/login") || newPath.includes("/signup"))
      activeFooterTab.value = "user";
    else activeFooterTab.value = "home";
  },
  { immediate: true }
);
</script>
