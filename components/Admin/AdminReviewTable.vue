<template>
  <div class="p-6 bg-surface-card rounded-2xl shadow-md max-w-6xl mb-30">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-white">Moderate Reviews</h2>
      <select
        v-model="selectedStatus"
        @change="fetchReviews"
        class="bg-white border px-3 py-2 rounded-md text-sm"
        :disabled="isFetching"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="all">All</option>
      </select>
    </div>

    <EasyDataTable
      class="w-full text-sm mx-auto rounded-xl bg-slate-900 text-white border border-slate-700"
      table-class-name="customize-table"
      header-text-direction="center"
      body-text-direction="center"
      :headers="headers"
      :items="isFetching || error || reviews.length === 0 ? [] : reviews"
      :rows-per-page="5"
      :body-cell-class="() => 'whitespace-normal break-words'"
      :fixed-columns="1"
      :loading="isFetching"
      table-class="!bg-slate-900 !text-white"
      header-class="!bg-slate-800 !text-white"
      body-row-class="!hover:bg-slate-800 transition duration-200"
    >
      <!-- ✅ Status with colored pills -->
      <template #loading>
        <img
          src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
          style="width: 100px; height: 80px"
          alt="Loader gif"
        />
      </template>
      <template #expand="item">
        <div class="xs:px-5 sm:px-10">Comment: {{ item.comment }}</div>
      </template>

      <template #item-user.name="item">
        <div>
          {{ item.user?.name || item.user?.id.slice(0, 15) || "Unknown" }}
        </div>
      </template>
      <template #item-status="item">
        <span
          class="px-2 py-1 text-xs rounded-full font-medium"
          :class="{
            'bg-green-100 text-green-700': item.status === 'approved',
            'bg-yellow-100 text-yellow-700': item.status === 'pending',
            'bg-red-100 text-red-700': item.status === 'rejected',
          }"
        >
          {{ item.status }}
        </span>
      </template>

      <template #item-created_at="item">
        <div class="whitespace-normal break-words">
          {{ formatDate(item.created_at) }}
        </div>
      </template>
      <template #item-comment="item">
        <div
          class="max-w-xs whitespace-normal break-words line-clamp-3 sm:line-clamp-4"
        >
          {{ item.comment }}
        </div>
      </template>

      <!-- ✅ Operation buttons with responsive layout -->
      <template #item-operation="item">
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-2 my-2 mx-auto"
        >
          <button
            v-if="item.status !== 'approved'"
            @click="updateStatus(item.id, 'approved')"
            class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer"
            :disabled="loadingIds.has(item.id)"
          >
            Approve
          </button>
          <button
            v-if="item.status !== 'rejected'"
            @click="updateStatus(item.id, 'rejected')"
            class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-700 hover:cursor-pointer"
            :disabled="loadingIds.has(item.id)"
          >
            Reject
          </button>
          <button
            v-if="item.status === 'rejected'"
            @click="updateStatus(item.id, 'pending')"
            class="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 hover:cursor-pointer"
            :disabled="loadingIds.has(item.id)"
          >
            Pend
          </button>
          <button
            v-if="item.status === 'approved'"
            @click="updateStatus(item.id, 'pending')"
            class="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 hover:cursor-pointer"
            :disabled="loadingIds.has(item.id)"
          >
            Pend
          </button>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script setup lang="ts">
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const reviews = ref([]);
const selectedStatus = ref<"all" | "pending" | "approved" | "rejected">(
  "pending"
);
const isFetching = ref(false);
const error = ref("");
const loadingIds = ref(new Set());

const headers = [
  { text: "User Name/ID", value: "user.name" },
  { text: "Comment", value: "comment" },
  { text: "Date", value: "created_at" },
  { text: "Status", value: "status" },
  { text: "Operations", value: "operation", fixed: true },
];

onMounted(async () => {
  window.addEventListener("resize", updateWidth);
  fetchReviews();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

async function fetchReviews() {
  try {
    error.value = "";
    isFetching.value = true;

    const query =
      selectedStatus.value === "all" ? "" : `?status=${selectedStatus.value}`;
    reviews.value = await $fetch(`/api/admin/getReviews${query}`);
  } catch (err) {
    error.value = (err as Error).message || "Failed to fetch reviews.";
  } finally {
    isFetching.value = false;
  }
}

async function updateStatus(
  reviewId: number,
  status: "all" | "pending" | "approved" | "rejected"
) {
  if (loadingIds.value.has(reviewId)) return;
  loadingIds.value.add(reviewId);
  error.value = "";
  try {
    await $fetch("/api/admin/updateReviewsStatus", {
      method: "POST",
      body: { reviewId, status },
    });
    await fetchReviews();
  } catch (err) {
    error.value = "Failed to update review status.";
  } finally {
    loadingIds.value.delete(reviewId);
  }
}

const windowWidth = ref();

function updateWidth() {
  windowWidth.value = window.innerWidth;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (windowWidth.value < 640) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } else {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
}
</script>
<style scoped>
.customize-table {
  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;
}
</style>
