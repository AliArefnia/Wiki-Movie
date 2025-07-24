<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div>
      <div
        class="container px-8 sm:mx-auto flex justify-between items-center py-4 relative xl:px-40"
      >
        <BaseButton class="bg-surface-dark hover:bg-white" @click="goBack">
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

        <img
          :src="logo"
          alt="Wiki Movie Logo"
          class="w-14 m-0 absolute right-0 hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]"
          @click="navigateTo('/')"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import logo from "@/assets/images/Logo.png";
const router = useRouter();
const route = useRoute();

const goBack = () => {
  if (route.query.from) {
    router.push(route.query.from as string);
  } else {
    router.back();
  }
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
