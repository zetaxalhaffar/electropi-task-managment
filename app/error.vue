<template>
  <UContainer class="flex min-h-screen items-center justify-center">
    <div class="flex flex-col items-center gap-4 text-center">
      <span class="text-6xl font-bold">{{ error?.statusCode ?? 500 }}</span>
      <h1 class="text-xl font-semibold">
        {{ error?.statusMessage ?? "Something went wrong" }}
      </h1>
      <p class="text-muted max-w-sm">
        {{
          error?.statusCode === 404
            ? "The page you're looking for doesn't exist."
            : "An unexpected error occurred. Please try again."
        }}
      </p>
      <UButton icon="i-lucide-arrow-left" @click="handleClear">
        Back to Home
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

function handleClear() {
  clearError({ redirect: "/" });
}
</script>

<style scoped></style>
