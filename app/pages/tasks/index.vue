<template>
  <TaskFromManager ref="taskFormRef" />
  <GeneralConfirmationDialog
    ref="deleteDialogRef"
    :is-deleting-building="isDeleting"
    :delete-building-mutation="confirmDeleteTask"
  />
  <UContainer>
    <AppPageToolbar title="Tasks">
      <UButton @click="taskFormRef?.handleOpenCreate()"> Create </UButton>
    </AppPageToolbar>
    <div class="mt-4 rounded-lg main-border">
      <div class="border-b border-accented p-4 flex gap-4">
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          class="min-w-37.5"
          placeholder="Filter by status"
        />
        <UInput
          v-model="titleInput"
          v-debounce="{ delay: 600, handler: handleChangeSearch }"
          class="max-w-sm"
          placeholder="Search by title..."
        />
      </div>
      <EditableTable :loading="pending" :columns="columns" :data="data ?? []" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import AppPageToolbar from "~/components/shared/AppPageToolbar.vue";
import EditableTable from "~/components/shared/EditableTable.vue";
import GeneralConfirmationDialog from "~/components/shared/GeneralConfirmationDialog.vue";
import TaskFromManager from "~/components/tasks/TaskFromManager.vue";
import { useTaskStore } from "~/stores/tasks";
import type { Task } from "~/types/tasks";

// SECTION: Config
const toast = useToast();
const router = useRouter();

// SECTION: Resolve NUXTUI Components
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

// SECTION: Stores
const taskStore = useTaskStore();
const { tasksList, deleteTask } = taskStore;

// SECTION: Status filter
const ALL_STATUSES = "all";
const statusOptions = [
  { label: "All", value: ALL_STATUSES },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];
const statusFilter = ref<string>(ALL_STATUSES);
const titleInput = ref<string>("");
const titleFilter = ref<string>("");

function handleChangeSearch(value: string) {
  titleFilter.value = value;
}

const { status, error, refresh, data, pending } = await useAsyncData(
  "tasks-list",
  () =>
    tasksList(
      removeEmptyValues({
        status: statusFilter.value === ALL_STATUSES ? "" : statusFilter.value,
        "title:contains": titleFilter.value,
      }),
    ),
  { watch: [statusFilter, titleFilter], lazy: true },
);

// SECTION: Create/Edit task
const taskFormRef = useTemplateRef("taskFormRef");

// SECTION: Delete task
const deleteDialogRef = ref<InstanceType<
  typeof GeneralConfirmationDialog
> | null>(null);
const isDeleting = ref(false);

function handleDeleteClick(row: Row<any>) {
  deleteDialogRef.value?.handleDeleteBuilding(
    {
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
    },
    row.original,
  );
}

async function confirmDeleteTask(task: Partial<Task>) {
  isDeleting.value = true;
  try {
    await deleteTask(task.id!);
    toast.add({ title: "Task deleted successfully", color: "success" });
    deleteDialogRef.value?.handleCloseDialog();
    await refresh();
  } catch (err) {
    toast.add({ title: "Failed to delete task", color: "error" });
  } finally {
    isDeleting.value = false;
  }
}

const columns: TableColumn<Partial<Task>>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "ID",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up"
            : "i-lucide-arrow-down"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(isSorted === "asc"),
      });
    },
    meta: {
      class: {
        th: "text-center font-semibold",
        td: "text-center font-mono",
      },
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
    cell: ({ row }) => {
      const color = {
        done: "success" as const,
        pending: "warning" as const,
        in_progress: "neutral" as const,
      }[row.getValue("status") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("status"),
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    meta: {
      class: {
        th: "text-center",
        td: "text-center",
      },
    },
    cell: ({ row }) => {
      const color = {
        low: "success" as const,
        medium: "warning" as const,
        high: "error" as const,
      }[row.getValue("priority") as string];

      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("priority"),
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    meta: {
      class: {
        th: "text-left",
        td: "text-left",
      },
    },
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: "end",
          },
          items: getRowItems(row),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

function getRowItems(row: Row<any>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      type: "separator",
    },
    {
      label: "View",
      onSelect: () => router.push(`/tasks/${(row.original as Task).id}`),
    },
    {
      label: "Edit",
      onSelect: () => taskFormRef.value?.handleOpenEdit(row.original as Task),
    },
    {
      label: "Delete",
      color: "error",
      onSelect: () => handleDeleteClick(row),
    },
  ];
}
</script>

<style scoped></style>
