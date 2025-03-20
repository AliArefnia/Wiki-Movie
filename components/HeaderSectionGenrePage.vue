<template>
  <header class="bg-surface-dark text-white shadow-lg sticky top-0 z-20">
    <div>
      <div class="container mx-auto flex justify-between items-center p-4">
        <NuxtLink to="/" class="flex items-center space-x-2 text-xl font-bold">
          <BaseButton @click="goBack">
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
      </div>
    </div>
  </header>
</template>

<script setup>
const goBack = () => {
  $router.push("/"); // or $router.back() for going back
};
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
