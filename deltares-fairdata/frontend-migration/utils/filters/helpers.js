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

// -------------- tiny helpers --------------
/**
 * Convert a Date or date-like value to ISO 8601 (UTC) string.
 * Returns `undefined` for invalid inputs.
 * @param {Date|string|number|null|undefined} input
 * @returns {string|undefined}
 * @example
 * toIso(new Date())            // '2025-09-23T10:15:30.123Z'
 * toIso('2025-09-23')          // '2025-09-23T00:00:00.000Z'
 * toIso(null)                  // undefined
 */
export function toIso(input) {
  if (!input) return undefined
  const d = input instanceof Date ? input : new Date(input)
  return isNaN(d) ? undefined : d.toISOString()
}
