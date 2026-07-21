<template>
  <UDialog
    :dialog="open"
    @update:model-value="open = $event"
    :has-actions="true"
    :form-title="isEditMode ? 'Edit Task' : 'Create Task'"
    has-close
    max-width="500"
    :loading="isSubmitting"
  >
    <template #content>
      <UForm
        ref="formRef"
        :state="state"
        :validate="validate"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title" required>
          <UInput v-model="state.title" placeholder="Task title" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Task description"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Status" name="status">
            <USelect v-model="state.status" :items="statusOptions" class="w-full" />
          </UFormField>

          <UFormField label="Priority" name="priority">
            <USelect v-model="state.priority" :items="priorityOptions" class="w-full" />
          </UFormField>
        </div>

        <UFormField label="Due Date" name="dueDate">
          <UInput v-model="state.dueDate" type="date" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #actions>
      <div class="w-full flex gap-2 flex-col">
        <UButton
          :disabled="isSubmitting"
          color="neutral"
          variant="outline"
          block
          @click="handleClose"
        >
          Cancel
        </UButton>
        <UButton
          :loading="isSubmitting"
          :disabled="isSubmitting"
          color="primary"
          variant="solid"
          block
          @click="formRef?.submit()"
        >
          {{ isEditMode ? "Save" : "Create" }}
        </UButton>
      </div>
    </template>
  </UDialog>
</template>

<script lang="ts" setup>
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import UDialog from "~/components/shared/UDialog.vue";
import { useTaskStore } from "~/stores/tasks";
import type { Task, TaskPayload } from "~/types/tasks";

const open = defineModel<boolean>({ default: false });

const toast = useToast();
const taskStore = useTaskStore();
const { creaetTask, updateTask } = taskStore;

const formRef = useTemplateRef("formRef");
const isSubmitting = ref(false);
const editingId = ref<string | null>(null);
const isEditMode = computed(() => !!editingId.value);

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];
const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

function emptyState(): Partial<TaskPayload> {
  return {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  };
}

const state = reactive<Partial<TaskPayload>>(emptyState());

function validate(payload: Partial<TaskPayload>): FormError[] {
  const errors: FormError[] = [];

  if (!payload.title) {
    errors.push({ name: "title", message: "Title is required" });
  }

  if (payload.dueDate) {
    const dueDate = new Date(payload.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      errors.push({ name: "dueDate", message: "Due date must be in the future" });
    }
  }

  return errors;
}

async function onSubmit(event: FormSubmitEvent<Partial<TaskPayload>>) {
  isSubmitting.value = true;
  try {
    if (isEditMode.value && editingId.value) {
      await updateTask(editingId.value, event.data);
      toast.add({ title: "Task updated successfully", color: "success" });
      await refreshNuxtData(`task-details-${editingId.value}`);
    } else {
      await creaetTask(event.data as TaskPayload);
      toast.add({ title: "Task created successfully", color: "success" });
    }
    await refreshNuxtData("tasks-list");
    handleClose();
  } catch (err) {
    toast.add({ title: "Failed to save task", color: "error" });
  } finally {
    isSubmitting.value = false;
  }
}

function handleOpenCreate() {
  editingId.value = null;
  Object.assign(state, emptyState());
  open.value = true;
}

function handleOpenEdit(task: Task) {
  editingId.value = task.id;
  Object.assign(state, {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  });
  open.value = true;
}

function handleClose() {
  open.value = false;
}

defineExpose({
  handleOpenCreate,
  handleOpenEdit,
});
</script>

<style scoped></style>
