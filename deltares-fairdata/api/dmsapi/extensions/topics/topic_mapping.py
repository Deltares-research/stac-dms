"""
ISO 19115 TopicCategory ID to Name mapping.

This mapping provides human-readable names for ISO 19115 TopicCategory codes
used in DCAT XML files. The TopicCategory codes come from the INSPIRE metadata
codelist: http://inspire.ec.europa.eu/metadata-codelist/TopicCategory/

Based on ISO 19115:2003 Geographic information — Metadata standard.
"""

# ISO 19115 TopicCategory mapping: ID -> Display Name
TOPIC_NAMES = {
    # Standard ISO 19115 TopicCategory codes
    "farming": "Farming",
    "biota": "Biota",
    "boundaries": "Boundaries",
    "climatologyMeteorologyAtmosphere": "Climatology, Meteorology, Atmosphere",
    "economy": "Economy",
    "elevation": "Elevation",
    "environment": "Environment",
    "geoscientificInformation": "Geoscientific Information",
    "health": "Health",
    "imageryBaseMapsEarthCover": "Imagery, Base Maps, Earth Cover",
    "inlandWaters": "Inland Waters",
    "intelligenceMilitary": "Intelligence Military",
    "location": "Location",
    "oceans": "Oceans",
    "planningCadastre": "Planning Cadastre",
    "society": "Society",
    "structure": "Structure",
    "transportation": "Transportation",
    "utilitiesCommunication": "Utilities Communication",
    
    # Custom topics found in your data (non-standard values)
    "Soil composition": "Soil Composition",
    "Precipitation": "Precipitation",
    "DEM": "Digital Elevation Model",
    "Land use": "Land Use",
    "Land Cover": "Land Cover",
    "Water quality": "Water Quality",
}


def get_topic_name(topic_id: str) -> str:
    """
    Get the human-readable name for a topic ID.
    
    Args:
        topic_id: The topic category ID (e.g., "geoscientificInformation")
        
    Returns:
        The human-readable name, or the ID itself if no mapping exists
    """
    return TOPIC_NAMES.get(topic_id, topic_id)
