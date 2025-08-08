<template>
  <div>
    <ClientOnly>
      <BaseAlertModule :show="loggingOut" @close="logOut(false)">
        <template #header>Logging Out</template>
        <template #default>
          <p class="!text-xl">Are You sure you want to log out?</p>
        </template>
        <template #actions="{ close }">
          <BaseButton
            @click="
              close;
              logOut(true);
            "
            class="!bg-btn-accent w-[5rem] ml-2 text-white"
            >Yes</BaseButton
          >
          <BaseButton
            @click="
              close;
              logOut(false);
            "
            class="border-2 w-[5rem]"
            >No</BaseButton
          >
        </template>
      </BaseAlertModule>

      <div class="max-w-5xl mx-auto mt-10 px-4">
        <div
          class="bg-surface-card text-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-8"
        >
          <!-- LEFT SIDE: User Info -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold border-b border-white/20 pb-4">
              Profile
            </h2>

            <!-- NAME -->
            <div>
              <label class="block text-sm font-semibold mb-1">Name</label>
              <p v-if="!isEditing" class="text-lg text-gray-300 ml-2">
                {{ name || "Set Name" }}
              </p>
              <input
                v-else
                ref="nameInput"
                v-model="name"
                type="text"
                placeholder="Enter your name"
                class="w-full text-lg bg-transparent border-b p-2 border-gray-400 focus:border-white transition duration-300 text-gray-100 placeholder-gray-500 focus:border-2"
              />
            </div>

            <!-- EMAIL -->
            <div>
              <label class="block text-sm font-semibold mb-1">Email</label>
              <p class="text-lg text-gray-300 ml-2">
                {{ email || "Set Email" }}
              </p>
            </div>

            <!-- JOINED DATE -->
            <div>
              <label class="block text-sm font-semibold mb-1">Joined</label>
              <p class="text-lg text-gray-300 ml-2">{{ JoinDate }}</p>
            </div>
          </div>

          <!-- RIGHT SIDE: Favorite & Actions -->
          <div class="flex flex-col justify-between space-y-8">
            <!-- FAVORITE MOVIES -->
            <div class="md:mx-auto">
              <label class="block text-sm font-semibold mb-1 w-fit md:mx-auto"
                >Favorite Movies</label
              >
              <NuxtLink
                class="text-lg text-gray-300 hover:text-white cursor-pointer underline transition"
                to="/user/lists"
              >
                See Favorite Movies
              </NuxtLink>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="flex flex-col sm:flex-row gap-4 pt-6 mt-auto">
              <BaseButton
                @click="toggleEdit"
                varient="primary"
                class="flex-1 py-2 text-white"
                :disabled="isEditing && !name?.trim()"
              >
                {{ isEditing ? "Save" : "Edit Profile" }}
              </BaseButton>

              <BaseButton
                variant="danger"
                class="flex-1 py-2 hover:bg-white hover:text-btn-accent transition"
                @click="logOutAlert"
              >
                Log Out
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});
useHead({
  title: "User Profile",
});

import { useUserData } from "~/store/user";
import { useRouter } from "vue-router";
import BaseAlertModule from "~/components/base/BaseAlertModule.vue";

const userData = useUserData();
const email = computed(() => userData.userEmail);
const name = ref(userData.userName);
const JoinDate = computed(() => {
  const date = userData.userJoinDate;
  return date ? new Date(date).toLocaleDateString() : "Unknown";
});

const isEditing = ref(false);
const loggingOut = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const router = useRouter();

function logOutAlert() {
  loggingOut.value = true;
}

function logOut(choice: boolean) {
  if (choice) {
    userData.logOut();
    router.push("/");
  } else {
    loggingOut.value = false;
  }
}

function toggleEdit() {
  if (isEditing.value) {
    userData.updateUserName(name.value!);
  }
  isEditing.value = !isEditing.value;
}

watch(isEditing, async (val) => {
  if (val) {
    await nextTick();
    nameInput.value?.focus();
  }
});
</script>
