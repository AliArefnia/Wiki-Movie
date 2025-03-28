<template>
  <div class="flex justify-center min-h-[500px]">
    <div class="flex items-center justify-center bg-surface-dark text-white">
      <div class="w-11/12 sm:w-full max-w-md bg-surface-card p-6 rounded-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form @submit.prevent="logIn" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-2 bg-surface-hover text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full px-4 py-2 bg-surface-hover text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Log In
          </button>
        </form>

        <p class="text-sm text-center text-gray-400">
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-400 hover:underline"
            >Register</NuxtLink
          >
        </p>

        <p v-if="message" class="mt-4 text-green-400">{{ message }}</p>
        <p v-if="error" class="mt-4 text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "default",
});

import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserData } from "~/store/user";

const userData = useUserData();
const router = useRouter();
const route = useRoute();
const previousPageLink = computed(() => route.query.from || "/");

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref("");

async function logIn() {
  const supabase: any = useNuxtApp().$supabase;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    console.log(data);

    if (error) {
      error.value = error.message;
      return { error: error.message };
    }
    console.log(data.user.id);

    userData.setUserData({
      id: data.user.id,
      email: data.user.email,
      wishList: [],
    });

    await userData.getUserWishList(data.user.id);

    router.push(`${previousPageLink.value}`);
  } catch (err) {
    error.value = "Something went wrong!";
  }
}
</script>
