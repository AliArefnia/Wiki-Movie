<template>
  <div
    class="max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
  >
    <img :src="imageUrl" alt="Movie poster" class="w-full h-48 object-cover" />

    <div class="p-6">
      <div class="flex items-baseline justify-between mb-3">
        <h2 class="text-xl font-bold text-gray-800">
          {{ title }}
        </h2>
        <span class="text-sm text-gray-500">{{ year }}</span>
      </div>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(genre, index) in genres"
          :key="index"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          {{ genre }}
        </span>
      </div>

      <div class="flex items-center mb-4">
        <span class="text-yellow-500">★</span>
        <span class="ml-2 text-gray-700">{{ rating }}/10</span>
      </div>

      <p class="text-gray-600 text-sm leading-6">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script></script>
