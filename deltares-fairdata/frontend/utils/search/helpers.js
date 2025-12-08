// -------------- types --------------
/**
 * @typedef {[number, number, number, number]} BBox
 * A bounding box as [minX, minY, maxX, maxY] in lon/lat (WGS84).
 */

/**
 * @typedef {Object} GeoJSONPolygon
 * @property {'Polygon'} type
 * @property {number[][][]} coordinates
 */

// -------------- search properties --------------
/**
 * Properties that are searched across text fields.
 * Keep in sync the expected keys.
 * @type {string[]}
 */
export const SEARCH_PROPS = [
  'properties.title',
  'properties.description',
  'properties.projectNumber',
  'properties.spatialReferenceSystem',
  'properties.dataQualityInfoStatement',
  'properties.legalRestrictions',
  'properties.metadataStandardName',
  'properties.progressCode',
  'properties.language',
  'properties.originatorDataEmail',
  'properties.originatorDataOrganisation',
  'properties.originatorMetaDataOrganisation',
  'properties.originatorMetaDataEmail',
  'properties.license',
]

// -------------- world polygon --------------
/**
 * A world-covering polygon in WGS84, useful as a fallback Area Of Interest.
 * @type {GeoJSONPolygon}
 */
export const WORLD_POLY = {
  type: 'Polygon',
  coordinates: [ [
    [ -180, -90 ], [ 180, -90 ], [ 180, 90 ], [ -180, 90 ], [ -180, -90 ],
  ] ],
}
