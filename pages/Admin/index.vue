<template>
  <section>
    <!-- Page content -->
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Welcome, Admin!</h1>
      <p class="mb-6 text-gray-300">
        Choose a section to begin managing the application.
      </p>

      <!-- Optional: Overview section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-surface-card p-4 rounded shadow group">
          <h2 class="text-lg font-semibold mb-2">👥 Users</h2>
          <p class="text-sm text-gray-400">
            Manage registered users, delete accounts, and more.
          </p>
          <NuxtLink
            to="/admin/users"
            class="inline-block mt-3 text-primary hover:scale-105 transition-transform"
          >
            Go to User Management
            <span
              class="group-hover:ml-2 transition-all duration-300 animate-pulse"
              >→</span
            >
          </NuxtLink>
        </div>
        <div class="bg-surface-card p-4 rounded shadow group">
          <h2 class="text-lg font-semibold mb-2">📝 Reviews</h2>
          <p class="text-sm text-gray-400">
            Moderate user comments and change review statuses.
          </p>
          <NuxtLink
            to="/admin/reviews"
            class="inline-block mt-3 text-primary hover:scale-105 transition-transform"
          >
            Go to Review Moderation
            <span
              class="group-hover:ml-2 transition-all duration-300 animate-pulse"
              >→</span
            >
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin-panel",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "Admin Panel",
});
</script>
