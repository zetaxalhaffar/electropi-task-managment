export function createApiClient() {
  // * Config
  const config = useRuntimeConfig();
  const apiDelay = Number(config.public.apiDelay) || 0;
  // ! Request/Response Interceptors

  return $fetch.create({
    baseURL: config.public.apiBase,
    async onRequest({ options }) {
      // Simulates real-world backend latency against the json-server mock API
      if (apiDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, apiDelay));
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // clear session, redirect to login, etc.
      }
    },
  });
}
