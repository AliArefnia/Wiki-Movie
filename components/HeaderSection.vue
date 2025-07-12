<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div
      class="container mx-4 sm:mx-auto lg:mx-20 flex justify-between items-center p-4 relative"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex items-center space-x-2 text-xl font-bold hover:scale-105 transition-all"
      >
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

        <span class="">Wiki Movie</span>
      </NuxtLink>

      <NuxtImg
        src="/images/Logo.png"
        alt="Wiki Movie Logo"
        class="w-14 m-0 absolute right-0 hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]"
        @click="navigateTo('/')"
      />
    </div>
  </header>
</template>

<script setup lang="ts"></script>
