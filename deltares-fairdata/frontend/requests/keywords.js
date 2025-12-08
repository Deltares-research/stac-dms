/**
 * Keywords API requests
 */
import { useNuxtApp, useRequestHeaders } from '#app'

/**
 * Fetch all facilities (domains)
 * @returns {Promise<Array>} Facilities array
 */
export async function fetchFacilities() {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const data = await $api('/facilities', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data || []
  } catch (error) {
    console.error('Error loading facilities:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch a single facility by ID
 * @param {string} facilityId - Facility ID
 * @returns {Promise<Object>} Facility data
 */
export async function fetchFacilityById(facilityId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const data = await $api('/facility/{facility_id}', {
      path: {
        facility_id: facilityId,
      },
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data
  } catch (error) {
    console.error('Error loading facility:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Create a new facility (domain)
 * @param {Object} facilityData - Facility data {name}
 * @returns {Promise<Object>} Created facility
 */
export async function createFacility(facilityData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/facility', {
      method: 'POST',
      body: facilityData,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error creating facility:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Update a facility
 * @param {string} facilityId - Facility ID
 * @param {Object} facilityData - Updated facility data {name}
 * @returns {Promise<Object>} Updated facility
 */
export async function updateFacility(facilityId, facilityData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/facility/{facility_id}', {
      method: 'PUT',
      body: facilityData,
      path: {
        facility_id: facilityId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error updating facility:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Delete a facility
 * @param {string} facilityId - Facility ID
 * @returns {Promise<void>}
 */
export async function deleteFacility(facilityId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/facility/{facility_id}', {
      method: 'DELETE',
      path: {
        facility_id: facilityId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Error deleting facility:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch all keyword groups
 * @returns {Promise<Array>} Keyword groups array
 */
export async function fetchKeywordGroups() {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const data = await $api('/keywordgroups', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data || []
  } catch (error) {
    console.error('Error loading keyword groups:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Create a keyword group
 * @param {Object} groupData - Group data {group_name_nl, group_name_en, facility_type}
 * @returns {Promise<Object>} Created keyword group
 */
export async function createKeywordGroup(groupData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/keywordgroup', {
      method: 'POST',
      body: groupData,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error creating keyword group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Update a keyword group
 * @param {string} groupId - Keyword group ID
 * @param {Object} groupData - Updated group data {group_name_nl, facility_type}
 * @returns {Promise<Object>} Updated keyword group
 */
export async function updateKeywordGroup(groupId, groupData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/keywordgroup/{keywordgroup_id}', {
      method: 'PUT',
      body: groupData,
      path: {
        keywordgroup_id: groupId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error updating keyword group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Delete a keyword group
 * @param {string} groupId - Keyword group ID
 * @returns {Promise<void>}
 */
export async function deleteKeywordGroup(groupId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/keywordgroup/{keywordgroup_id}', {
      method: 'DELETE',
      path: {
        keywordgroup_id: groupId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Error deleting keyword group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch keywords by facility ID
 * @param {string} facilityId - Facility ID
 * @returns {Promise<Array>} Keywords groups array
 */
export async function fetchKeywordsByFacilityId(facilityId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const keywordsResult = await $api('/keywords', {
      query: {
        facility_id: facilityId,
      },
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return keywordsResult || []
  } catch (error) {
    console.error('Error loading keywords:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch keywords by keyword group ID
 * @param {string} groupId - Keyword group ID
 * @returns {Promise<Array>} Keywords array (first item contains the group with keywords)
 */
export async function fetchKeywordsByGroupId(groupId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const keywordsResult = await $api('/keywords', {
      query: {
        keyword_group_id: groupId,
      },
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return keywordsResult || []
  } catch (error) {
    console.error('Error loading keywords:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Create a keyword
 * @param {Object} keywordData - Keyword data {nl_keyword, en_keyword, external_id?, group_id}
 * @returns {Promise<Object>} Created keyword
 */
export async function createKeyword(keywordData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/keyword', {
      method: 'POST',
      body: keywordData,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error creating keyword:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Update a keyword
 * @param {string} keywordId - Keyword ID
 * @param {Object} keywordData - Updated keyword data {nl_keyword}
 * @returns {Promise<Object>} Updated keyword
 */
export async function updateKeyword(keywordId, keywordData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/keyword/{keyword_id}', {
      method: 'PUT',
      body: keywordData,
      path: {
        keyword_id: keywordId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error updating keyword:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Delete a keyword
 * @param {string} keywordId - Keyword ID
 * @returns {Promise<void>}
 */
export async function deleteKeyword(keywordId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/keyword/{keyword_id}', {
      method: 'DELETE',
      path: {
        keyword_id: keywordId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Error deleting keyword:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Link a keyword group to a facility
 * @param {Object} linkData - Link data {facility_id, keyword_group_id}
 * @returns {Promise<Object>} Created link
 */
export async function linkKeywordGroupToFacility(linkData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/facility_keywordgroup_link', {
      method: 'POST',
      body: linkData,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Error linking keyword group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Unlink a keyword group from a facility
 * @param {Object} linkData - Link data {facility_id, keyword_group_id}
 * @returns {Promise<void>}
 */
export async function unlinkKeywordGroupFromFacility(linkData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/facility_keywordgroup_link', {
      method: 'DELETE',
      body: linkData,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  } catch (error) {
    console.error('Error unlinking keyword group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

