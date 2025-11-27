/**
 * Groups API requests
 * Centralized functions for all group-related API calls
 */
import { useNuxtApp, useRequestHeaders } from '#app'

/**
 * Fetch all groups
 * @returns {Promise<Array>} Groups array
 */
export async function fetchGroups() {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const data = await $api('/groups', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return data || []
  } catch (error) {
    console.error('Failed to fetch groups:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch a single group by ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Group data
 */
export async function fetchGroupById(groupId) {
  const { $api } = useNuxtApp()
  
  try {
    const group = await $api('/groups/{group_id}', {
      path: {
        group_id: groupId,
      },
      credentials: 'include',
    })
    
    return group
  } catch (error) {
    console.error('Failed to fetch group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Create a new group
 * @param {Object} groupData - Group data to create {name, description}
 * @returns {Promise<Object>} Created group
 */
export async function createGroup(groupData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/groups', {
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
    console.error('Failed to create group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Update an existing group
 * @param {string} groupId - Group ID
 * @param {Object} groupData - Updated group data {name, description}
 * @returns {Promise<Object>} Updated group
 */
export async function updateGroup(groupId, groupData) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const result = await $api('/groups/{group_id}', {
      method: 'PUT',
      body: groupData,
      path: {
        group_id: groupId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return result
  } catch (error) {
    console.error('Failed to update group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Delete a group
 * @param {string} groupId - Group ID
 * @returns {Promise<void>}
 */
export async function deleteGroup(groupId) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/groups/{group_id}', {
      method: 'DELETE',
      path: {
        group_id: groupId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to delete group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Add users to a group
 * @param {string} groupId - Group ID
 * @param {Array<string>} emails - Array of user emails
 * @returns {Promise<void>}
 */
export async function addUsersToGroup(groupId, emails) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/groups/{group_id}/members', {
      method: 'POST',
      body: emails,
      path: {
        group_id: groupId,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to add users to group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Remove a user from a group
 * @param {string} groupId - Group ID
 * @param {string} userEmail - User email
 * @returns {Promise<void>}
 */
export async function removeUserFromGroup(groupId, userEmail) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/groups/{group_id}/members', {
      method: 'DELETE',
      query: {
        user_email: userEmail,
      },
      path: {
        group_id: groupId,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to remove user from group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Add a role to a group
 * @param {string} groupId - Group ID
 * @param {string} role - Role name (admin, keyword_editor, application_data_steward)
 * @returns {Promise<void>}
 */
export async function addRoleToGroup(groupId, role) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/group-role', {
      method: 'POST',
      body: {
        group_id: groupId,
        role: role,
      },
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to add role to group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Remove a role from a group
 * @param {string} groupId - Group ID
 * @param {string} role - Role name
 * @returns {Promise<void>}
 */
export async function removeRoleFromGroup(groupId, role) {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    await $api('/group-role', {
      method: 'DELETE',
      query: {
        group_id: groupId,
        role: role,
      },
      credentials: 'include',
      headers: {
        ...headers,
      },
    })
  } catch (error) {
    console.error('Failed to remove role from group:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

/**
 * Fetch all users
 * @returns {Promise<Array>} Users array
 */
export async function fetchUsers() {
  const { $api } = useNuxtApp()
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    const users = await $api('/users', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })
    
    return users || []
  } catch (error) {
    console.error('Failed to fetch users:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}

