/**
 * Collections API requests
 * Centralized functions for all collection-related API calls
 */
import { useNuxtApp, useRequestHeaders } from '#app'

/**
 * Fetch all collections
 * @param {Object} options - Optional parameters
 * @param {number} options.limit - Limit number of results
 * @param {boolean} options.includeHeaders - Include SSR headers (default: true)
 * @returns {Promise<Object>} Collections data
 */
export async function fetchCollections(options = {}) {
  const { limit, includeHeaders = true } = options
  const { $api } = useNuxtApp()
  const headers = includeHeaders && process.server ? useRequestHeaders() : {}
  
  try {
    const data = await $api('/collections', {
      query: limit ? { limit } : {},
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data
  } catch (error) {
    console.error('Failed to fetch collections:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch a single collection by ID
 * @param {string} collectionId - Collection ID
 * @returns {Promise<Object>} Collection data
 */
export async function fetchCollectionById(collectionId) {
  const { $api } = useNuxtApp()
  
  try {
    const collection = await $api('/collections/{collection_id}', {
      path: {
        collection_id: collectionId,
      },
      credentials: 'include',
    })
    
    return collection
  } catch (error) {
    console.error('Failed to fetch collection:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch collection permissions
 * @param {boolean} includeHeaders - Include SSR headers (default: true)
 * @returns {Promise<Array>} Collection permissions array
 */
export async function fetchCollectionPermissions(includeHeaders = true) {
  const { $api } = useNuxtApp()
  const headers = includeHeaders && process.server ? useRequestHeaders() : {}
  
  try {
    const permissions = await $api('/collection-permissions', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return permissions || []
  } catch (error) {
    console.error('Failed to fetch collection permissions:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch collections with permissions filtered by item:create permission
 * @param {Object} options - Optional parameters
 * @returns {Promise<Object>} Object with filtered collections and permissions
 */
export async function fetchCollectionsWithCreatePermission(options = {}) {
  try {
    const [ collectionsData, permissionsData ] = await Promise.all([
      fetchCollections(options),
      fetchCollectionPermissions(options.includeHeaders),
    ])

    const allCollections = collectionsData?.collections || []
    const permissions = permissionsData || []

    // Filter collections by item:create permission
    const filteredCollections = allCollections.filter(collection => {
      return permissions.some(permission =>
        permission.collection_id === collection.id &&
        permission.permissions?.includes('item:create'),
      )
    })

    return {
      collections: filteredCollections,
      permissions,
    }
  } catch (error) {
    console.error('Failed to fetch collections with permissions:', error)
    throw error
  }
}

