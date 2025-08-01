<template>
  <div class="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto my-10">
    <h3 class="text-2xl font-display font-bold text-white mb-6">Comments</h3>

    <!-- Input Section -->
    <div
      class="rounded-xl p-5 mb-8 shadow-lg border border-surface-hover bg-surface-dark"
    >
      <template v-if="isLoggedIn">
        <textarea
          v-model="newComment"
          rows="2"
          class="w-full p-4 rounded-lg bg-surface-card placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
          placeholder="Write your comment here..."
        ></textarea>

        <div class="mt-4 text-right">
          <BaseButton
            variant="accent"
            size="sm"
            @click="submitComment"
            :disabled="!newComment.trim() || isSubmitting"
          >
            {{ isSubmitting ? "Sending..." : "Send Comment" }}
          </BaseButton>
        </div>
      </template>

      <template v-else>
        <p class="text-gray-300 mb-4 font-display">
          You must be logged in to send a comment.
        </p>
        <NuxtLink
          to="/login"
          class="bg-btn-accent text-white hover:bg-primary hover:cursor-pointer hover:text-black px-4 py-2 rounded-full font-display inline-block transition duration-300"
        >
          Login to comment
        </NuxtLink>
      </template>
    </div>

    <!-- Comments -->
    <div
      v-if="status === 'pending'"
      class="flex justify-center items-center mt-6"
    >
      <BaseLoader message="Fetching Comments..." />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex justify-center items-center">
      <BaseErrorContainer :error="error" :refresh="refresh" />
    </div>

    <!-- Success -->
    <div v-if="visibleComments">
      <!-- Comments List -->
      <div class="space-y-4">
        <BaseCommentCard
          v-for="comment in visibleComments"
          :key="comment.id"
          :comment="comment"
        />
      </div>

      <!-- Show More -->
      <div
        v-if="visibleCount < sortedComment.length"
        class="flex justify-center mt-6"
      >
        <BaseButton
          variant="accent"
          size="sm"
          class="flex items-center gap-2 text-xs sm:text-base"
          @click="loadMore"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
          Show More Comments
        </BaseButton>
      </div>
    </div>
    <!-- 0 comment -->
    <div
      v-if="visibleComments.length === 0"
      class="mx-auto mt-6 p-4 text-center w-1/2"
    >
      <p class="text-sm sm:text-base font-display text-gray-400">
        No comments yet. Be the first to share your thoughts!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserData } from "~/store/user";
import type { Comments } from "~/types/types";
import BaseCommentCard from "./BaseComponents/BaseCommentCard.vue";
import BaseButton from "../base/BaseButton.vue";

const props = defineProps<{
  mediaId: number;
}>();

const {
  data: comments,
  status,
  error,
  refresh,
} = useAsyncData(
  () => $fetch<Comments[]>(`/api/MediaReview?mediaId=${props.mediaId}`),
  { default: () => [] }
);

const userStore = useUserData();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const userId = computed(() => userStore.userInfo.id);

const newComment = ref("");
const isSubmitting = ref(false);

const sortedComment = computed(() =>
  [...comments.value].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  })
);

const visibleCount = ref(3);
const visibleComments = computed(() =>
  sortedComment.value.slice(0, visibleCount.value)
);
const loadMore = () => {
  visibleCount.value += 3;
};

const submitComment = async () => {
  if (!newComment.value.trim() || !userId.value) return;

  try {
    isSubmitting.value = true;
    const response = await $fetch("/api/AddMediaComment", {
      method: "POST",
      body: {
        comment: newComment.value.trim(),
        mediaId: props.mediaId,
        userId: userId.value,
      },
    });

    if ("success" in response && response.success) {
      newComment.value = "";
      await refresh();
    } else {
      console.error((response as { error: string }).error);
    }
  } catch (error) {
    console.error("Failed to send comment", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
