import { createApiClient } from "~/services/apiClient";

export function useApiLayer() {
  return createApiClient();
}
