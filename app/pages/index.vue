<template>
  <UContainer class="flex min-h-[80vh] items-center justify-center">
    <div class="flex flex-col items-center gap-4 text-center max-w-md">
      <UIcon name="i-lucide-list-todo" class="size-12 text-primary" />
      <h1 class="text-2xl font-semibold">Welcome to ElectroPi Tasks</h1>
      <p class="text-muted">
        Organize, track, and manage your tasks in one place.
      </p>
      <UButton icon="i-lucide-arrow-right" trailing @click="router.push('/tasks')">
        Go to Tasks
      </UButton>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const router = useRouter();
</script>

<style scoped></style>
