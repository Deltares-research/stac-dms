/**
 * Content API requests
 */
import { useRequestHeaders } from '#app'

/**
 * Fetch markdown content
 * @param {string} path - Path to the markdown file (e.g., 'stars4water/about.md')
 * @returns {Promise<string>} Markdown content as text
 */
export async function fetchMarkdownContent(path) {
  const headers = process.server ? useRequestHeaders() : {}
  
  try {
    // For local server routes, we use fetch directly since they're not in the open-fetch schema
    // Use /content/ instead of /api/content/ to avoid proxy conflicts
    const response = await fetch(`/content/${ path }`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'text/plain',
        ...headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${ response.statusText }`)
    }
    
    const content = await response.text()
    return content
  } catch (error) {
    console.error('Failed to fetch markdown content:', error?.message || error?.toString() || 'Unknown error')
    throw error
  }
}
