<template>
  <div>
    <Header />
    <div class="p-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "~/components/layouts/Header.vue";
</script>
