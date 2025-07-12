<template>
  <header class="bg-surface-card text-white shadow-lg sticky top-0 z-20">
    <div
      class="container mx-4 sm:mx-auto lg:mx-20 flex justify-between items-center p-4 relative"
    >
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

      <NuxtImg
        src="/images/Logo.png"
        alt="Wiki Movie Logo"
        class="w-14 m-0 absolute right-0"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserData } from "~/store/user";
import { CircleUserRound } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const userData = useUserData();
const isUserLoggedIn = computed(() => userData.isLoggedIn);
const isUserCardOpen = ref(false);
const userInformation = userData.userInfo;

function logOut() {
  userData.logOut();
  router.push("/");
}

const dropdown = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isUserCardOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
