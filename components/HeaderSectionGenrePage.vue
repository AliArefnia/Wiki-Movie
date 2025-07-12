<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div>
      <div
        class="container px-8 sm:mx-auto flex justify-between items-center py-4 relative"
      >
        <NuxtLink
          :to="previousPageLink"
          class="flex items-center space-x-2 text-xl font-bold"
        >
          <BaseButton class="bg-surface-dark">
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </BaseButton>
        </NuxtLink>
        <NuxtImg
          src="/images/Logo.png"
          alt="Wiki Movie Logo"
          class="w-15 m-0 absolute right-8"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const previousPageLink = computed(() => route.query.from || "/");

let openNavigation = ref(false);

const toggleNav = () => {
  openNavigation.value = !openNavigation.value;
  console.log(openNavigation.value);
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
