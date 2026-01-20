#!/usr/bin/env python3
"""
Convert DCAT XML files to STAC Item JSON format for API ingestion.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any
from xml.etree import ElementTree as ET
from datetime import datetime

# XML Namespaces
NAMESPACES = {
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'dct': 'http://purl.org/dc/terms/',
    'dcat': 'http://www.w3.org/ns/dcat#',
    'foaf': 'http://xmlns.com/foaf/0.1/',
    'vcard': 'http://www.w3.org/2006/vcard/ns#',
    'skos': 'http://www.w3.org/2004/02/skos/core#',
    'adms': 'http://www.w3.org/ns/adms#',
    'geodcatap': 'http://data.europa.eu/930/'
}


def parse_bbox(bbox_str: str) -> Optional[Dict]:
    """Parse GeoJSON bbox string to extract coordinates."""
    try:
        bbox_data = json.loads(bbox_str)
        if bbox_data.get('type') == 'Polygon' and 'coordinates' in bbox_data:
            coords = bbox_data['coordinates'][0]
            
            # Validate we have at least 4 points
            if len(coords) < 4:
                return None
            
            # Extract bounding box: [west, south, east, north]
            lons = [c[0] for c in coords]
            lats = [c[1] for c in coords]
            
            min_lon, max_lon = min(lons), max(lons)
            min_lat, max_lat = min(lats), max(lats)
            
            # Check if it's a valid bounding box (not a point or line)
            if min_lon == max_lon or min_lat == max_lat:
                return None
            
            # Create proper clockwise polygon for bbox
            # Bottom-left, bottom-right, top-right, top-left, bottom-left
            proper_coords = [
                [min_lon, min_lat],
                [max_lon, min_lat],
                [max_lon, max_lat],
                [min_lon, max_lat],
                [min_lon, min_lat]
            ]
            
            return {
                'type': 'Polygon',
                'coordinates': [proper_coords],
                'bbox': [min_lon, min_lat, max_lon, max_lat]
            }
    except:
        pass
    return None


def extract_text(element, xpath: str, namespaces: Dict) -> Optional[str]:
    """Extract text from XML element using XPath."""
    el = element.find(xpath, namespaces)
    if el is not None:
        return el.text
    return None


def extract_all_text(element, xpath: str, namespaces: Dict) -> List[str]:
    """Extract all text values from XML elements using XPath."""
    elements = element.findall(xpath, namespaces)
    return [el.text for el in elements if el.text]


def parse_temporal(element, namespaces: Dict) -> Dict[str, Optional[str]]:
    """Extract temporal coverage information."""
    temporal = {}
    
    # Look for PeriodOfTime
    period = element.find('.//dct:temporal/dct:PeriodOfTime', namespaces)
    if period is not None:
        start = extract_text(period, './dcat:startDate', namespaces)
        end = extract_text(period, './dcat:endDate', namespaces)
        temporal['start'] = start
        temporal['end'] = end
    
    return temporal


def parse_distributions(element, namespaces: Dict) -> List[Dict]:
    """Extract distribution/asset information."""
    assets = []
    distributions = element.findall('.//dcat:distribution/dcat:Distribution', namespaces)
    
    for dist in distributions:
        asset = {}
        
        title = extract_text(dist, './dct:title', namespaces)
        description = extract_text(dist, './dct:description', namespaces)
        access_url = dist.find('./dcat:accessURL', namespaces)
        download_url = dist.find('./dcat:downloadURL', namespaces)
        
        if title:
            asset['title'] = title
        if description:
            asset['description'] = description
        
        # Prefer downloadURL over accessURL
        if download_url is not None:
            asset['href'] = download_url.get(f'{{{NAMESPACES["rdf"]}}}resource', '')
            asset['type'] = 'download'
        elif access_url is not None:
            asset['href'] = access_url.get(f'{{{NAMESPACES["rdf"]}}}resource', '')
            asset['type'] = 'access'
        
        # Check if it's a WMS service
        service = dist.find('./dcat:accessService', namespaces)
        if service is not None:
            asset['type'] = 'wms'
        
        if asset.get('href'):
            assets.append(asset)
    
    return assets


def parse_links(element, namespaces: Dict) -> List[Dict]:
    """Extract foaf:page links."""
    links = []
    pages = element.findall('.//foaf:page/foaf:Document', namespaces)
    
    for page in pages:
        about = page.get(f'{{{NAMESPACES["rdf"]}}}about', '')
        description = extract_text(page, './dct:description', namespaces)
        
        if about:
            link = {
                'href': about,
                'rel': 'related'
            }
            if description:
                link['title'] = description
            links.append(link)
    
    return links


def convert_dcat_to_stac(xml_path: Path) -> Dict[str, Any]:
    """Convert a single DCAT XML file to STAC Item format."""
    
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Find the main resource description
    resource = root.find('.//rdf:Description[@rdf:about]', NAMESPACES)
    if resource is None:
        resource = root.find('.//rdf:Description', NAMESPACES)
    
    # Extract basic metadata
    stac_item = {
        'type': 'Feature',
        'stac_version': '1.0.0',
        'stac_extensions': [],
        'id': '',
        'geometry': None,
        'bbox': None,
        'properties': {},
        'links': [],
        'assets': {}
    }
    
    # ID - from dct:identifier or generate from filename
    id_elem = root.find('.//dct:identifier', NAMESPACES)
    if id_elem is not None:
        stac_item['id'] = id_elem.text
    else:
        stac_item['id'] = xml_path.stem
    
    # Title
    title = extract_text(root, './/dct:title', NAMESPACES)
    if title:
        stac_item['properties']['title'] = title
    
    # Description
    description = extract_text(root, './/dct:description', NAMESPACES)
    if description:
        stac_item['properties']['description'] = description
    
    # Dates - ensure timezone-aware ISO format
    def normalize_datetime(dt_str: str) -> str:
        """Normalize datetime string to ISO format with timezone."""
        if not dt_str:
            return None
        
        # Clean up the string
        dt_str = dt_str.strip()
        
        # If already has timezone info and is complete, return as is
        if 'T' in dt_str and ('+' in dt_str or dt_str.endswith('Z')):
            # Validate it's not malformed (like "2020T00:00:00Z")
            if not dt_str[0:4].isdigit() or (len(dt_str) > 4 and dt_str[4] == 'T'):
                # Malformed - just use the year
                year = dt_str[0:4]
                return f"{year}-01-01T00:00:00Z"
            return dt_str
        
        # Handle year-month format (YYYY-MM)
        if len(dt_str) == 7 and dt_str[4] == '-' and 'T' not in dt_str:
            return f"{dt_str}-01T00:00:00Z"
        
        # If only date (YYYY-MM-DD), add time and UTC timezone
        if 'T' not in dt_str and len(dt_str) >= 10:
            return f"{dt_str}T00:00:00Z"
        
        # If only year (YYYY), add month, day, time and UTC
        if len(dt_str) == 4 and dt_str.isdigit():
            return f"{dt_str}-01-01T00:00:00Z"
        
        # If datetime without timezone, add UTC
        if 'T' in dt_str and '+' not in dt_str and not dt_str.endswith('Z'):
            return f"{dt_str}Z"
        
        return dt_str
    
    created = extract_text(root, './/dct:issued', NAMESPACES)
    updated = extract_text(root, './/dct:modified', NAMESPACES)
    
    if created:
        stac_item['properties']['created'] = normalize_datetime(created)
    if updated:
        stac_item['properties']['updated'] = normalize_datetime(updated)
    
    # Use created/updated for datetime (STAC requirement)
    datetime_value = updated or created
    stac_item['properties']['datetime'] = normalize_datetime(datetime_value) if datetime_value else None
    
    # Temporal coverage - only add if we have a proper range (both start and end)
    temporal = parse_temporal(root, NAMESPACES)
    if temporal.get('start') and temporal.get('end'):
        stac_item['properties']['start_datetime'] = normalize_datetime(temporal['start'])
        stac_item['properties']['end_datetime'] = normalize_datetime(temporal['end'])
        # Remove single datetime when we have a range
        stac_item['properties']['datetime'] = None
    
    # Spatial coverage (geometry and bbox)
    bbox_elem = root.find('.//dcat:bbox', NAMESPACES)
    if bbox_elem is not None and bbox_elem.text:
        geom = parse_bbox(bbox_elem.text)
        if geom:
            stac_item['geometry'] = {
                'type': geom['type'],
                'coordinates': geom['coordinates']
            }
            stac_item['bbox'] = geom['bbox']
    
    # If no valid geometry, ensure both are null (required by STAC)
    if stac_item['geometry'] is None:
        stac_item['bbox'] = None
    
    # Spatial description
    spatial_desc = root.find('.//dct:spatial/rdf:Description', NAMESPACES)
    if spatial_desc is not None:
        # Could add custom property for spatial description
        pass
    
    # Keywords
    keywords = extract_all_text(root, './/dcat:keyword', NAMESPACES)
    
    # Add topicCategory as keywords (extract from URI)
    topic_categories = root.findall('.//geodcatap:topicCategory', NAMESPACES)
    for topic in topic_categories:
        resource_uri = topic.get(f'{{{NAMESPACES["rdf"]}}}resource', '')
        if resource_uri:
            # Extract the last part of the URI (e.g., "farming" from ".../TopicCategory/farming")
            category = resource_uri.split('/')[-1]
            if category:
                keywords.append(category)

    # Add topicCategory as properties (stored as strings - IDs only)
    # Names are added by the API using topic_mapping.py
    topic_categories = root.findall('.//geodcatap:topicCategory', NAMESPACES)
    if topic_categories:
        topics = []
        for topic in topic_categories:
            resource_uri = topic.get(f'{{{NAMESPACES["rdf"]}}}resource', '')
            if resource_uri:
                # Extract the last part of the URI (e.g., "farming" from ".../TopicCategory/farming")
                category = resource_uri.split('/')[-1]
                if category:
                    topics.append(category)  # Store as string, not object
    
    if topics:
        stac_item["properties"]["deltares:topics"] = topics
    
    if keywords:
        stac_item['properties']['keywords'] = keywords
    
    # License/Rights
    rights = extract_text(root, './/dct:rights/dct:RightsStatement/dct:description', NAMESPACES)
    if rights:
        stac_item['properties']['license'] = rights
    
    # Access rights
    access_rights = extract_text(root, './/dct:accessRights/dct:RightsStatement/dct:description', NAMESPACES)
    if access_rights:
        stac_item['properties']['access_rights'] = access_rights
    
    # Provenance
    provenance = extract_text(root, './/dct:provenance/dct:ProvenanceStatement/dct:description', NAMESPACES)
    if provenance:
        stac_item['properties']['provenance'] = provenance
    
    # Theme/Topic
    theme = extract_text(root, './/dcat:theme/skos:Concept/skos:prefLabel', NAMESPACES)
    if theme:
        stac_item['properties']['theme'] = theme
    
    # Status
    status = extract_text(root, './/adms:status/skos:Concept/skos:prefLabel', NAMESPACES)
    if status:
        stac_item['properties']['status'] = status
    
    # Language
    lang_elem = root.find('.//dct:language/dct:LinguisticSystem', NAMESPACES)
    if lang_elem is not None:
        lang_code = lang_elem.get(f'{{{NAMESPACES["rdf"]}}}about', '')
        if 'ENG' in lang_code.upper():
            stac_item['properties']['language'] = 'en'
    
    # Version
    version = extract_text(root, './/dcat:version', NAMESPACES)
    if version:
        stac_item['properties']['version'] = version
    
    # Contact/Provider info
    contact = root.find('.//dcat:contactPoint/rdf:Description', NAMESPACES)
    if contact is not None:
        contact_name = extract_text(contact, './vcard:fn', NAMESPACES)
        org_name = extract_text(contact, './/vcard:organisation-name', NAMESPACES)
        email = contact.find('./vcard:hasEmail', NAMESPACES)
        
        contact_info = {}
        if contact_name:
            contact_info['name'] = contact_name
        if org_name:
            contact_info['organization'] = org_name
        if email is not None:
            email_addr = email.get(f'{{{NAMESPACES["rdf"]}}}resource', '').replace('mailto:', '')
            if email_addr:
                contact_info['email'] = email_addr
        
        if contact_info:
            stac_item['properties']['contact'] = contact_info
    
    # Parse distributions as assets
    distributions = parse_distributions(root, NAMESPACES)
    for i, dist in enumerate(distributions):
        # Create asset key from title or index
        key = dist.get('title', f'asset_{i}').lower().replace(' ', '_')
        asset = {
            'href': dist['href']
        }
        if dist.get('title'):
            asset['title'] = dist['title']
        if dist.get('description'):
            asset['description'] = dist['description']
        
        # Determine type and roles based on URL and service type
        href_lower = dist['href'].lower()
        
        if dist.get('type') == 'wms':
            asset['type'] = 'application/vnd.ogc.wms_xml'
            asset['roles'] = ['visual']
        elif href_lower.endswith('.pdf'):
            asset['type'] = 'application/pdf'
            asset['roles'] = ['metadata']
        elif href_lower.endswith('.zip'):
            asset['type'] = 'application/zip'
            asset['roles'] = ['data']
        elif href_lower.endswith('.geojson') or href_lower.endswith('.json'):
            asset['type'] = 'application/geo+json'
            asset['roles'] = ['data']
        elif href_lower.endswith('.tif') or href_lower.endswith('.tiff'):
            asset['type'] = 'image/tiff; application=geotiff'
            asset['roles'] = ['data']
        elif href_lower.endswith('.shp'):
            asset['type'] = 'application/vnd.shp'
            asset['roles'] = ['data']
        elif 'wms' in href_lower or 'service=wms' in href_lower:
            asset['type'] = 'application/vnd.ogc.wms_xml'
            asset['roles'] = ['visual']
        elif 'wfs' in href_lower or 'service=wfs' in href_lower:
            asset['type'] = 'application/vnd.ogc.wfs_xml'
            asset['roles'] = ['data']
        else:
            asset['roles'] = ['data']
        
        stac_item['assets'][key] = asset
    
    # Parse links
    links = parse_links(root, NAMESPACES)
    stac_item['links'].extend(links)
    
    # Add self link (placeholder)
    stac_item['links'].append({
        'rel': 'self',
        'href': f'./{stac_item["id"]}.json'
    })
    
    return stac_item


def process_folder(input_folder: Path, output_folder: Path):
    """Process all XML files in a folder."""
    
    if not input_folder.exists():
        print(f"Error: Input folder '{input_folder}' does not exist")
        sys.exit(1)
    
    output_folder.mkdir(parents=True, exist_ok=True)
    
    xml_files = list(input_folder.glob('*.xml'))
    
    if not xml_files:
        print(f"No XML files found in '{input_folder}'")
        sys.exit(1)
    
    print(f"Found {len(xml_files)} XML file(s)")
    
    for xml_file in xml_files:
        print(f"Processing: {xml_file.name}")
        try:
            stac_item = convert_dcat_to_stac(xml_file)
            
            # Write output JSON
            output_file = output_folder / f"{stac_item['id']}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(stac_item, f, indent=2, ensure_ascii=False)
            
            print(f"  → Created: {output_file.name}")
            
        except Exception as e:
            print(f"  ✗ Error processing {xml_file.name}: {e}")
    
    print(f"\nConversion complete. Output saved to: {output_folder}")


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: python dcat_to_stac.py <input_folder> [output_folder]")
        print("\nExample:")
        print("  python dcat_to_stac.py ./xml_files ./stac_output")
        sys.exit(1)
    
    input_folder = Path(sys.argv[1])
    output_folder = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('./stac_output')
    
    process_folder(input_folder, output_folder)


if __name__ == '__main__':
    main()