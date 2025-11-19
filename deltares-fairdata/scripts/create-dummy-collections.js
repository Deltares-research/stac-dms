#!/usr/bin/env node

/**
 * Script to create dummy collections and assign edit rights to a user.
 * 
 * This script:
 * 1. Creates dummy collections via API
 * 2. Gets or creates a group for the user
 * 3. Adds the user to the group (if not already there)
 * 4. Assigns COLLECTION_DATA_STEWARD role to the group for each collection
 * 5. Uploads dummy data to those collections
 * 
 * Usage: node scripts/create-dummy-collections.js [API_URL] [USER_EMAIL] [DMS_TOKEN]
 * 
 * Environment variables:
 * - API_URL: Base URL for the API (default: http://localhost:8000/api)
 * - USER_EMAIL: Email of the user to grant access (optional, not used if DMS_TOKEN is provided)
 * - DMS_TOKEN: Authentication cookie value (optional, required only for role assignment)
 * 
 * Note: If DMS_TOKEN is not provided, the script will:
 * - Create collections and items without authentication
 * - Skip user group creation and role assignment
 * 
 * How to get the DMS_TOKEN cookie (if needed):
 * 1. Open your browser and navigate to the frontend (e.g., http://localhost:3000)
 * 2. Log in via SSO
 * 3. Open browser DevTools (F12) -> Application/Storage tab -> Cookies
 * 4. Find the cookie named "DMS_TOKEN" and copy its value
 * 5. Pass it as: DMS_TOKEN=your-token-value node scripts/create-dummy-collections.js
 * 
 * Requirements:
 * - Node.js 18+ (for built-in fetch) or install node-fetch
 */

const API_URL = process.env.API_URL || process.argv[2] || 'http://localhost:8000/api';
const USER_EMAIL = process.env.USER_EMAIL || process.argv[3] || null;
const DMS_TOKEN = process.env.DMS_TOKEN || process.argv[4] || null;
const NUM_ITEMS_PER_COLLECTION = 5;
const COOKIE_NAME = 'DMS_TOKEN';

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

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  // Add authentication cookie if provided
  if (DMS_TOKEN) {
    headers['Cookie'] = `${COOKIE_NAME}=${DMS_TOKEN}`;
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
      // If response is not JSON, use text as error message
      data = { error: text || 'Unknown error' };
    }
    
    // Return response with status even if not ok, so we can handle 409 (Conflict) etc.
    if (!response.ok) {
      return { 
        success: false, 
        data, 
        error: `HTTP ${response.status}: ${JSON.stringify(data)}`,
        status: response.status 
      };
    }
    
    return { success: true, data, status: response.status };
  } catch (error) {
    // Check if it's an authentication error
    if (error.message && error.message.includes('401')) {
      return { 
        success: false, 
        error: 'Authentication failed. Please check your DMS_TOKEN cookie value.',
        status: 401 
      };
    }
    return { success: false, error: error.message, status: error.status || error.statusCode };
  }
}

// Get the actual logged-in user's email from the API
async function getLoggedInUserEmail() {
  console.log('Getting logged-in user information...');
  const result = await apiRequest('/auth/me');
  
  if (!result.success) {
    throw new Error(`Failed to get user info: ${result.error}. Make sure you're authenticated.`);
  }
  
  const userEmail = result.data.email;
  console.log(`✓ Logged in as: ${userEmail}`);
  return userEmail;
}

// Get or create a group for the user
async function getOrCreateUserGroup(actualUserEmail) {
  console.log('Getting or creating user group...');
  
  // First, get all groups
  const groupsResult = await apiRequest('/groups');
  if (!groupsResult.success) {
    throw new Error(`Failed to fetch groups: ${groupsResult.error}`);
  }
  
  const groups = groupsResult.data || [];
  
  // Look for a group that contains the user (case-insensitive comparison)
  for (const group of groups) {
    const membersResult = await apiRequest(`/groups/${group.id}/members`);
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
  
  // If no group found, create a new one
  const groupName = `${actualUserEmail.split('@')[0]}-collections`;
  console.log(`Creating new group: ${groupName}...`);
  
  const createResult = await apiRequest('/groups', {
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
  
  // Add user to the group using the actual email from the token
  console.log(`Adding user ${actualUserEmail} to group...`);
  const addUserResult = await apiRequest(`/groups/${newGroup.id}/members`, {
    method: 'POST',
    body: JSON.stringify([actualUserEmail]),
  });
  
  if (!addUserResult.success) {
    console.warn(`Warning: Failed to add user to group: ${addUserResult.error}`);
    // Continue anyway, user might already be in the group
  } else {
    console.log(`✓ Added user ${actualUserEmail} to group`);
  }
  
  // Verify the user is actually in the group
  const verifyResult = await apiRequest(`/groups/${newGroup.id}/members`);
  if (verifyResult.success) {
    const members = verifyResult.data || [];
    const userInGroup = members.some(member => 
      member.email.toLowerCase() === actualUserEmail.toLowerCase()
    );
    if (!userInGroup) {
      throw new Error(`User ${actualUserEmail} was not successfully added to the group. Please check the user exists in the system.`);
    }
    console.log(`✓ Verified user is in the group`);
  }
  
  return newGroup;
}

// Assign collection role to group
async function assignCollectionRole(groupId, collectionId, role) {
  const result = await apiRequest(`/group-role/${collectionId}`, {
    method: 'POST',
    body: JSON.stringify({
      group_id: groupId,
      role: role,
    }),
  });
  
  if (result.success) {
    console.log(`✓ Assigned ${role} role to group for collection '${collectionId}'`);
    // Small delay to ensure the role is committed to the database
    await new Promise(resolve => setTimeout(resolve, 200));
    return true;
  } else if (result.status === 409 || result.error.includes('already')) {
    console.log(`✓ ${role} role already assigned for collection '${collectionId}'`);
    return true;
  } else {
    console.error(`✗ Failed to assign role for collection '${collectionId}': ${result.error}`);
    return false;
  }
}

// Create a collection
async function createCollection(collectionId, title, description) {
  const collectionData = {
    type: 'Collection',
    stac_version: '1.0.0',
    stac_extensions: [],
    id: collectionId,
    title: title,
    description: description,
    keywords: [],
    license: 'proprietary',
    extent: {
      spatial: {
        bbox: [[-180, -56, 180, 83]],
      },
      temporal: {
        interval: [[]],
      },
    },
    links: [],
  };

  const result = await apiRequest('/collections', {
    method: 'POST',
    body: JSON.stringify(collectionData),
  });
  
  // 409 Conflict means the collection already exists - that's fine, we can use it
  if (result.success || result.status === 409) {
    if (result.status === 409) {
      console.log(`✓ Collection '${collectionId}' already exists`);
    } else {
      console.log(`✓ Collection '${collectionId}' created`);
    }
    return true;
  } else {
    console.error(`✗ Failed to create collection '${collectionId}': ${result.error}`);
    return false;
  }
}

// Generate a dummy STAC item
function generateDummyItem(index, collectionId) {
  const now = new Date();
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const itemId = `dummy-item-${collectionId}-${index}-${timestamp}-${random}`;
  
  // Generate a random point geometry in the Netherlands
  const longitude = 4.5 + (Math.random() * 2); // ~4.5 to 6.5
  const latitude = 51.5 + (Math.random() * 1); // ~51.5 to 52.5
  
  return {
    type: 'Feature',
    stac_version: '1.0.0',
    stac_extensions: [],
    id: itemId,
    collection: collectionId,
    properties: {
      title: `Dummy Dataset ${index}`,
      projectNumber: `PROJ-${String(index).padStart(3, '0')}`,
      description: `Test description for dummy dataset ${index}. This is a sample dataset created for testing purposes.`,
      publication_datetime: now.toISOString(),
      spatialReferenceSystem: 'EPSG:4326',
      dataQualityInfoStatement: 'Test data - generated automatically',
      dataQualityInfoScore: 'dataSet',
      dateType: 'publication',
      legalRestrictions: 'copyright',
      restrictionsOfUse: 'Test restrictions - for testing purposes only',
      metadataStandardName: 'ISO 19115',
      metadataStandardVersion: '2.1.0',
      progressCode: 'completed',
      language: 'eng',
      hierarchyLevel: 'dataSet',
      originatorDataEmail: 'test@deltares.nl',
      originatorDataRoleCode: 'originator',
      originatorDataOrganisation: 'Deltares',
      originatorMetaDataOrganisation: 'Deltares',
      originatorMetaDataEmail: 'test@deltares.nl',
      originatorMetaDataRoleCode: 'originator',
      metaDataLanguage: 'eng',
      datetime: now.toISOString(),
      facility_type: 'test',
      license: 'proprietary',
    },
    geometry: {
      type: 'Point',
      coordinates: [longitude, latitude],
    },
    bbox: [
      longitude - 0.01,
      latitude - 0.01,
      longitude + 0.01,
      latitude + 0.01,
    ],
    links: [],
    assets: {},
  };
}

// Create a single item
async function createItem(item, collectionId) {
  const result = await apiRequest(`/collections/${collectionId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
  
  if (result.success) {
    console.log(`  ✓ Created item: ${item.id}`);
    return true;
  } else {
    console.error(`  ✗ Failed to create item ${item.id}: ${result.error}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Create Dummy Collections Script');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_URL}`);
  if (USER_EMAIL) {
    console.log(`User Email: ${USER_EMAIL}`);
  }
  console.log(`Items per collection: ${NUM_ITEMS_PER_COLLECTION}`);
  console.log('');
  
  // Check for authentication
  if (DMS_TOKEN) {
    console.log('✓ Authentication: Using DMS_TOKEN cookie');
  } else {
    console.log('⚠ Authentication: No DMS_TOKEN provided - will skip role assignment');
    console.log('  (Collections and items will be created without authentication)');
  }
  console.log('');

  try {
    let actualUserEmail = null;
    let group = null;
    
    // Step 0: Get the actual logged-in user's email (only if authenticated)
    if (DMS_TOKEN) {
      console.log('='.repeat(60));
      console.log('Getting logged-in user');
      console.log('='.repeat(60));
      actualUserEmail = await getLoggedInUserEmail();
      console.log('');
      
      // Step 1: Get or create user group
      console.log('='.repeat(60));
      console.log('Setting up user group');
      console.log('='.repeat(60));
      group = await getOrCreateUserGroup(actualUserEmail);
      console.log('');
    } else {
      console.log('⚠ Skipping authentication steps (no DMS_TOKEN provided)');
      console.log('');
    }

    // Step 2: Create dummy collections
    console.log('='.repeat(60));
    console.log('Creating dummy collections');
    console.log('='.repeat(60));
    
    const collections = [
      {
        id: 'test-collection-1',
        title: 'Test Collection 1',
        description: 'First test collection for dummy data',
      },
      {
        id: 'test-collection-2',
        title: 'Test Collection 2',
        description: 'Second test collection for dummy data',
      },
      {
        id: 'test-collection-3',
        title: 'Test Collection 3',
        description: 'Third test collection for dummy data',
      },
    ];

    const createdCollections = [];
    for (const collectionInfo of collections) {
      if (await createCollection(collectionInfo.id, collectionInfo.title, collectionInfo.description)) {
        createdCollections.push(collectionInfo.id);
      }
    }

    if (createdCollections.length === 0) {
      console.log('\n✗ No collections were created. Exiting.');
      return;
    }

    // Step 3: Assign collection permissions (only if authenticated)
    if (DMS_TOKEN && group) {
      console.log('');
      console.log('='.repeat(60));
      console.log('Assigning collection permissions');
      console.log('='.repeat(60));
      
      // Assign COLLECTION_DATA_STEWARD role to the group for each collection
      for (const collectionId of createdCollections) {
        await assignCollectionRole(group.id, collectionId, 'collection_data_steward');
      }
    } else {
      console.log('');
      console.log('⚠ Skipping role assignment (no authentication provided)');
    }

    // Step 4: Upload dummy data to collections
    console.log('');
    console.log('='.repeat(60));
    console.log('Uploading dummy data to collections');
    console.log('='.repeat(60));
    
    let totalSuccess = 0;
    let totalFailed = 0;

    for (const collectionId of createdCollections) {
      console.log(`\nUploading items to collection '${collectionId}':`);
      for (let i = 1; i <= NUM_ITEMS_PER_COLLECTION; i++) {
        const item = generateDummyItem(i, collectionId);
        if (await createItem(item, collectionId)) {
          totalSuccess++;
        } else {
          totalFailed++;
        }
        
        // Small delay to avoid overwhelming the API
        if (i < NUM_ITEMS_PER_COLLECTION) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
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
    console.log(`✓ Collections created: ${createdCollections.length}`);
    createdCollections.forEach(id => {
      console.log(`  - ${id}`);
    });
    console.log(`✓ Items created: ${totalSuccess}`);
    console.log(`✗ Items failed: ${totalFailed}`);
    console.log('');
    console.log('✓ Setup complete!');
    if (actualUserEmail) {
      console.log(`\nUser ${actualUserEmail} now has COLLECTION_DATA_STEWARD rights on all created collections.`);
    } else {
      console.log(`\nCollections and items created without authentication.`);
      console.log(`To assign permissions, run the script again with DMS_TOKEN.`);
    }

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    
    // Provide helpful message for authentication errors (only if DMS_TOKEN was provided)
    if (DMS_TOKEN && error.message && (error.message.includes('401') || error.message.includes('Authentication'))) {
      console.log('');
      console.log('Authentication failed. Please:');
      console.log('1. Make sure you are logged in via the browser');
      console.log('2. Copy the DMS_TOKEN cookie from your browser');
      console.log(`3. Run the script with: DMS_TOKEN=your-token-value node scripts/create-dummy-collections.js`);
    }
    
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

