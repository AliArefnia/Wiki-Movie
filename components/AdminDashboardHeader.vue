<template>
  <div class="flex flex-col">
    <header
      class="bg-surface-card text-white shadow-lg sticky top-0 z-20 h-[60px]"
    >
      <aside
        ref="sidebarRef"
        class="h-screen -z-50"
        :class="[
          'fixed inset-y-0 left-0 w-64 bg-surface-dark z-50 shadow-lg p-4 transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-gray-700"
        >
          <h2 class="text-lg font-bold">Admin Panel</h2>
          <button
            @click="closeSidebar"
            class="text-gray-400 hover:text-white hover:cursor-pointer hover:scale-105 transition-all"
          >
            ✕
          </button>
        </div>
        <nav class="flex flex-col space-y-4 mt-4">
          <div @click="isSidebarOpen = false">
            <NuxtLink
              to="/admin/users"
              class="text-white py-2 px-3 rounded hover:bg-slate-700 transition"
              >👥 User Management</NuxtLink
            >
          </div>
          <div @click="isSidebarOpen = false">
            <NuxtLink
              to="/admin/reviews"
              class="text-white py-2 px-3 rounded hover:bg-slate-700 transition"
              >📝 Review Moderation</NuxtLink
            >
          </div>
        </nav>
      </aside>

      <!-- Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50"
        @click="closeSidebar"
      />

      <div
        class="container flex justify-between items-center px-4 relative h-full max-w-full"
      >
        <div class="p-4 flex items-center justify-between">
          <button
            class="text-white hover:cursor-pointer hover:text-primary transition-colors duration-300"
            @click.stop="toggleSidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <img
          :src="logo"
          alt="Wiki Movie Logo"
          class="w-14 m-0 absolute right-4 sm:right-8 md:right-12 hover:cursor-pointer hover:scale-105 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]"
          @click="navigateTo('/')"
        />
      </div>
    </header>
    <div class="bg-transparent px-6 pt-3 mb-2">
      <BaseButton class="bg-surface-card hover:bg-white" @click="goBack">
        <svg
          class="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import logo from "@/assets/images/Logo.webp";

const isSidebarOpen = ref(false);
const sidebarRef = ref<HTMLElement | null>(null);

const router = useRouter();
const route = useRoute();

const goBack = () => {
  if (route.query.from) {
    router.push(route.query.from as string);
  } else {
    router.back();
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  if (sidebarRef.value && !sidebarRef.value.contains(e.target as Node)) {
    closeSidebar();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped></style>
