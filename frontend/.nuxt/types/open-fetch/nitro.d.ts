import type { OpenFetchClient } from '#imports'
import type { paths as ApiPaths } from '#open-fetch-schemas/api'

declare module 'nitropack' {
  interface NitroApp {
    $api: OpenFetchClient<ApiPaths>
  }
}

export {}
