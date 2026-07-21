import { useTaskApi } from "~/composables/tasks/useTaskApi";
import type { TaskPayload } from "~/types/tasks";

export const useTaskStore = defineStore("tasks", () => {
  // * Config
  const taskApi = useTaskApi();

  const tasksList = async (params: any) => {
    const response = await taskApi.tasksList(params);
    return response;
  };

  const getTask = async (id: string) => {
    const response = await taskApi.getTask(id);
    return response;
  };

  const creaetTask = async (payload: TaskPayload) => {
    const response = await taskApi.createTask(payload);
    return response;
  };

  const updateTask = async (id: string, payload: Partial<TaskPayload>) => {
    const response = await taskApi.updateTask(id, payload);
    return response;
  };

  const deleteTask = async (id: string) => {
    const response = await taskApi.deleteTask(id);
    return response;
  };
  return {
    tasksList,
    getTask,
    deleteTask,
    creaetTask,
    updateTask,
  };
});
