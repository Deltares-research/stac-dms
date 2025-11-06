#!/usr/bin/env node

/**
 * Script to add 20 dummy STAC items to the database
 * Usage: node scripts/add-dummy-data.js [API_URL] [COLLECTION_ID] [COOKIE]
 * 
 * Environment variables:
 * - API_URL: Base URL for the API (default: http://localhost:8000/api)
 * - COLLECTION_ID: Specific collection ID to use (optional, will fetch first available if not provided)
 * - DMS_TOKEN: Authentication cookie value (required)
 * 
 * How to get the DMS_TOKEN cookie:
 * 1. Open your browser and navigate to the frontend (e.g., http://localhost:3000)
 * 2. Log in via SSO
 * 3. Open browser DevTools (F12) -> Application/Storage tab -> Cookies
 * 4. Find the cookie named "DMS_TOKEN" and copy its value
 * 5. Pass it as: DMS_TOKEN=your-token-value node scripts/add-dummy-data.js
 * 
 * Or use command line: node scripts/add-dummy-data.js [API_URL] [COLLECTION_ID] [COOKIE]
 * 
 * Requirements:
 * - Node.js 18+ (for built-in fetch) or install node-fetch
 */

const API_URL = process.env.API_URL || process.argv[2] || 'http://localhost:8000/api';
const COLLECTION_ID = process.env.COLLECTION_ID || process.argv[3] || null;
const DMS_TOKEN = process.env.DMS_TOKEN || process.argv[4] || null;
const NUM_ITEMS = 20;
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
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

// Fetch available collections
async function fetchCollections() {
  console.log('Fetching available collections...');
  const result = await apiRequest('/collections');
  
  if (!result.success) {
    throw new Error(`Failed to fetch collections: ${result.error}`);
  }
  
  const collections = result.data.collections || [];
  
  if (collections.length === 0) {
    throw new Error('No collections found. Please create a collection first.');
  }
  
  console.log(`Found ${collections.length} collection(s):`);
  collections.forEach(col => {
    console.log(`  - ${col.id}: ${col.title || 'No title'}`);
  });
  
  return collections;
}

// Generate a dummy STAC item
function generateDummyItem(index, collectionId) {
  const now = new Date();
  // Ensure unique ID by combining index with timestamp and random component
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const itemId = `dummy-item-${index}-${timestamp}-${random}`;
  
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
  console.log(`Creating item: ${item.id}...`);
  const result = await apiRequest(`/collections/${collectionId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
  
  if (result.success) {
    console.log(`  ✓ Successfully created item: ${item.id}`);
    return { success: true, itemId: item.id };
  } else {
    console.error(`  ✗ Failed to create item ${item.id}: ${result.error}`);
    return { success: false, itemId: item.id, error: result.error };
  }
}

// Main function
async function main() {
  console.log('='.repeat(60));
  console.log('Dummy Data Generator');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`Number of items to create: ${NUM_ITEMS}`);
  
  // Check for authentication
  if (!DMS_TOKEN) {
    console.log('');
    console.error('✗ Error: Authentication token (DMS_TOKEN) is required!');
    console.log('');
    console.log('To get your DMS_TOKEN cookie:');
    console.log('1. Open your browser and navigate to the frontend (e.g., http://localhost:3000)');
    console.log('2. Log in via SSO');
    console.log('3. Open DevTools (F12) -> Application/Storage tab -> Cookies');
    console.log('4. Find the cookie named "DMS_TOKEN" and copy its value');
    console.log('');
    console.log('Then run:');
    console.log('  DMS_TOKEN=your-token-value node scripts/add-dummy-data.js');
    console.log('  or');
    console.log('  node scripts/add-dummy-data.js [API_URL] [COLLECTION_ID] [COOKIE]');
    console.log('');
    process.exit(1);
  }
  
  console.log(`Authentication: Using DMS_TOKEN cookie`);
  console.log('');

  try {
    // Fetch collections
    const collections = await fetchCollections();
    
    // Determine which collection to use
    let targetCollectionId = COLLECTION_ID;
    if (!targetCollectionId) {
      targetCollectionId = collections[0].id;
      console.log(`\nUsing first available collection: ${targetCollectionId}`);
    } else {
      const collectionExists = collections.some(col => col.id === targetCollectionId);
      if (!collectionExists) {
        throw new Error(`Collection "${targetCollectionId}" not found. Available collections: ${collections.map(c => c.id).join(', ')}`);
      }
      console.log(`\nUsing specified collection: ${targetCollectionId}`);
    }
    
    console.log('');
    console.log('Creating dummy items...');
    console.log('-'.repeat(60));
    
    // Create items
    const results = {
      success: [],
      failed: [],
    };
    
    for (let i = 1; i <= NUM_ITEMS; i++) {
      const item = generateDummyItem(i, targetCollectionId);
      const result = await createItem(item, targetCollectionId);
      
      if (result.success) {
        results.success.push(result.itemId);
      } else {
        results.failed.push({ itemId: result.itemId, error: result.error });
      }
      
      // Small delay to avoid overwhelming the API
      if (i < NUM_ITEMS) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('Summary');
    console.log('='.repeat(60));
    console.log(`Total items: ${NUM_ITEMS}`);
    console.log(`Successfully created: ${results.success.length}`);
    console.log(`Failed: ${results.failed.length}`);
    
    if (results.failed.length > 0) {
      console.log('\nFailed items:');
      results.failed.forEach(failure => {
        console.log(`  - ${failure.itemId}: ${failure.error}`);
      });
    }
    
    if (results.success.length > 0) {
      console.log('\n✓ Successfully created items:');
      results.success.forEach(itemId => {
        console.log(`  - ${itemId}`);
      });
    }
    
    console.log('');
    console.log('Done!');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    
    // Provide helpful message for authentication errors
    if (error.message && error.message.includes('401')) {
      console.log('');
      console.log('Authentication failed. Please:');
      console.log('1. Make sure you are logged in via the browser');
      console.log('2. Copy the DMS_TOKEN cookie from your browser');
      console.log('3. Run the script with: DMS_TOKEN=your-token-value node scripts/add-dummy-data.js');
    }
    
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

