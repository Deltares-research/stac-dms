/**
 * Keywords API requests
 */
import { useNuxtApp } from '#app'

/**
 * Fetch keywords by facility ID
 * @param {string} facilityId - Facility ID
 * @returns {Promise<Array>} Keywords groups array
 */
export async function fetchKeywordsByFacilityId(facilityId) {
  const { $api } = useNuxtApp()
  
  try {
    const keywordsResult = await $api('/keywords', {
      query: {
        facility_id: facilityId,
      },
      credentials: 'include',
    })
    
    return keywordsResult || []
  } catch (error) {
    console.error('Error loading keywords:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

