import { BASE_TASK_ENDPOINT } from "~/constant/apis/tasks";
import type { Task, TaskPayload } from "~/types/tasks";

export function useTaskApi() {
  const api = useApiLayer();

  return {
    tasksList: (query: any) =>
      api<Task[]>(BASE_TASK_ENDPOINT, {
        query,
      }),
    getTask: (id: string) => api<Task>(`${BASE_TASK_ENDPOINT}/${id}`),
    createTask: (payload: TaskPayload) =>
      api<void>(BASE_TASK_ENDPOINT, {
        method: "POST",
        body: payload,
      }),
    updateTask: (id: string, payload: Partial<TaskPayload>) =>
      api<void>(`${BASE_TASK_ENDPOINT}/${id}`, {
        method: "PATCH",
        body: payload,
      }),
    deleteTask: (id: string) =>
      api<void>(`${BASE_TASK_ENDPOINT}/${id}`, {
        method: "DELETE",
      }),
  };
}
