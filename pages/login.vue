<template>
  <div class="flex justify-center min-h-[500px]">
    <div
      class="flex flex-col items-center justify-center bg-surface-dark text-white"
    >
      <NuxtImg src="/images/Logo.png" alt="Wiki Movie Logo" class="w-30 mb-4" />
      <div class="w-11/12 sm:w-full max-w-md bg-surface-card p-6 rounded-lg">
        <h2 class="text-2xl font-bold mb-6 text-center">Log In</h2>
        <form @submit.prevent="logIn" class="space-y-4">
          <input
            v-model="email"
            ref="emailInput"
            type="email"
            placeholder="Email"
            autocomplete="username"
            required
            @input="error = ''"
            class="w-full px-4 py-2 bg-surface-hover text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            required
            @input="error = ''"
            class="w-full px-4 py-2 bg-surface-hover text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <transition name="fade" mode="out-in">
            <p v-if="error" class="mb-4 text-red-400">{{ error }}!</p>
          </transition>

          <button
            type="submit"
            class="flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer"
            :disabled="isLoggingIn"
          >
            <p v-if="!isLoggingIn">Log In</p>
            <BaseSmallSpinner v-if="isLoggingIn"></BaseSmallSpinner>
          </button>
        </form>

        <p class="text-sm text-center text-gray-400 mt-4">
          Don't have an account?
          <NuxtLink to="/signup" class="text-blue-400 hover:underline"
            >Register</NuxtLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Login",
});

import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserData } from "~/store/user";

import BaseSmallSpinner from "~/components/base/BaseSmallSpinner.vue";

const userData = useUserData();
const router = useRouter();
const route = useRoute();
const previousPageLink = computed(() => route.query.from || "/");

const email = ref("");
const password = ref("");
const error = ref("");
const isLoggingIn = ref(false);
const emailInput = ref<HTMLInputElement | null>(null);

async function logIn() {
  const supabase: any = useNuxtApp().$supabase;
  try {
    isLoggingIn.value = true;
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (loginError) {
      error.value = loginError.message;
      return { error: loginError.message };
    }

    userData.setUserData({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      wishList: [],
      created_at: data.user.created_at,
    });

    await userData.getUserWishList(data.user.id);

    router.push(`${previousPageLink.value}`);
  } catch (err) {
    error.value = "Something went wrong!";
  } finally {
    isLoggingIn.value = false;
  }
}

onMounted(() => {
  emailInput.value?.focus();
});
</script>
