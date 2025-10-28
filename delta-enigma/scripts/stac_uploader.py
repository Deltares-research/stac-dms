#!/usr/bin/env python3
"""
Upload STAC Items to a STAC API endpoint.
"""

import json
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class STACUploader:
    """Handle uploading STAC items to a STAC API."""
    
    def __init__(self, api_url: str, collection_id: str, api_key: Optional[str] = None, use_feature_collection: Optional[bool] = None):
        """
        Initialize the uploader.
        
        Args:
            api_url: Base URL of the STAC API (e.g., 'http://localhost:8080')
            collection_id: ID of the collection to add items to
            api_key: Optional API key for authentication
            use_feature_collection: Force using FeatureCollection wrapper (None=auto-detect)
        """
        self.api_url = api_url.rstrip('/')
        self.collection_id = collection_id
        self.api_key = api_key
        self.use_feature_collection = use_feature_collection  # None, True, or False
        
        # Setup session with retry logic
        self.session = requests.Session()
        retry = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504]
        )
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount('http://', adapter)
        self.session.mount('https://', adapter)
        
        # Set headers
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
        if api_key:
            self.session.headers.update({
                'Authorization': f'Bearer {api_key}'
            })
    
    def check_collection_exists(self) -> bool:
        """Check if the collection exists."""
        url = f"{self.api_url}/collections/{self.collection_id}"
        try:
            response = self.session.get(url)
            return response.status_code == 200
        except requests.exceptions.RequestException as e:
            print(f"Error checking collection: {e}")
            return False
    
    def create_collection(self, title: str, description: str) -> bool:
        """
        Create a new collection.
        
        Args:
            title: Collection title
            description: Collection description
        """
        collection = {
            "type": "Collection",
            "id": self.collection_id,
            "stac_version": "1.0.0",
            "title": title,
            "description": description,
            "license": "proprietary",
            "extent": {
                "spatial": {
                    "bbox": [[-180, -90, 180, 90]]
                },
                "temporal": {
                    "interval": [[None, None]]
                }
            },
            "links": [
                {
                    "rel": "self",
                    "href": f"{self.api_url}/collections/{self.collection_id}"
                },
                {
                    "rel": "items",
                    "href": f"{self.api_url}/collections/{self.collection_id}/items"
                }
            ]
        }
        
        url = f"{self.api_url}/collections"
        try:
            response = self.session.post(url, json=collection)
            if response.status_code in [200, 201]:
                print(f"✓ Collection '{self.collection_id}' created successfully")
                return True
            else:
                print(f"✗ Failed to create collection: {response.status_code}")
                print(f"  Response: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"✗ Error creating collection: {e}")
            return False
    
    def upload_item(self, item: Dict) -> bool:
        """
        Upload a single STAC item.
        
        Args:
            item: STAC Item dictionary
        """
        # Add collection link if not present
        if 'collection' not in item:
            item['collection'] = self.collection_id
        
        # Ensure required links exist
        has_collection_link = any(
            link.get('rel') == 'collection' for link in item.get('links', [])
        )
        if not has_collection_link:
            item['links'].append({
                'rel': 'collection',
                'href': f"{self.api_url}/collections/{self.collection_id}"
            })
        
        url = f"{self.api_url}/collections/{self.collection_id}/items"
        
        try:
            # Auto-detect or use forced mode
            if self.use_feature_collection is None:
                # Always try Feature first (standard STAC)
                response = self.session.post(url, json=item)
                
                if response.status_code in [200, 201]:
                    return True
                elif response.status_code in [400, 422]:
                    error_text = response.text.lower()
                    # Only try FeatureCollection if error explicitly mentions it
                    if 'featurecollection' in error_text and "'feature'" not in error_text:
                        # Try with FeatureCollection wrapper
                        feature_collection = {
                            "type": "FeatureCollection",
                            "features": [item]
                        }
                        response = self.session.post(url, json=feature_collection)
                        if response.status_code in [200, 201]:
                            return True
                    
                    # If still failing or different error
                    print(f"✗ Validation error for item '{item['id']}': {response.status_code}")
                    print(f"  Response: {response.text[:500]}")
                    return False
                elif response.status_code == 409:
                    print(f"  Item '{item['id']}' already exists, attempting update...")
                    return self.update_item(item)
                else:
                    print(f"✗ Failed to upload item '{item['id']}': {response.status_code}")
                    print(f"  Response: {response.text[:500]}")
                    return False
            else:
                # Use forced mode
                payload = item
                if self.use_feature_collection:
                    payload = {
                        "type": "FeatureCollection",
                        "features": [item]
                    }
                
                response = self.session.post(url, json=payload)
                
                if response.status_code in [200, 201]:
                    return True
                elif response.status_code == 409:
                    print(f"  Item '{item['id']}' already exists, attempting update...")
                    return self.update_item(item)
                else:
                    print(f"✗ Failed to upload item '{item['id']}': {response.status_code}")
                    print(f"  Response: {response.text[:500]}")
                    return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Error uploading item '{item['id']}': {e}")
            return False
    
    def update_item(self, item: Dict) -> bool:
        """
        Update an existing STAC item.
        
        Args:
            item: STAC Item dictionary
        """
        url = f"{self.api_url}/collections/{self.collection_id}/items/{item['id']}"
        
        try:
            response = self.session.put(url, json=item)
            
            if response.status_code in [200, 204]:
                return True
            else:
                print(f"✗ Failed to update item '{item['id']}': {response.status_code}")
                print(f"  Response: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Error updating item '{item['id']}': {e}")
            return False
    
    def delete_item(self, item_id: str) -> bool:
        """
        Delete a single STAC item.
        
        Args:
            item_id: ID of the item to delete
        """
        url = f"{self.api_url}/collections/{self.collection_id}/items/{item_id}"
        
        try:
            response = self.session.delete(url)
            
            if response.status_code in [200, 204]:
                return True
            elif response.status_code == 404:
                print(f"  Item '{item_id}' not found (may already be deleted)")
                return True  # Consider it success if already gone
            else:
                print(f"✗ Failed to delete item '{item_id}': {response.status_code}")
                print(f"  Response: {response.text[:500]}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Error deleting item '{item_id}': {e}")
            return False
    
    def delete_all_items(self, delay: float = 0.1) -> Dict[str, int]:
        """
        Delete all items in the collection.
        
        Args:
            delay: Delay between deletes in seconds
        
        Returns:
            Dictionary with counts of successful and failed deletions
        """
        print(f"\nFetching all items from collection '{self.collection_id}'...")
        
        url = f"{self.api_url}/collections/{self.collection_id}/items"
        all_items = []
        
        try:
            # Fetch all items (with pagination support)
            next_url = url
            while next_url:
                response = self.session.get(next_url)
                
                if response.status_code != 200:
                    print(f"✗ Failed to fetch items: {response.status_code}")
                    return {'success': 0, 'failed': 0}
                
                data = response.json()
                
                # Handle both Item and FeatureCollection responses
                if data.get('type') == 'FeatureCollection':
                    features = data.get('features', [])
                    all_items.extend(features)
                    
                    # Check for pagination
                    links = data.get('links', [])
                    next_link = next((link for link in links if link.get('rel') == 'next'), None)
                    next_url = next_link['href'] if next_link else None
                else:
                    # Single item response
                    all_items.append(data)
                    next_url = None
            
            if not all_items:
                print("No items found in collection")
                return {'success': 0, 'failed': 0}
            
            print(f"Found {len(all_items)} item(s) to delete\n")
            
            stats = {'success': 0, 'failed': 0}
            
            for item in all_items:
                item_id = item.get('id', 'unknown')
                print(f"Deleting: {item_id}")
                
                if self.delete_item(item_id):
                    print(f"  ✓ Successfully deleted")
                    stats['success'] += 1
                else:
                    stats['failed'] += 1
                
                if delay > 0:
                    time.sleep(delay)
            
            return stats
            
        except requests.exceptions.RequestException as e:
            print(f"✗ Error fetching items: {e}")
            return {'success': 0, 'failed': 0}
    
    def delete_from_folder(self, folder: Path, delay: float = 0.1) -> Dict[str, int]:
        """
        Delete items based on JSON files in a folder.
        
        Args:
            folder: Path to folder containing STAC JSON files
            delay: Delay between deletes in seconds
        
        Returns:
            Dictionary with counts of successful and failed deletions
        """
        if not folder.exists():
            print(f"Error: Folder '{folder}' does not exist")
            return {'success': 0, 'failed': 0}
        
        json_files = list(folder.glob('*.json'))
        
        if not json_files:
            print(f"No JSON files found in '{folder}'")
            return {'success': 0, 'failed': 0}
        
        print(f"\nFound {len(json_files)} STAC item(s) to delete")
        print(f"Target API: {self.api_url}")
        print(f"Collection: {self.collection_id}\n")
        
        stats = {'success': 0, 'failed': 0}
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    item = json.load(f)
                
                item_id = item.get('id', json_file.stem)
                print(f"Deleting: {item_id}")
                
                if self.delete_item(item_id):
                    print(f"  ✓ Successfully deleted")
                    stats['success'] += 1
                else:
                    stats['failed'] += 1
                
                if delay > 0:
                    time.sleep(delay)
                    
            except json.JSONDecodeError as e:
                print(f"✗ Invalid JSON in {json_file.name}: {e}")
                stats['failed'] += 1
            except Exception as e:
                print(f"✗ Error processing {json_file.name}: {e}")
                stats['failed'] += 1
        
        return stats
    
    def upload_from_folder(self, folder: Path, delay: float = 0.1) -> Dict[str, int]:
        """
        Upload all STAC JSON files from a folder.
        
        Args:
            folder: Path to folder containing STAC JSON files
            delay: Delay between uploads in seconds (to avoid rate limiting)
        
        Returns:
            Dictionary with counts of successful and failed uploads
        """
        if not folder.exists():
            print(f"Error: Folder '{folder}' does not exist")
            return {'success': 0, 'failed': 0}
        
        json_files = list(folder.glob('*.json'))
        
        if not json_files:
            print(f"No JSON files found in '{folder}'")
            return {'success': 0, 'failed': 0}
        
        print(f"\nFound {len(json_files)} STAC item(s) to upload")
        print(f"Target API: {self.api_url}")
        print(f"Collection: {self.collection_id}\n")
        
        stats = {'success': 0, 'failed': 0}
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    item = json.load(f)
                
                print(f"Uploading: {item.get('id', json_file.name)}")
                
                if self.upload_item(item):
                    print(f"  ✓ Successfully uploaded")
                    stats['success'] += 1
                else:
                    stats['failed'] += 1
                
                # Add delay to avoid rate limiting
                if delay > 0:
                    time.sleep(delay)
                    
            except json.JSONDecodeError as e:
                print(f"✗ Invalid JSON in {json_file.name}: {e}")
                stats['failed'] += 1
            except Exception as e:
                print(f"✗ Error processing {json_file.name}: {e}")
                stats['failed'] += 1
        
        return stats


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Upload or delete STAC items from a STAC API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Upload items to a collection
  python stac_uploader.py upload http://localhost:8080 my-collection ./stac_output
  
  # Delete items based on JSON files in folder
  python stac_uploader.py delete http://localhost:8080 my-collection ./stac_output
  
  # Delete ALL items in a collection
  python stac_uploader.py delete-all http://localhost:8080 my-collection
  
  # With API key authentication
  python stac_uploader.py upload http://localhost:8080 my-collection ./stac_output --api-key YOUR_KEY
        """
    )
    
    parser.add_argument('action', choices=['upload', 'delete', 'delete-all'],
                       help='Action to perform: upload items, delete specific items, or delete all items')
    parser.add_argument('api_url', help='STAC API base URL (e.g., http://localhost:8080)')
    parser.add_argument('collection_id', help='Collection ID')
    parser.add_argument('folder', nargs='?', help='Folder containing STAC JSON files (not needed for delete-all)')
    parser.add_argument('--api-key', help='API key for authentication', default=None)
    parser.add_argument('--create-collection', action='store_true',
                       help='Create collection if it does not exist (upload only)')
    parser.add_argument('--collection-title', help='Title for new collection',
                       default='DCAT Converted Collection')
    parser.add_argument('--collection-description', help='Description for new collection',
                       default='Collection created from DCAT metadata')
    parser.add_argument('--delay', type=float, default=0.1,
                       help='Delay between operations in seconds (default: 0.1)')
    parser.add_argument('--force-feature-collection', action='store_true',
                       help='Always wrap items in FeatureCollection (upload only)')
    parser.add_argument('--force-feature', action='store_true',
                       help='Always send items as Feature (upload only)')
    parser.add_argument('--yes', '-y', action='store_true',
                       help='Skip confirmation prompts')
    
    args = parser.parse_args()
    
    # Validate arguments
    if args.action in ['upload', 'delete'] and not args.folder:
        parser.error(f"folder argument is required for action '{args.action}'")
    
    # Determine mode
    use_feature_collection = None
    if args.force_feature_collection:
        use_feature_collection = True
    elif args.force_feature:
        use_feature_collection = False
    
    folder = Path(args.folder) if args.folder else None
    
    # Initialize uploader
    uploader = STACUploader(args.api_url, args.collection_id, args.api_key, use_feature_collection)
    
    # Handle different actions
    if args.action == 'upload':
        # Check if collection exists
        if not uploader.check_collection_exists():
            if args.create_collection:
                print(f"Collection '{args.collection_id}' does not exist, creating...")
                if not uploader.create_collection(args.collection_title, args.collection_description):
                    print("Failed to create collection. Exiting.")
                    sys.exit(1)
            else:
                print(f"Error: Collection '{args.collection_id}' does not exist")
                print("Use --create-collection to create it automatically")
                sys.exit(1)
        else:
            print(f"✓ Collection '{args.collection_id}' exists\n")
        
        # Upload items
        stats = uploader.upload_from_folder(folder, args.delay)
        
        # Print summary
        print("\n" + "="*50)
        print("Upload Summary:")
        print(f"  Successful: {stats['success']}")
        print(f"  Failed: {stats['failed']}")
        print(f"  Total: {stats['success'] + stats['failed']}")
        print("="*50)
        
        sys.exit(0 if stats['failed'] == 0 else 1)
    
    elif args.action == 'delete':
        # Confirm deletion
        if not args.yes:
            print(f"⚠️  WARNING: This will delete items from collection '{args.collection_id}'")
            response = input("Are you sure you want to continue? (yes/no): ")
            if response.lower() not in ['yes', 'y']:
                print("Deletion cancelled")
                sys.exit(0)
        
        # Delete items based on folder
        stats = uploader.delete_from_folder(folder, args.delay)
        
        # Print summary
        print("\n" + "="*50)
        print("Deletion Summary:")
        print(f"  Successful: {stats['success']}")
        print(f"  Failed: {stats['failed']}")
        print(f"  Total: {stats['success'] + stats['failed']}")
        print("="*50)
        
        sys.exit(0 if stats['failed'] == 0 else 1)
    
    elif args.action == 'delete-all':
        # Confirm deletion
        if not args.yes:
            print(f"⚠️  WARNING: This will delete ALL items from collection '{args.collection_id}'")
            print(f"API: {args.api_url}")
            response = input("Are you sure you want to continue? (yes/no): ")
            if response.lower() not in ['yes', 'y']:
                print("Deletion cancelled")
                sys.exit(0)
        
        # Delete all items
        stats = uploader.delete_all_items(args.delay)
        
        # Print summary
        print("\n" + "="*50)
        print("Deletion Summary:")
        print(f"  Successful: {stats['success']}")
        print(f"  Failed: {stats['failed']}")
        print(f"  Total: {stats['success'] + stats['failed']}")
        print("="*50)
        
        sys.exit(0 if stats['failed'] == 0 else 1)


if __name__ == '__main__':
    main()