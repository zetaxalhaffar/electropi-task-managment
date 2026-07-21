<script setup lang="ts">
interface Props {
  title: string;
  hasSlot?: boolean;
  isSticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  isSticky: true,
});
</script>
<template>
  <div
    class="rounded-lg px-4 py-3 main-border"
    :style="[
      isSticky
        ? {
            position: 'sticky',
            top: '80px',
            zIndex: 1000,
            background: '#ffffff80 !important',
            backdropFilter: 'blur(5px)',
          }
        : { background: '#FFF' },
    ]"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div
        v-if="!hasSlot"
        class="flex min-w-0 flex-1 flex-wrap items-center gap-3"
      >
        <div class="capitalize flex items-center gap-2">
          <div>
            {{ title ?? "" }}
          </div>
        </div>
      </div>
      <div v-if="hasSlot" class="min-w-0 flex-1">
        <slot name="actions" />
      </div>
      <div class="flex flex-wrap items-center gap-1">
        <slot />
      </div>
    </div>
  </div>
</template>
