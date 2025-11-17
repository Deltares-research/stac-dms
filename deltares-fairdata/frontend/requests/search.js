/**
 * Search API requests
 */
import { useNuxtApp, useRequestHeaders } from '#app'
import searchBody from '@/utils/search/searchBody.js'

/**
 * Search for items
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.q - Query string
 * @param {Date|string} searchParams.startDate - Start date
 * @param {Date|string} searchParams.endDate - End date
 * @param {Array} searchParams.keywords - Keywords array
 * @param {Array} searchParams.collections - Collection IDs array
 * @param {boolean} searchParams.includeEmptyGeometry - Include empty geometry
 * @param {Array} searchParams.bbox - Bounding box
 * @param {number} searchParams.limit - Result limit
 * @param {string} searchParams.token - Pagination token
 * @returns {Promise<Object>} Search results
 */
export async function searchItems(searchParams = {}) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const body = {
      ...searchBody({
        q: searchParams.q || '',
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        keywords: searchParams.keywords || [],
        collections: searchParams.collections || [],
        includeEmptyGeometry: searchParams.includeEmptyGeometry || false,
        bbox: searchParams.bbox,
      }),
      limit: searchParams.limit || 1000,
    }

    if (searchParams.token) {
      body.token = searchParams.token
    }

    const data = await $api('/search', {
      method: 'POST',
      body,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data
  } catch (error) {
    console.error('Search failed:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

