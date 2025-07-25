<template>
  <Transition name="fade" mode="out-in">
    <div
      class="flex flex-col items-center justify-center text-white px-6 text-center mt-10"
    >
      <h1 class="text-7xl font-bold text-primary mb-4">404</h1>
      <p class="text-2xl mb-6">Page not found</p>
      <p class="text-gray-400 mb-8 max-w-md">
        Looks like this scene got cut from the final movie
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 bg-primary hover:bg-white hover:text-primary text-white font-semibold px-6 py-3 rounded-md transition-all duration-200"
      >
        <House class="w-5 h-5" />
        Go to Homepage
      </NuxtLink>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { House } from "lucide-vue-next";
</script>
