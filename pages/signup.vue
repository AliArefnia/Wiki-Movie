<template>
  <div class="flex justify-center min-h-[500px]">
    <div
      class="flex flex-col items-center justify-center bg-surface-dark text-white"
    >
      <NuxtImg src="/images/Logo.png" alt="Wiki Movie Logo" class="w-30 mb-4" />
      <div
        class="flex flex-col w-11/12 sm:w-full max-w-md bg-surface-card p-6 rounded-lg"
      >
        <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form @submit.prevent="signUp" class="space-y-4">
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
            autocomplete="new-password"
            required
            @input="error = ''"
            class="w-full px-4 py-2 bg-surface-hover text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            v-model="repeatPassword"
            type="password"
            placeholder="Repeat Password"
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
          >
            <p v-if="!isSigninUp">Sign Up</p>
            <BaseSmallSpinner v-if="isSigninUp"></BaseSmallSpinner>
          </button>
        </form>
        <p class="text-sm text-center text-gray-400 mt-4">
          already have an account?
          <NuxtLink to="/login" class="text-blue-400 hover:underline"
            >Log In</NuxtLink
          >
        </p>

        <!-- <p v-if="message" class="mt-4 text-green-400">{{ message }}</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  title: "Sign Up",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserData } from "~/store/user";

const userData = useUserData();
const router = useRouter();

const email = ref("");
const password = ref("");
const repeatPassword = ref("");
const message = ref("");
const error = ref("");
const isSigninUp = ref(false);
const emailInput = ref<HTMLInputElement | null>(null);

async function signUp() {
  const supabase: any = useNuxtApp().$supabase;

  try {
    if (password.value !== repeatPassword.value) {
      error.value = "Passwords do not match!";
      return;
    }
    if (password.value.length < 6) {
      error.value = "Password must be at least 6 characters.";
      return;
    }
    isSigninUp.value = true;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (signUpError) {
      error.value = signUpError.message;
      return { error: signUpError.message };
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        email: email.value,
        wish_list: [],
      },
    ]);

    if (insertError) {
      return { error: insertError.message };
    }

    userData.setUserData({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      wishList: [],
      created_at: data.user.created_at,
    });

    router.push("/");
  } catch (err) {
    error.value = "Something went wrong!";
  } finally {
    isSigninUp.value = false;
  }
}
onMounted(() => {
  emailInput.value?.focus();
});
</script>
