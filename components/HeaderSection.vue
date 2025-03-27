<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div>
      <div class="container mx-auto flex justify-between items-center p-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2 text-xl font-bold">
          <svg
            class="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3v18l9-6 9 6V3"
            ></path>
          </svg>
          <span class="">WikiMovie</span>
        </NuxtLink>

        <!-- <BaseButton>
          <svg
            class="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m8-9h1M4 12H3m16.07-7.07l-.71.71M7.05 7.05l-.7-.7M16.95 16.95l.7.7M7.05 16.95l-.7.7M12 5a7 7 0 0 1 0 14 7 7 0 0 1 0-14"
            ></path>
          </svg>
        </BaseButton> -->

        <!-- <BaseButton @click="toggleNav"><AlignJustify /> </BaseButton> -->
        <!-- 
        <transition name="navTransition">
          <div
            :class="{ flex: openNavigation, hidden: !openNavigation }"
            class="flex flex-col w-2/3 md:w-1/3 lg:w-1/4 justify-center items-center h-screen fixed right-0 top-0 bottom-[56px] z-10 bg-surface-hover"
          >
            <BaseButton
              class="absolute top-2 left-2 bg-surface-dark"
              @click="closeNav"
              >Close</BaseButton
            >
            <p>{{ openNavigation }}</p>
            <NuxtLink to="">Profile</NuxtLink>
            <NuxtLink to="">a link</NuxtLink>
            <NuxtLink to="">a link</NuxtLink>
            <NuxtLink to="">a link</NuxtLink>
            <BaseButton>Log Out</BaseButton>
            <BaseButton>Toggle Dark mode</BaseButton>
            <ClientOnly>
              <p v-if="isUserLoaded && userEmail">
                {{ userEmail }}
              </p>
            </ClientOnly>
          </div>
        </transition> -->
      </div>
    </div>
  </header>
</template>

<script setup>
import { AlignJustify } from "lucide-vue-next";

import { useUserData } from "~/store/user";

const userData = useUserData();
const userEmail = computed(() => userData.userEmail);
const isUserLoaded = computed(() => userData.getIsUserLoaded);

let openNavigation = ref(false);

const toggleNav = () => {
  openNavigation.value = !openNavigation.value;
  if (openNavigation.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
};

const closeNav = () => {
  openNavigation.value = false;
  document.body.style.overflow = "auto";
};
// const openNavi = computed(() => openNavigation);
</script>

<style scoped>
.navTransition-enter-to,
.navTransition-leave-from {
  opacity: 1;
  max-width: 400px;
}
.navTransition-enter-from,
.navTransition-leave-to {
  opacity: 0;
  max-width: 0;
}

.navTransition-enter-active,
.navTransition-leave-active {
  transition: all 0.3s ease-in;
}
</style>
