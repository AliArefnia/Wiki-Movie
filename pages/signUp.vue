<template>
  <div
    class="min-h-screen flex items-center justify-center bg-surface-dark text-white"
  >
    <div class="w-full max-w-md bg-surface-card p-6 rounded-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form @submit.prevent="signUp" class="space-y-4">
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
          Sign Up
        </button>
      </form>
      <p v-if="message" class="mt-4 text-green-400">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");
const message = ref("");
const error = ref("");

async function signUp() {
  try {
    const res = await $fetch("/api/auth/signup", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (res.error) {
      error.value = res.error;
    } else {
      message.value = "User signed up successfully!";
    }
  } catch (err) {
    error.value = "Something went wrong!";
  }
}
</script>
