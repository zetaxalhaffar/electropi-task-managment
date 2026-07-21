<script setup lang="ts"></script>

<template>
  <UHeader>
    <template #title>
      <span> LOGO </span>
    </template>

    <template #right>
      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/zetaxalhaffar"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
