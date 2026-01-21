# STAC Conversion and Upload Scripts

This directory contains scripts for converting DCAT XML metadata files to STAC (SpatioTemporal Asset Catalog) format and uploading them to a STAC API.

## Overview

The conversion pipeline consists of two main scripts:

1. **`dcat_to_stac.py`** - Converts DCAT XML files to STAC Item JSON format
2. **`stac_uploader.py`** - Uploads STAC Items to a STAC API endpoint

## Required Files

- **DCAT XML files** - Source metadata files in DCAT format (typically in `input/geodcat/` folder)


## Usage

### Step 1: Convert DCAT XML to STAC JSON

```bash
# Convert XML files from input/geodcat/ to stac_output/
python dcat_to_stac.py input/geodcat stac_output
```

**What it does:**
- Reads all `.xml` files from the input folder
- Extracts metadata (title, description, bbox, dates, topics, etc.)
- Converts ISO 19115 TopicCategory codes to objects with `id`
- Outputs STAC Item JSON files to the output folder

### Step 2: Upload STAC Items to API

Upload converted STAC items to your STAC API:

```bash
# Upload items to local API
python stac_uploader.py upload http://localhost:8080 my-collection stac_output

# Upload to local API with collection creation and all options
python stac_uploader.py upload http://localhost:8000 stars4water ./stac_output \
    --create-collection \
    --collection-title "Stars4Water" \
    --collection-description "STARS4Water aims to improve the understanding of climate change impacts on water resources availability and the vulnerabilities for ecosystems, society and the economy at river basin scale" \
    --force-feature

# Upload to production API with authentication
python stac_uploader.py upload https://api.example.com my-collection stac_output --api-key YOUR_KEY
```

**Options:**
- `--create-collection` - Create collection if it doesn't exist
- `--collection-title "Title"` - Title for new collection
- `--collection-description "Description"` - Description for new collection
- `--delay 0.1` - Delay between uploads (seconds)
- `--api-key KEY` - API key for authentication

### Other Operations

**Delete items based on JSON files:**
```bash
python stac_uploader.py delete <api_url> <collection_id> <folder>
```

**Delete ALL items in a collection:**
```bash
python stac_uploader.py delete-all <api_url> <collection_id>
```


### Topic Storage Format

Topics are stored in STAC items as strings (IDs only):

## Output Structure

### STAC Item Structure

```json
{
  "type": "Feature",
  "stac_version": "1.0.0",
  "id": "uuid-here",
  "geometry": {...},
  "bbox": [min_lon, min_lat, max_lon, max_lat],
  "properties": {
    "title": "...",
    "description": "...",
    "datetime": "2020-01-01T00:00:00Z",
    "deltares:topics": [
      id,...
    ],
    ...
  },
  "assets": {...},
  "links": [...]
}
```

