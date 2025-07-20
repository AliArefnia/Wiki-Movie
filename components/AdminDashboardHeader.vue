<template>
  <div class="flex flex-col">
    <header>
      <aside
        ref="sidebarRef"
        :class="[
          'fixed inset-y-0 left-0 w-64 bg-gray-800 z-50 shadow-lg p-4 transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-gray-700"
        >
          <h2 class="text-lg font-bold">Admin Panel</h2>
          <button
            @click="closeSidebar"
            class="text-gray-400 hover:text-white hover:cursor-pointer"
          >
            ✕
          </button>
        </div>
        <nav class="flex flex-col space-y-2">
          <NuxtLink
            to="/admin/users"
            class="text-white py-2 px-3 rounded hover:bg-slate-700 transition"
            >👥 User Management</NuxtLink
          >
          <NuxtLink
            to="/admin/reviews"
            class="text-white py-2 px-3 rounded hover:bg-slate-700 transition"
            >📝 Review Moderation</NuxtLink
          >
          <!-- <NuxtLink
          to="/admin/dashboard"
          class="text-white py-2 px-3 rounded hover:bg-slate-700 transition"
          >📊 Dashboard</NuxtLink
        > -->
        </nav>
      </aside>
      <!-- Overlay -->

      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50"
        @click="closeSidebar"
      />

      <div class="bg-slate-800 p-4 flex items-center justify-between">
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
        <NuxtImg
          src="/images/Logo.png"
          alt="Wiki Movie Logo"
          class="w-15 m-0 absolute right-8 hover:cursor-pointer scale-85 hover:scale-90 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,0,128,0.4)] xl:right-40"
          @click="navigateTo('/')"
        />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
const sidebarRef = ref<HTMLElement | null>(null);

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
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
