<script setup lang="ts" generic="T">
import type { TableColumn } from "@nuxt/ui";
import type { TableMeta } from "@tanstack/vue-table";

interface Props {
  data: T[];
  columns: TableColumn<T>[];
  meta?: TableMeta<T>;
}

const props = defineProps<Props>();
const table = useTemplateRef("table")

defineExpose({
  table
})

</script>

<template>
  <UTable ref="table" :data="data" :columns="columns" :meta="meta" class="flex-1" />
</template>
