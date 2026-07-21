<template>
  <UModal v-model:open="isOpen" :dismissible="dismissible" :scrollable="scrollable" :ui="modalUi" :close="false">
    <template v-if="hasTitle" #header="{ close }">
      <div class="flex items-center w-full gap-2">
        <slot name="title">
          <span>{{ formTitle }}</span>
        </slot>
        <div class="flex-1" />
        <UTooltip text="Close">
          <UButton v-if="hasClose" :disabled="disabled" color="neutral" variant="ghost" size="sm" @click="close">
            <UIcon name="i-lucide-x" size="18" />
          </UButton>
        </UTooltip>
      </div>
    </template>

    <template #body>
      <div class="relative">
        <UProgress v-if="loading" :model-value="null" size="xs" class="absolute top-0 inset-x-0 z-10" />
        <div :class="disabled ? 'pointer-events-none opacity-60' : ''">
          <slot name="content" />
        </div>
      </div>
    </template>

    <template v-if="hasActions" #footer>
      <div class="flex items-center w-full gap-2">
        <slot name="end-action" />
        <div class="flex-1" />
        <slot name="actions" />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  dialog: {
    type: Boolean,
    default: () => false,
  },
  formTitle: {
    type: String,
    default: "",
  },
  hasClose: {
    type: Boolean,
    default: () => false,
  },
  hasActions: {
    type: Boolean,
    default: () => false,
  },
  maxWidth: {
    type: String,
    default: () => "600",
  },
  persistent: {
    type: Boolean,
    default: () => true,
  },
  minHeight: {
    type: String,
    default: () => "",
  },
  customClass: {
    type: String,
    default: () => "",
  },
  scrollStrategy: {
    type: String,
    default: () => "block", // 'close' | 'block' | 'none' | 'reposition' — kept for API parity, mapped below
  },
  hasTitle: {
    type: Boolean,
    default: () => true,
  },
  disabled: {
    type: Boolean,
    default: () => false,
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// UModal drives itself off v-model:open, so we bridge that to the
// existing `dialog` / `update:modelValue` contract this component already exposes.
const isOpen = computed({
  get: () => props.dialog,
  set: (value: boolean) => emit("update:modelValue", value),
});

// Vuetify's `persistent` (true = can't dismiss by clicking outside / esc)
// is the inverse of Nuxt UI's `dismissible`.
const dismissible = computed(() => !props.persistent);

// Nuxt UI's Modal has no direct equivalent to Vuetify's scroll-strategy.
// `scrollable` (added in v4.2) makes the whole overlay scroll instead of
// just the body — closest match to scroll-strategy "none". Everything
// else keeps the default (body scrolls internally, page stays locked).
const scrollable = computed(() => props.scrollStrategy === "none");

function toCssSize(value: string) {
  return /^\d+$/.test(value) ? `${value}px` : value;
}

// maxWidth / minHeight / customClass all land on the Modal's `content` slot
// via arbitrary Tailwind values, since UModal has no maxWidth/minHeight props.
const modalUi = computed(() => {
  const classes = [
    props.maxWidth ? `max-w-[${toCssSize(props.maxWidth)}]!` : "",
    props.minHeight ? `min-h-[${toCssSize(props.minHeight)}]!` : "",
    props.customClass,
  ]
    .filter(Boolean)
    .join(" ");

  return { content: classes };
});
</script>

<style></style>
