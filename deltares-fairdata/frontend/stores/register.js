import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNuxtApp, useRequestHeaders } from '#app'
import searchBody from '@/utils/search/searchBody.js'

export const useRegisterStore = defineStore('register', () => {
  // State
  const items = ref([])
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const nextToken = ref(null)
  const prevToken = ref(null)
  const tokenHistory = ref([]) // Stack of tokens for back navigation
  const totalMatched = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const totalPages = computed(() => {
    if (totalMatched.value === 0) return 1
    return Math.ceil(totalMatched.value / itemsPerPage.value)
  })

  const hasNextPage = computed(() => {
    return nextToken.value !== null || currentPage.value < totalPages.value
  })

  const hasPreviousPage = computed(() => {
    return prevToken.value !== null || currentPage.value > 1
  })

  // Actions
  async function fetchItems(token = null) {
    isLoading.value = true
    error.value = null

    try {
      const { $api } = useNuxtApp()
      
      // For SSR, we need to forward request headers to include cookies
      const headers = process.server ? useRequestHeaders() : {}

      // Build request body - use searchBody with empty filters to get all items
      const body = {
        ...searchBody({}), // Empty filters to get all items
        limit: itemsPerPage.value,
      }

      // Add token if provided (for pagination)
      if (token) {
        body.token = token
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
        onRequest({ options }) {
          console.log('[register:onRequest]', options)
        },
        onResponse({ response }) {
          console.log('[register:onResponse]', response.status, response.statusText)
          console.log('[register:data]', response?._data)
        },
        onResponseError({ response }) {
          console.warn('[register:onResponseError]', response?.status, response?._data)
        },
      })

      // Handle response structure
      if (data && data.features) {
        items.value = data.features || []
        totalMatched.value = data.numberMatched || 0

        // Extract pagination tokens from links
        const links = data.links || []
        nextToken.value = null
        prevToken.value = null

        links.forEach(link => {
          if (link.rel === 'next' && link.token) {
            nextToken.value = link.token
          }
          if (link.rel === 'prev' && link.token) {
            prevToken.value = link.token
          }
        })

        // Update current page based on token history
        if (token) {
          // We're navigating with a token, update page based on history
          const tokenIndex = tokenHistory.value.indexOf(token)
          if (tokenIndex >= 0) {
            currentPage.value = tokenIndex + 2 // +2 because page 1 has no token
          }
        } else {
          // First page, reset history
          tokenHistory.value = []
          currentPage.value = 1
        }
      } else {
        items.value = []
        totalMatched.value = 0
        nextToken.value = null
        prevToken.value = null
      }

      return true

    } catch (err) {
      console.error('Failed to fetch items:', err?.message || err?.toString() || 'Unknown error')
      error.value = err?.message || 'Failed to fetch items'
      items.value = []
      totalMatched.value = 0
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function nextPage() {
    if (!hasNextPage.value) return false

    if (nextToken.value) {
      // Use token-based pagination
      tokenHistory.value.push(nextToken.value)
      return await fetchItems(nextToken.value)
    } else {
      // Fallback: calculate next page
      const nextPageNum = currentPage.value + 1
      if (nextPageNum <= totalPages.value) {
        // For token-based pagination, we need to fetch previous pages to get the token
        // This is a limitation - we'll use token-based navigation
        return false
      }
    }
    return false
  }

  async function previousPage() {
    if (!hasPreviousPage.value) return false

    if (tokenHistory.value.length > 0) {
      // Pop the last token from history and fetch previous page
      tokenHistory.value.pop()
      const prevTokenToUse = tokenHistory.value.length > 0 
        ? tokenHistory.value[tokenHistory.value.length - 1]
        : null
      return await fetchItems(prevTokenToUse)
    } else if (currentPage.value > 1) {
      // Go back to first page
      tokenHistory.value = []
      return await fetchItems(null)
    }
    return false
  }

  async function goToPage(page) {
    if (page < 1 || page > totalPages.value) return false
    if (page === currentPage.value) return true

    // For token-based pagination, we can only go forward/backward sequentially
    // Reset and fetch from beginning if needed
    if (page === 1) {
      tokenHistory.value = []
      currentPage.value = 1
      return await fetchItems(null)
    }

    // For pages > 1, we need to navigate sequentially
    // This is a limitation of token-based pagination
    // For now, we'll just fetch the first page and let user navigate
    if (page < currentPage.value) {
      // Go back to first page and navigate forward
      tokenHistory.value = []
      currentPage.value = 1
      await fetchItems(null)
      // Then navigate forward (this is not ideal but token pagination doesn't support direct page access)
      for (let i = 1; i < page && hasNextPage.value; i++) {
        await nextPage()
      }
      return true
    } else {
      // Navigate forward from current page
      while (currentPage.value < page && hasNextPage.value) {
        await nextPage()
      }
      return true
    }
  }

  function setItemsPerPage(value) {
    itemsPerPage.value = value
    // Reset to first page when changing items per page
    tokenHistory.value = []
    currentPage.value = 1
    fetchItems(null)
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    items,
    currentPage,
    itemsPerPage,
    nextToken,
    prevToken,
    totalMatched,
    isLoading,
    error,
    
    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    
    // Actions
    fetchItems,
    nextPage,
    previousPage,
    goToPage,
    setItemsPerPage,
    clearError,
  }
})

