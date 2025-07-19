<template>
  <div class="px-4">
    <h1 class="text-white text-2xl font-bold ml-5 mb-4 pt-5 font-display">
      Review Moderation
    </h1>
    <AdminTable
      title="Moderate Reviews"
      :headers="headers"
      endpoint="/api/admin/getReviews"
      update-endpoint="/api/admin/updateReviewsStatus"
      status-filter
      moderation-mode
      has-status
      has-date
      expand-field="comment"
      expand-label="Comment"
    />
  </div>
</template>

<script setup lang="ts">
import AdminTable from "~/components/Admin/AdminTable.vue";

const headers = [
  { text: "User Name/ID", value: "user.name" },
  { text: "Comment", value: "comment" },
  { text: "Date", value: "created_at" },
  { text: "Status", value: "status" },
  { text: "Operations", value: "operation", fixed: true },
];
</script>
