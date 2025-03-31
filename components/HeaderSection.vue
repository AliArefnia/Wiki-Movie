<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div class="container mx-auto flex justify-between items-center p-4">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2 text-xl font-bold">
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
        <span class="">WikiMovie</span>
      </NuxtLink>

      <ClientOnly>
        <div v-if="isUserLoggedIn" @click="isUserCardOpen = !isUserCardOpen">
          <div
            class="w-10 h-10 rounded-full bg-surface-hover text-white flex items-center justify-center text-sm font-semibold overflow-hidden shadow-md"
          >
            <img src="" alt="User Avatar" class="w-full h-full object-cover" />
          </div>
          <transition name="fade">
            <div
              v-if="isUserCardOpen"
              ref="dropdown"
              class="absolute right-0 mt-2 w-56 bg-surface-card text-white shadow-lg rounded-lg overflow-hidden"
            >
              <div class="p-4 flex items-center gap-3 border-b border-gray-700">
                <div>
                  <p class="font-semibold">userName</p>
                  <p class="text-sm text-gray-400">
                    {{ userInformation.email }}
                  </p>
                </div>
              </div>
              <div class="p-2">
                <NuxtLink
                  to="/user"
                  class="block px-4 py-2 hover:bg-surface-hover rounded"
                >
                  User
                </NuxtLink>
                <NuxtLink
                  to="/wishList"
                  class="block px-4 py-2 hover:bg-surface-hover rounded"
                >
                  Wish List
                </NuxtLink>
                <BaseButton variant="danger" @click="logOut"
                  >Log Out</BaseButton
                >
              </div>
            </div>
          </transition>
        </div>
        <NuxtLink v-else to="/login"
          ><BaseButton variant="primary">Log In</BaseButton></NuxtLink
        >
      </ClientOnly>
    </div>
  </header>
</template>

<script setup>
import { useUserData } from "~/store/user";

const userData = useUserData();
const isUserLoggedIn = computed(() => userData.isLoggedIn);
const isUserCardOpen = ref(false);
const userInformation = userData.userInfo;

function logOut() {
  userData.logOut();
  router.push("/");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
