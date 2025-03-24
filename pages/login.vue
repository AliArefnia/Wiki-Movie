<template>
  <div class="flex items-center justify-center min-h-screen bg-surface-dark">
    <div class="w-full max-w-md p-8 space-y-6 bg-surface-card rounded-lg">
      <h2 class="text-2xl font-bold text-center text-white">Login</h2>
      <form @submit.prevent="Login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-white"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-4 py-2 mt-1 rounded-md bg-surface-hover text-white focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-4 py-2 mt-1 rounded-md bg-surface-hover text-white focus:ring focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Login
        </button>
      </form>
      <p class="text-sm text-center text-gray-400">
        Don't have an account?
        <NuxtLink to="/signup" class="text-blue-400 hover:underline"
          >Register</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "nuxt/app";

const email = ref("");
const password = ref("");
const router = useRouter();
</script>

<style scoped></style>
