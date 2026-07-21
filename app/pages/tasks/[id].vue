<template>
  <TaskFromManager ref="taskFormRef" />
  <GeneralConfirmationDialog
    ref="deleteDialogRef"
    :is-deleting-building="isDeleting"
    :delete-building-mutation="confirmDeleteTask"
  />
  <UContainer>
    <AppPageToolbar :title="task?.title ?? 'Task Details'">
      <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        @click="router.push('/tasks')"
      >
        Back
      </UButton>
      <UButton
        v-if="task"
        icon="i-lucide-pencil"
        color="neutral"
        variant="outline"
        @click="taskFormRef?.handleOpenEdit(task)"
      >
        Edit
      </UButton>
      <UButton
        v-if="task"
        icon="i-lucide-trash-2"
        color="error"
        variant="outline"
        @click="handleDeleteClick"
      >
        Delete
      </UButton>
    </AppPageToolbar>

    <div v-if="status === 'pending'" class="mt-4 flex justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin size-8" />
    </div>

    <div v-else-if="error" class="mt-4">
      <UAlert
        color="error"
        variant="subtle"
        title="Failed to load task"
        :description="error.message"
      />
    </div>

    <div v-else-if="task" class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2 flex flex-col gap-4">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-semibold text-lg">Overview</h2>
              <div class="flex items-center gap-2">
                <UBadge class="capitalize" variant="subtle" :color="statusColor">
                  {{ task.status }}
                </UBadge>
                <UBadge class="capitalize" variant="subtle" :color="priorityColor">
                  {{ task.priority }} priority
                </UBadge>
              </div>
            </div>
          </template>

          <p class="text-muted whitespace-pre-line">
            {{ task.description || "No description provided." }}
          </p>

          <USeparator class="my-4" />

          <div>
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium">Progress</span>
              <span class="text-muted">{{ task.progress ?? 0 }}%</span>
            </div>
            <UProgress :model-value="task.progress ?? 0" />
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-lg">Details</h2>
          </template>
          <p class="text-muted whitespace-pre-line">
            {{ task.details || "No additional details." }}
          </p>
        </UCard>

        <UCard v-if="task.acceptanceCriteria?.length">
          <template #header>
            <h2 class="font-semibold text-lg">Acceptance Criteria</h2>
          </template>
          <ul class="list-disc list-inside flex flex-col gap-1">
            <li v-for="(criteria, index) in task.acceptanceCriteria" :key="index">
              {{ criteria }}
            </li>
          </ul>
        </UCard>

        <UCard v-if="task.attachments?.length">
          <template #header>
            <h2 class="font-semibold text-lg">Attachments</h2>
          </template>
          <div class="flex flex-col gap-2">
            <NuxtLink
              v-for="attachment in task.attachments"
              :key="attachment.id"
              :to="attachment.url"
              target="_blank"
              class="flex items-center gap-2 text-primary hover:underline"
            >
              <UIcon name="i-lucide-paperclip" />
              {{ attachment.name }}
            </NuxtLink>
          </div>
        </UCard>
      </div>

      <div class="flex flex-col gap-4">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-lg">Info</h2>
          </template>
          <div class="flex flex-col gap-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-muted">Category</span>
              <span class="capitalize">{{ task.category || "-" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Due Date</span>
              <span>{{ task.dueDate || "-" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Estimated Hours</span>
              <span>{{ task.estimatedHours ?? "-" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Completed Hours</span>
              <span>{{ task.completedHours ?? "-" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Comments</span>
              <span>{{ task.commentsCount ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Created At</span>
              <span>{{ task.createdAt || "-" }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted">Updated At</span>
              <span>{{ task.updatedAt || "-" }}</span>
            </div>
            <div v-if="task.completedAt" class="flex items-center justify-between">
              <span class="text-muted">Completed At</span>
              <span>{{ task.completedAt }}</span>
            </div>
          </div>
        </UCard>

        <UCard v-if="task.assignee">
          <template #header>
            <h2 class="font-semibold text-lg">Assignee</h2>
          </template>
          <div class="flex items-center gap-3">
            <UAvatar :src="task.assignee.avatar" :alt="task.assignee.name" />
            <div>
              <div class="font-medium">{{ task.assignee.name }}</div>
              <div class="text-muted text-sm">{{ task.assignee.email }}</div>
            </div>
          </div>
        </UCard>

        <UCard v-if="task.tags?.length">
          <template #header>
            <h2 class="font-semibold text-lg">Tags</h2>
          </template>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in task.tags" :key="tag" variant="subtle" color="neutral">
              {{ tag }}
            </UBadge>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import AppPageToolbar from "~/components/shared/AppPageToolbar.vue";
import GeneralConfirmationDialog from "~/components/shared/GeneralConfirmationDialog.vue";
import TaskFromManager from "~/components/tasks/TaskFromManager.vue";
import { useTaskStore } from "~/stores/tasks";
import type { Task } from "~/types/tasks";

// SECTION: Config
const route = useRoute();
const router = useRouter();
const toast = useToast();
const taskId = route.params.id as string;

// SECTION: Stores
const taskStore = useTaskStore();
const { getTask, deleteTask } = taskStore;

const { status, error, data } = await useAsyncData(
  `task-details-${taskId}`,
  () => getTask(taskId),
  { lazy: true },
);
const task = computed<Task | null>(() => data.value ?? null);

const statusColor = computed(() => {
  return {
    done: "success" as const,
    pending: "warning" as const,
    in_progress: "neutral" as const,
  }[task.value?.status ?? "pending"];
});

const priorityColor = computed(() => {
  return {
    low: "success" as const,
    medium: "warning" as const,
    high: "error" as const,
  }[task.value?.priority ?? "medium"];
});

// SECTION: Edit task
const taskFormRef = useTemplateRef("taskFormRef");

// SECTION: Delete task
const deleteDialogRef = ref<InstanceType<
  typeof GeneralConfirmationDialog
> | null>(null);
const isDeleting = ref(false);

function handleDeleteClick() {
  deleteDialogRef.value?.handleDeleteBuilding(
    {
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
    },
    task.value,
  );
}

async function confirmDeleteTask(taskToDelete: Task) {
  isDeleting.value = true;
  try {
    await deleteTask(taskToDelete.id);
    toast.add({ title: "Task deleted successfully", color: "success" });
    deleteDialogRef.value?.handleCloseDialog();
    await refreshNuxtData("tasks-list");
    router.push("/tasks");
  } catch (err) {
    toast.add({ title: "Failed to delete task", color: "error" });
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped></style>
