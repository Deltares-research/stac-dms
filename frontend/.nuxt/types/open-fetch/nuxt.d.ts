import type { OpenFetchClient } from '#imports'
import type { paths as ApiPaths } from '#open-fetch-schemas/api'

declare module '#app' {
  interface NuxtApp {
    $api: OpenFetchClient<ApiPaths>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: OpenFetchClient<ApiPaths>
  }
}

export {}
