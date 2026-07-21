import debounceDirective from "~/directives/VDebounce";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("debounce", debounceDirective);
});
