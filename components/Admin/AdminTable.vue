<template>
  <div
    class="p-6 bg-surface-card rounded-2xl shadow-md max-w-6xl mb-30 mx-auto"
  >
    <div
      v-if="title || statusFilter"
      class="flex justify-between items-center mb-4"
    >
      <h2 class="text-xl font-bold text-white" v-if="title">{{ title }}</h2>

      <!-- Optional filter dropdown -->
      <select
        v-if="statusFilter"
        v-model="selectedStatus"
        @change="fetchData"
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
      :items="isFetching || error || items.length === 0 ? [] : items"
      :rows-per-page="5"
      :body-cell-class="() => 'whitespace-normal break-words'"
      :fixed-columns="1"
      :loading="isFetching"
      table-class="!bg-slate-900 !text-white"
      header-class="!bg-slate-800 !text-white"
      body-row-class="!hover:bg-slate-800 transition duration-200"
    >
      <template #loading>
        <img
          src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
          style="width: 100px; height: 80px"
        />
      </template>

      <template #expand="item" v-if="expandField">
        <div class="xs:px-5 sm:px-10">
          {{ expandLabel }}: {{ item[expandField] }}
        </div>
      </template>

      <template #item-created_at="item" v-if="hasDate">
        <div class="whitespace-normal break-words">
          {{ formatDate(item.created_at) }}
        </div>
      </template>

      <template #item-status="item" v-if="hasStatus">
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

      <!-- Custom operation actions -->
      <template #item-operation="item">
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-2 my-2 mx-auto"
        >
          <template v-if="moderationMode">
            <button
              v-if="item.status !== 'approved'"
              @click="updateStatus(item.id, 'approved')"
              class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              :disabled="loadingIds.has(item.id)"
            >
              Approve
            </button>
            <button
              v-if="item.status !== 'rejected'"
              @click="updateStatus(item.id, 'rejected')"
              class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              :disabled="loadingIds.has(item.id)"
            >
              Reject
            </button>
            <button
              v-if="item.status === 'approved' || item.status === 'rejected'"
              @click="updateStatus(item.id, 'pending')"
              class="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              :disabled="loadingIds.has(item.id)"
            >
              Pend
            </button>
          </template>

          <template v-if="userDeleteMode">
            <button
              @click="deleteUser(item.id)"
              class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              :disabled="loadingIds.has(item.id)"
            >
              Delete
            </button>
          </template>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script setup lang="ts">
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

const props = defineProps<{
  title?: string;
  headers: any[];
  endpoint: string;
  statusFilter?: boolean;
  moderationMode?: boolean;
  userDeleteMode?: boolean;
  expandField?: string;
  expandLabel?: string;
  hasStatus?: boolean;
  hasDate?: boolean;
  updateEndpoint?: string;
  deleteEndpoint?: string;
}>();

const items = ref([]);
const isFetching = ref(false);
const error = ref("");
const selectedStatus = ref<"all" | "pending" | "approved" | "rejected">(
  "pending"
);
const loadingIds = ref(new Set());

onMounted(() => {
  window.addEventListener("resize", updateWidth);
  fetchData();
});
onUnmounted(() => window.removeEventListener("resize", updateWidth));

async function fetchData() {
  isFetching.value = true;
  error.value = "";
  try {
    const query =
      props.statusFilter && selectedStatus.value !== "all"
        ? `?status=${selectedStatus.value}`
        : "";
    items.value = await $fetch(`${props.endpoint}${query}`);
  } catch (err) {
    error.value = "Failed to fetch data";
  } finally {
    isFetching.value = false;
  }
}

async function updateStatus(id: number, status: string) {
  if (loadingIds.value.has(id)) return;
  loadingIds.value.add(id);
  try {
    await $fetch(props.updateEndpoint || "", {
      method: "POST",
      body: { reviewId: id, status },
    });
    await fetchData();
  } catch (err) {
    error.value = "Update failed.";
  } finally {
    loadingIds.value.delete(id);
  }
}

async function deleteUser(id: number) {
  if (!props.deleteEndpoint) return;
  if (loadingIds.value.has(id)) return;
  loadingIds.value.add(id);
  try {
    await $fetch(`${props.deleteEndpoint}/${id}`, {
      method: "DELETE",
    });
    await fetchData();
  } catch (err) {
    error.value = "Delete failed.";
  } finally {
    loadingIds.value.delete(id);
  }
}

const windowWidth = ref(0);
function updateWidth() {
  windowWidth.value = window.innerWidth;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return windowWidth.value < 640
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}
</script>

<style scoped>
.customize-table {
  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;
}
</style>
