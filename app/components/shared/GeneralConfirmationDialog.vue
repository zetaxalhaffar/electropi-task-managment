<template>
  <div>
    <UDialog
      v-model:dialog="generalDetailsDeleteDialog"
      @update:modelValue="generalDetailsDeleteDialog = $event"
      :has-actions="true"
      :form-title="translateOrText(deleteTitle)"
      has-close
      :max-width="options?.maxWidth ?? '300'"
    >
      <template #content>
        <div>
          <div>
            {{ translateOrText(deleteMessage) }}
          </div>
          <div class="mt-4">
            <slot name="alert"></slot>
          </div>
        </div>
      </template>
      <template #actions>
        <div class="w-full flex gap-2 flex-col">
          <UTooltip :text="'cancel'">
            <UButton
              :disabled="isDeletingBuilding"
              color="error"
              variant="outline"
              block
              @click="generalDetailsDeleteDialog = false"
            >
              {{ "cancel" }}
            </UButton>
          </UTooltip>
          <UTooltip :text="translateOrText(buttonText)">
            <UButton
              :loading="isDeletingBuilding"
              :disabled="isDeletingBuilding"
              color="primary"
              variant="solid"
              block
              @click="deleteBuildingMutation(deleteData)"
            >
              {{ translateOrText(buttonText) }}
            </UButton>
          </UTooltip>
        </div>
      </template>
    </UDialog>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import UDialog from "./UDialog.vue";

const translateOrText = (value: string) => value;
interface Options {
  maxWidth?: string;
}
// props
interface Props {
  isDeletingBuilding: boolean;
  deleteBuildingMutation: any;
  buttonText?: string;
  options?: Options;
}
const props = withDefaults(defineProps<Props>(), {
  isDeletingBuilding: false,
  deleteBuildingMutation: () => {},
  buttonText: "confirm",
});
// delete dialog
const generalDetailsDeleteDialog = ref(false);
const deleteTitle = ref<string>("Delete");
const deleteMessage = ref<string>("Are you sure you want to delete this?");
const deleteData = ref<any>(null);
// delete building
const handleDeleteBuilding = (data: any, payload: any) => {
  generalDetailsDeleteDialog.value = true;
  deleteTitle.value = data.title;
  deleteMessage.value = data.message;
  deleteData.value = payload;
};
const handleCloseDialog = () => {
  generalDetailsDeleteDialog.value = false;
};
defineExpose({
  handleDeleteBuilding,
  handleCloseDialog,
});
</script>
<style></style>
