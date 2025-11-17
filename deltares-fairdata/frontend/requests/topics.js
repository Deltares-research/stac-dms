/**
 * Topics API requests
 */
import { useNuxtApp } from '#app'

/**
 * Fetch topics with their counts
 * @returns {Promise<Object>} Object containing topics array with id and count
 */
export async function fetchTopics() {
  const { $api } = useNuxtApp()
  
  try {
    const result = await $api('/topics', {
      credentials: 'include',
    })
    
    return result || { topics: [] }
  } catch (error) {
    console.error('Error loading topics:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}
