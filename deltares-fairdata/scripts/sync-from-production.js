#!/usr/bin/env node

/**
 * Script to sync collections and items from production STAC API to local database.
 * 
 * This script:
 * 1. Fetches all collections from the remote STAC API
 * 2. Fetches all items for each collection (with pagination support)
 * 3. Creates collections in the local API
 * 4. Uploads items to the local API
 * 5. Optionally assigns permissions to a user group
 * 
 * Usage: 
 *   node scripts/sync-from-production.js [LOCAL_API_URL] [REMOTE_API_URL] [LOCAL_DMS_TOKEN] [REMOTE_DMS_TOKEN]
 * 
 * Examples:
 *   # Using defaults (local: http://localhost:8000/api, remote: https://deltares-fairdata.com/api)
 *   node scripts/sync-from-production.js
 * 
 *   # Specify local API only
 *   node scripts/sync-from-production.js http://localhost:8000/api
 * 
 *   # Specify both local and remote APIs
 *   node scripts/sync-from-production.js http://localhost:8000/api https://deltares-fairdata.com/api
 * 
 *   # Specify local API and local token
 *   node scripts/sync-from-production.js http://localhost:8000/api https://deltares-fairdata.com/api your-local-token
 * 
 *   # Specify all parameters including both tokens
 *   node scripts/sync-from-production.js http://localhost:8000/api https://deltares-fairdata.com/api your-local-token your-remote-token
 * 
 * Environment variables (alternative to command-line arguments):
 * - LOCAL_API_URL: Base URL for the local API (default: http://localhost:8000/api)
 * - REMOTE_API_URL: Base URL for the remote STAC API (default: https://deltares-fairdata.com/api)
 * - LOCAL_DMS_TOKEN or DMS_TOKEN: Authentication cookie value for LOCAL API
 *   (required for creating collections/items and role assignment on local API)
 * - REMOTE_DMS_TOKEN: Authentication cookie value for REMOTE API (production)
 *   (required for fetching collections/items from remote API)
 * - LIMIT_ITEMS: Maximum number of items per collection to sync (optional, default: all)
 * - LIMIT_COLLECTIONS: Maximum number of collections to sync (optional, default: all)
 * 
 * IMPORTANT:
 * - Both LOCAL and REMOTE APIs require authentication
 * - LOCAL_DMS_TOKEN: Get from your local browser session (cookie: DMS_TOKEN)
 * - REMOTE_DMS_TOKEN: Get from production browser session (cookie: DMS_TOKEN)
 * - You need to be logged into both environments to get the respective tokens
 * 
 * Windows Command Prompt examples:
 *   set LOCAL_API_URL=http://localhost:8000/api
 *   set REMOTE_API_URL=https://deltares-fairdata.com/api
 *   set DMS_TOKEN=your-token-value
 *   node scripts/sync-from-production.js
 * 
 * PowerShell examples:
 *   $env:LOCAL_API_URL="http://localhost:8000/api"
 *   $env:REMOTE_API_URL="https://deltares-fairdata.com/api"
 *   $env:DMS_TOKEN="your-token-value"
 *   node scripts/sync-from-production.js
 * 
 * Requirements:
 * - Node.js 18+ (for built-in fetch) or install node-fetch
 */

const LOCAL_API_URL = "http://localhost:8000/api"
const REMOTE_API_URL = "https://deltares-fairdata.com/api"
// DMS_TOKEN for LOCAL API authentication
const LOCAL_DMS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0N2NlOTBjLTNhM2ItNDM0Ni1iYTMwLTRhZTdmOGNmZjNjYiIsImVtYWlsIjoiSW9hbm5hLk1pY2hhQGRlbHRhcmVzLm5sIiwiZmlyc3RfbmFtZSI6IklvYW5uYSIsImxhc3RfbmFtZSI6Ik1pY2hhIiwiZGlzcGxheV9uYW1lIjoiSW9hbm5hIE1pY2hhIiwicGljdHVyZSI6bnVsbCwicHJvdmlkZXIiOiJtaWNyb3NvZnQiLCJleHAiOjE3NjUyOTQ3ODcsInN1YiI6ImE0N2NlOTBjLTNhM2ItNDM0Ni1iYTMwLTRhZTdmOGNmZjNjYiJ9.JUkeytql5Tp-MeprFDPz9BWdmIHFRmVHpk72ytuGCIo"
// DMS_TOKEN for REMOTE API authentication (production)
const REMOTE_DMS_TOKEN =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0N2NlOTBjLTNhM2ItNDM0Ni1iYTMwLTRhZTdmOGNmZjNjYiIsImVtYWlsIjoiSW9hbm5hLk1pY2hhQGRlbHRhcmVzLm5sIiwiZmlyc3RfbmFtZSI6IklvYW5uYSIsImxhc3RfbmFtZSI6Ik1pY2hhIiwiZGlzcGxheV9uYW1lIjoiSW9hbm5hIE1pY2hhIiwicGljdHVyZSI6bnVsbCwicHJvdmlkZXIiOiJtaWNyb3NvZnQiLCJleHAiOjE3NjUyODM4NTUsInN1YiI6ImE0N2NlOTBjLTNhM2ItNDM0Ni1iYTMwLTRhZTdmOGNmZjNjYiJ9.J51N-Z0CRmDUQ8TKHMU-7xbVvebVhpU0SXizJj0Sjlg"
const COOKIE_NAME = 'DMS_TOKEN';
const LIMIT_ITEMS = process.env.LIMIT_ITEMS ? parseInt(process.env.LIMIT_ITEMS) : null;
const LIMIT_COLLECTIONS = process.env.LIMIT_COLLECTIONS ? parseInt(process.env.LIMIT_COLLECTIONS) : null;

// Use built-in fetch (Node 18+) or require node-fetch
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error('Error: fetch is not available. Please use Node.js 18+ or install node-fetch: npm install node-fetch');
    process.exit(1);
  }
}

// Helper function to make requests to local API
async function localApiRequest(endpoint, options = {}) {
  const url = `${LOCAL_API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  // Add authentication cookie if provided (for LOCAL API)
  if (LOCAL_DMS_TOKEN) {
    // Set Cookie header for authentication
    headers['Cookie'] = `${COOKIE_NAME}=${LOCAL_DMS_TOKEN}`;
  } else {
    // Warn if authentication is missing for write operations
    if (options.method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method.toUpperCase())) {
      console.warn(`  ⚠ Warning: No LOCAL_DMS_TOKEN provided. This request may fail if authentication is required.`);
    }
  }
  
  const defaultOptions = {
    headers,
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { error: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      // Provide helpful error message for authentication failures
      if (response.status === 401 || response.status === 403) {
        if (!LOCAL_DMS_TOKEN) {
          return { 
            success: false, 
            data, 
            error: `HTTP ${response.status}: Authentication required. Please provide LOCAL_DMS_TOKEN. ${JSON.stringify(data)}`,
            status: response.status 
          };
        } else {
          return { 
            success: false, 
            data, 
            error: `HTTP ${response.status}: Authentication failed. Please check your LOCAL_DMS_TOKEN is valid. ${JSON.stringify(data)}`,
            status: response.status 
          };
        }
      }
      return { 
        success: false, 
        data, 
        error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
        status: response.status 
      };
    }
    
    return { success: true, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message, status: error.status || error.statusCode };
  }
}

// Helper function to make requests to remote API
async function remoteApiRequest(url, options = {}) {
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Node.js STAC Sync Script',
    ...options.headers,
  };
  
  // Add authentication cookie if provided (for REMOTE API)
  if (REMOTE_DMS_TOKEN) {
    headers['Cookie'] = `${COOKIE_NAME}=${REMOTE_DMS_TOKEN}`;
  } else {
    // Warn if authentication is missing
    console.warn(`  ⚠ Warning: No REMOTE_DMS_TOKEN provided. Remote API requests may fail if authentication is required.`);
  }
  
  const defaultOptions = {
    method: options.method || 'GET',
    headers,
    ...options,
  };

  try {
    console.log(`  → Fetching: ${url}`);
    const response = await fetch(url, defaultOptions);
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { error: text || 'Unknown error' };
    }
    
    if (!response.ok) {
      console.error(`  ✗ Request failed: ${response.status} ${response.statusText}`);
      if (response.status === 401 || response.status === 403) {
        if (!REMOTE_DMS_TOKEN) {
          console.error(`  Note: Authentication required. Please provide REMOTE_DMS_TOKEN for remote API access.`);
        } else {
          console.error(`  Note: Authentication failed. Please check your REMOTE_DMS_TOKEN is valid.`);
        }
      }
      return { 
        success: false, 
        data, 
        error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
        status: response.status 
      };
    }
    
    console.log(`  ✓ Success: ${response.status}`);
    return { success: true, data, status: response.status };
  } catch (error) {
    console.error(`  ✗ Network error: ${error.message}`);
    // Provide more details about the error
    if (error.cause) {
      console.error(`  Error cause: ${JSON.stringify(error.cause)}`);
    }
    if (error.code) {
      console.error(`  Error code: ${error.code}`);
    }
    // Check if it's a URL issue
    try {
      new URL(url);
    } catch (urlError) {
      console.error(`  Invalid URL format: ${url}`);
    }
    return { success: false, error: error.message, status: error.status || error.statusCode };
  }
}

// Fetch all collections from remote API
async function fetchRemoteCollections() {
  console.log('Fetching collections from remote API...');
  console.log(`Remote API URL: ${REMOTE_API_URL}`);
  
  // First, try to get the root catalog to understand the API structure
  console.log('\nStep 1: Fetching root catalog...');
  const rootResult = await remoteApiRequest(`${REMOTE_API_URL}/`);
  
  if (rootResult.success) {
    console.log('✓ Root catalog fetched successfully');
    // Check if there are links to collections
    if (rootResult.data.links) {
      const collectionsLink = rootResult.data.links.find(link => link.rel === 'data' || link.rel === 'collections');
      if (collectionsLink) {
        console.log(`Found collections link: ${collectionsLink.href}`);
      }
      const childLinks = rootResult.data.links.filter(link => link.rel === 'child');
      if (childLinks.length > 0) {
        console.log(`Found ${childLinks.length} child collection links in root`);
      }
    }
  } else {
    console.warn(`⚠ Could not fetch root catalog: ${rootResult.error}`);
    console.log('Continuing with direct collections endpoint...');
  }
  
  // Try fetching collections endpoint
  console.log('\nStep 2: Fetching collections endpoint...');
  const result = await remoteApiRequest(`${REMOTE_API_URL}/collections`);
  
  if (!result.success) {
    // If /collections fails, try /collections/ (with trailing slash)
    console.log('Trying with trailing slash...');
    const result2 = await remoteApiRequest(`${REMOTE_API_URL}/collections/`);
    if (result2.success) {
      return processCollectionsResponse(result2.data);
    }
    
    // If still failing, try to get collections from root links
    if (rootResult.success && rootResult.data.links) {
      const childLinks = rootResult.data.links.filter(link => link.rel === 'child');
      if (childLinks.length > 0) {
        console.log(`\nStep 3: Fetching ${childLinks.length} collections from root links...`);
        return await fetchCollectionsFromLinks(childLinks);
      }
    }
    
    throw new Error(`Failed to fetch collections: ${result.error}`);
  }
  
  return processCollectionsResponse(result.data);
}

// Helper to process collections response
function processCollectionsResponse(data) {
  let collections = [];
  if (Array.isArray(data)) {
    collections = data;
  } else if (data.collections && Array.isArray(data.collections)) {
    collections = data.collections;
  } else if (data.links) {
    const childLinks = data.links.filter(link => link.rel === 'child');
    if (childLinks.length > 0) {
      // Return links to fetch individually
      return { links: childLinks, collections: [] };
    }
  }
  console.log(`✓ Found ${collections.length} collection(s) in response`);
  return { collections, links: [] };
}

// Normalize URL - convert http to https and ensure proper encoding
function normalizeUrl(url) {
  if (!url) return url;
  
  // Convert http:// to https://
  let normalized = url.replace(/^http:\/\//i, 'https://');
  
  // Parse the URL to properly encode collection IDs with spaces
  try {
    const urlObj = new URL(normalized);
    // Re-encode the pathname to handle spaces and special characters
    const pathParts = urlObj.pathname.split('/').filter(p => p); // Remove empty parts
    const encodedParts = pathParts.map(part => {
      try {
        // Decode first (in case it's already partially encoded), then re-encode
        const decoded = decodeURIComponent(part);
        return encodeURIComponent(decoded);
      } catch (e) {
        // If decoding fails, just encode as-is
        return encodeURIComponent(part);
      }
    });
    // Reconstruct pathname with leading slash
    urlObj.pathname = '/' + encodedParts.join('/');
    normalized = urlObj.toString();
  } catch (e) {
    // If URL parsing fails, try manual encoding
    console.warn(`  ⚠ Could not parse URL with URL constructor: ${normalized}, trying manual fix`);
    // Manual fix: encode the path part
    const match = normalized.match(/^(https?:\/\/[^\/]+)(\/.*)$/);
    if (match) {
      const [, base, path] = match;
      const encodedPath = path.split('/').map(segment => {
        if (segment) return encodeURIComponent(decodeURIComponent(segment));
        return segment;
      }).join('/');
      normalized = base + encodedPath;
    }
  }
  
  return normalized;
}

// Fetch collections from links
async function fetchCollectionsFromLinks(childLinks) {
  const collections = [];
  console.log(`Fetching ${childLinks.length} collections from links...`);
  
  for (const link of childLinks) {
    // Normalize the URL (http->https and proper encoding)
    const normalizedUrl = normalizeUrl(link.href);
    console.log(`  Fetching: ${normalizedUrl}`);
    
    const collectionResult = await remoteApiRequest(normalizedUrl);
    if (collectionResult.success) {
      collections.push(collectionResult.data);
      console.log(`  ✓ Fetched: ${collectionResult.data.id || collectionResult.data.title || 'unknown'}`);
    } else {
      console.warn(`  ✗ Failed to fetch: ${normalizedUrl} - ${collectionResult.error}`);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`✓ Fetched ${collections.length} collection(s) from links`);
  return { collections, links: [] };
}

// Fetch all items from a collection (with pagination support)
async function fetchCollectionItems(collectionId) {
  console.log(`  Fetching items for collection '${collectionId}'...`);
  const items = [];
  let nextUrl = `${REMOTE_API_URL}/collections/${encodeURIComponent(collectionId)}/items`;
  let itemCount = 0;
  
  while (nextUrl) {
    const result = await remoteApiRequest(nextUrl);
    
    if (!result.success) {
      console.warn(`  ⚠ Failed to fetch items from ${nextUrl}: ${result.error}`);
      break;
    }
    
    // Handle FeatureCollection response
    if (result.data.type === 'FeatureCollection') {
      const features = result.data.features || [];
      items.push(...features);
      itemCount += features.length;
      
      // Check for pagination
      const links = result.data.links || [];
      const nextLink = links.find(link => link.rel === 'next');
      nextUrl = nextLink ? nextLink.href : null;
      
      // Check limit
      if (LIMIT_ITEMS && itemCount >= LIMIT_ITEMS) {
        console.log(`  ⚠ Reached item limit (${LIMIT_ITEMS}), stopping pagination`);
        items.splice(LIMIT_ITEMS);
        break;
      }
    } else if (result.data.type === 'Feature') {
      // Single item response
      items.push(result.data);
      itemCount++;
      nextUrl = null;
    } else {
      // Try to handle as array
      if (Array.isArray(result.data)) {
        items.push(...result.data);
        itemCount += result.data.length;
        nextUrl = null;
      } else {
        console.warn(`  ⚠ Unexpected response format from ${nextUrl}`);
        break;
      }
    }
    
    // Small delay to avoid rate limiting
    if (nextUrl) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`  ✓ Fetched ${items.length} item(s) for collection '${collectionId}'`);
  return items;
}

// Create a collection in local API
async function createLocalCollection(collection) {
  // Clean up the collection data - remove links that point to remote API
  const collectionData = {
    type: collection.type || 'Collection',
    stac_version: collection.stac_version || '1.0.0',
    stac_extensions: collection.stac_extensions || [],
    id: collection.id,
    title: collection.title || collection.id,
    description: collection.description || '',
    keywords: collection.keywords || [],
    license: collection.license || 'proprietary',
    extent: collection.extent || {
      spatial: {
        bbox: [[-180, -90, 180, 90]],
      },
      temporal: {
        interval: [[]],
      },
    },
    links: [], // Clear links as they'll be regenerated by the API
  };

  const result = await localApiRequest('/collections', {
    method: 'POST',
    body: JSON.stringify(collectionData),
  });
  
  if (result.success || result.status === 409) {
    if (result.status === 409) {
      console.log(`  ✓ Collection '${collection.id}' already exists locally`);
    } else {
      console.log(`  ✓ Created collection '${collection.id}'`);
    }
    return true;
  } else {
    console.error(`  ✗ Failed to create collection '${collection.id}': ${result.error}`);
    return false;
  }
}

// Create an item in local API
async function createLocalItem(item, collectionId) {
  // Clean up item data - ensure collection is set correctly
  const itemData = {
    ...item,
    collection: collectionId,
    // Remove links that point to remote API
    links: (item.links || []).filter(link => 
      link.rel !== 'self' && link.rel !== 'collection'
    ),
  };

  const result = await localApiRequest(`/collections/${encodeURIComponent(collectionId)}/items`, {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
  
  if (result.success) {
    return true;
  } else if (result.status === 409) {
    // Item already exists, that's okay
    return true;
  } else {
    console.error(`    ✗ Failed to create item '${item.id}': ${result.error}`);
    return false;
  }
}

// Get or create user group (same as in dummy script)
async function getOrCreateUserGroup(actualUserEmail) {
  console.log('Getting or creating user group...');
  
  const groupsResult = await localApiRequest('/groups');
  if (!groupsResult.success) {
    throw new Error(`Failed to fetch groups: ${groupsResult.error}`);
  }
  
  const groups = groupsResult.data || [];
  
  // Look for a group that contains the user
  for (const group of groups) {
    const membersResult = await localApiRequest(`/groups/${group.id}/members`);
    if (membersResult.success) {
      const members = membersResult.data || [];
      const userInGroup = members.some(member => 
        member.email.toLowerCase() === actualUserEmail.toLowerCase()
      );
      if (userInGroup) {
        console.log(`✓ Found existing group with user: ${group.name} (${group.id})`);
        return group;
      }
    }
  }
  
  // Create new group
  const groupName = `${actualUserEmail.split('@')[0]}-collections`;
  console.log(`Creating new group: ${groupName}...`);
  
  const createResult = await localApiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify({
      name: groupName,
      description: `Collection group for ${actualUserEmail}`,
    }),
  });
  
  if (!createResult.success) {
    throw new Error(`Failed to create group: ${createResult.error}`);
  }
  
  const newGroup = createResult.data;
  console.log(`✓ Created group: ${newGroup.name} (${newGroup.id})`);
  
  // Add user to group
  const addUserResult = await localApiRequest(`/groups/${newGroup.id}/members`, {
    method: 'POST',
    body: JSON.stringify([actualUserEmail]),
  });
  
  if (!addUserResult.success) {
    console.warn(`Warning: Failed to add user to group: ${addUserResult.error}`);
  } else {
    console.log(`✓ Added user ${actualUserEmail} to group`);
  }
  
  return newGroup;
}

// Get logged-in user email
async function getLoggedInUserEmail() {
  const result = await localApiRequest('/auth/me');
  if (!result.success) {
    throw new Error(`Failed to get user info: ${result.error}`);
  }
  return result.data.email;
}

// Assign collection role to group
async function assignCollectionRole(groupId, collectionId, role) {
  const result = await localApiRequest(`/group-role/${collectionId}`, {
    method: 'POST',
    body: JSON.stringify({
      group_id: groupId,
      role: role,
    }),
  });
  
  if (result.success || result.status === 409) {
    return true;
  } else {
    console.error(`  ✗ Failed to assign role for collection '${collectionId}': ${result.error}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Sync Collections from Production STAC API');
  console.log('='.repeat(60));
  console.log(`Remote API: ${REMOTE_API_URL}`);
  console.log(`Local API: ${LOCAL_API_URL}`);
  if (LIMIT_COLLECTIONS) {
    console.log(`Collection limit: ${LIMIT_COLLECTIONS}`);
  }
  if (LIMIT_ITEMS) {
    console.log(`Item limit per collection: ${LIMIT_ITEMS}`);
  }
  console.log('');
  
  console.log('Authentication Configuration:');
  if (REMOTE_DMS_TOKEN) {
    console.log(`  Remote API: ✓ Using REMOTE_DMS_TOKEN for authentication`);
    console.log('    - Collections and items will be fetched with authentication');
  } else {
    console.log(`  Remote API: ⚠ No REMOTE_DMS_TOKEN provided`);
    console.log('    - Fetching from remote API may fail if authentication is required');
  }
  if (LOCAL_DMS_TOKEN) {
    console.log(`  Local API:  ✓ Using LOCAL_DMS_TOKEN for authentication`);
    console.log('    - Collections and items will be created with authentication');
    console.log('    - Role assignment will be performed');
  } else {
    console.log(`  Local API:  ⚠ No LOCAL_DMS_TOKEN provided`);
    console.log('    - Collections and items may fail to create if authentication is required');
    console.log('    - Role assignment will be skipped');
  }
  console.log('');
  console.log('Current Configuration:');
  console.log(`  Local API:  ${LOCAL_API_URL} (set via LOCAL_API_URL env var or 1st argument)`);
  console.log(`  Remote API: ${REMOTE_API_URL} (set via REMOTE_API_URL env var or 2nd argument)`);
  if (LOCAL_DMS_TOKEN) {
    console.log(`  Local Auth: ✓ LOCAL_DMS_TOKEN provided`);
  } else {
    console.log(`  Local Auth: ✗ No LOCAL_DMS_TOKEN (set LOCAL_DMS_TOKEN env var or pass as 3rd argument)`);
  }
  if (REMOTE_DMS_TOKEN) {
    console.log(`  Remote Auth: ✓ REMOTE_DMS_TOKEN provided`);
  } else {
    console.log(`  Remote Auth: ✗ No REMOTE_DMS_TOKEN (set REMOTE_DMS_TOKEN env var or pass as 4th argument)`);
  }
  console.log('');

  try {
    let actualUserEmail = null;
    let group = null;
    
    // Get user and group if authenticated (using LOCAL_DMS_TOKEN)
    if (LOCAL_DMS_TOKEN) {
      console.log('='.repeat(60));
      console.log('Getting logged-in user');
      console.log('='.repeat(60));
      actualUserEmail = await getLoggedInUserEmail();
      console.log(`✓ Logged in as: ${actualUserEmail}`);
      console.log('');
      
      console.log('='.repeat(60));
      console.log('Setting up user group');
      console.log('='.repeat(60));
      group = await getOrCreateUserGroup(actualUserEmail);
      console.log('');
    }

    // Fetch collections from remote
    console.log('='.repeat(60));
    console.log('Fetching collections from remote API');
    console.log('='.repeat(60));
    const remoteCollectionsResult = await fetchRemoteCollections();
    
    // Handle both direct collections and links
    let remoteCollections = remoteCollectionsResult.collections || [];
    
    // If we got links instead, fetch them
    if (remoteCollectionsResult.links && remoteCollectionsResult.links.length > 0) {
      const fetched = await fetchCollectionsFromLinks(remoteCollectionsResult.links);
      remoteCollections = fetched.collections;
    }
    
    if (remoteCollections.length === 0) {
      console.log('No collections found. Exiting.');
      return;
    }
    
    // Apply collection limit if set
    const collectionsToSync = LIMIT_COLLECTIONS 
      ? remoteCollections.slice(0, LIMIT_COLLECTIONS)
      : remoteCollections;
    
    console.log(`Will sync ${collectionsToSync.length} collection(s)`);
    console.log('');

    // Create collections locally
    console.log('='.repeat(60));
    console.log('Creating collections in local API');
    console.log('='.repeat(60));
    const createdCollections = [];
    for (const collection of collectionsToSync) {
      if (await createLocalCollection(collection)) {
        createdCollections.push(collection.id);
      }
    }
    console.log('');

    // Assign permissions if authenticated (using LOCAL_DMS_TOKEN)
    if (LOCAL_DMS_TOKEN && group) {
      console.log('='.repeat(60));
      console.log('Assigning collection permissions');
      console.log('='.repeat(60));
      for (const collectionId of createdCollections) {
        await assignCollectionRole(group.id, collectionId, 'collection_data_steward');
      }
      console.log('');
    }

    // Fetch and upload items
    console.log('='.repeat(60));
    console.log('Fetching and uploading items');
    console.log('='.repeat(60));
    
    let totalItemsSuccess = 0;
    let totalItemsFailed = 0;
    
    for (const collection of collectionsToSync) {
      if (!createdCollections.includes(collection.id)) {
        continue; // Skip if collection wasn't created
      }
      
      console.log(`\nProcessing collection '${collection.id}':`);
      
      // Fetch items from remote
      const items = await fetchCollectionItems(collection.id);
      
      if (items.length === 0) {
        console.log(`  No items found for collection '${collection.id}'`);
        continue;
      }
      
      // Upload items to local
      console.log(`  Uploading ${items.length} item(s) to local API...`);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (await createLocalItem(item, collection.id)) {
          totalItemsSuccess++;
          if ((i + 1) % 10 === 0) {
            console.log(`    Progress: ${i + 1}/${items.length} items uploaded`);
          }
        } else {
          totalItemsFailed++;
        }
        
        // Small delay to avoid overwhelming the API
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      console.log(`  ✓ Completed collection '${collection.id}': ${items.length} item(s)`);
    }

    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('Summary');
    console.log('='.repeat(60));
    if (actualUserEmail) {
      console.log(`✓ User: ${actualUserEmail}`);
    }
    if (group) {
      console.log(`✓ Group: ${group.name} (${group.id})`);
    }
    console.log(`✓ Collections synced: ${createdCollections.length}`);
    createdCollections.forEach(id => {
      console.log(`  - ${id}`);
    });
    console.log(`✓ Items uploaded: ${totalItemsSuccess}`);
    console.log(`✗ Items failed: ${totalItemsFailed}`);
    console.log('');
    console.log('✓ Sync complete!');
    
    if (actualUserEmail) {
      console.log(`\nUser ${actualUserEmail} now has COLLECTION_DATA_STEWARD rights on all synced collections.`);
    }

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if ((LOCAL_DMS_TOKEN || REMOTE_DMS_TOKEN) && error.message && (error.message.includes('401') || error.message.includes('Authentication'))) {
      console.log('');
      console.log('Authentication failed. Please:');
      console.log('1. Make sure you are logged in via the browser for both local and remote APIs');
      console.log('2. Copy the DMS_TOKEN cookie from your browser for each environment');
      console.log('3. Run the script with:');
      console.log('   - LOCAL_DMS_TOKEN=your-local-token REMOTE_DMS_TOKEN=your-remote-token node scripts/sync-from-production.js');
      console.log('   - Or as arguments: node scripts/sync-from-production.js [LOCAL_API_URL] [REMOTE_API_URL] [LOCAL_DMS_TOKEN] [REMOTE_DMS_TOKEN]');
    }
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
