/**
 * Items API requests
 */
import { useNuxtApp, useRequestHeaders } from '#app'
import { useRouter } from 'vue-router'

/**
 * Create a new item in a collection
 * @param {string} collectionId - Collection ID
 * @param {Object} itemData - Item data to create
 * @returns {Promise<Object>} Created item
 */
export async function createItem(collectionId, itemData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/collections/{collection_id}/items', {
      method: 'POST',
      body: itemData,
      path: {
        collection_id: collectionId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Failed to create item:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Update an existing item
 * @param {string} collectionId - Collection ID
 * @param {string} itemId - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} Updated item
 */
export async function updateItem(collectionId, itemId, itemData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/collections/{collection_id}/items/{item_id}', {
      method: 'PUT',
      body: itemData,
      path: {
        collection_id: collectionId,
        item_id: itemId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Failed to update item:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Delete an item
 * @param {string} collectionId - Collection ID
 * @param {string} itemId - Item ID
 * @returns {Promise<void>}
 */
export async function deleteItem(collectionId, itemId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/collections/{collection_id}/items/{item_id}', {
      method: 'DELETE',
      path: {
        collection_id: collectionId,
        item_id: itemId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to delete item:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch a single item by ID using search API
 * @param {string} itemId - Item ID
 * @returns {Promise<Object>} Item data
 */
export async function fetchItemById(itemId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/search', {
      method: 'POST',
      body: {
        ids: [ itemId ],
        limit: 1,
      },
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    if (result?.features && result.features.length > 0) {
      return result.features[0]
    }
    
    throw new Error('Item not found')
  } catch (error) {
    console.error('Failed to fetch item:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

