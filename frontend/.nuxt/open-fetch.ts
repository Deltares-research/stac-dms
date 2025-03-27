import { createUseOpenFetch } from '#imports'
import type { paths as ApiPaths } from '#open-fetch-schemas/api'

export type OpenFetchClientName = 'api'

/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/useclient}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const useApi = createUseOpenFetch<ApiPaths>('api')
/**
 * Fetch data from an OpenAPI endpoint with an SSR-friendly composable.
 * See {@link https://nuxt-open-fetch.vercel.app/composables/uselazyclient}
 * @param string The OpenAPI path to fetch
 * @param opts extends useFetch, $fetch options and useAsyncData options
 */
export const useLazyApi = createUseOpenFetch<ApiPaths>('api', true)
