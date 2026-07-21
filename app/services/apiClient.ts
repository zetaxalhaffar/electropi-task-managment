export function createApiClient() {
  // * Config
  const config = useRuntimeConfig();
  // ! Request/Response Interceptors

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      // Logic Here
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        // clear session, redirect to login, etc.
      }
    },
  });
}
