// Individual filter block builders that will be used to compose the filter.  

import {
  SEARCH_PROPS,
  WORLD_POLY,
} from './helpers.js'
import { bboxPolygon } from '@turf/turf'

import dateFormat from 'dateformat'
/**
 * Build a text "OR" filter over many fields using SQL-like LIKE semantics.
 * Empty string becomes '%%' to match anything.
 *
 * Example output shape:
 * {
 *   op: 'or',
 *   args: [
 *     { op: 'like', args: [{ property: 'properties.title' }, '%wind%'] },
 *     { op: 'like', args: [{ property: 'properties.description' }, '%wind%'] },
 *     ...
 *   ]
 * }
 *
 * @param {string} [q=''] - The query text.
 * @returns {{op:'or', args: Array<{op:'like', args:[{property:string}, string]}>}}
 */
export function textFilter(q = '') {
  const likeValue = q === '' ? '%%' : `%${ q }%`
  return {
    op: 'or',
    args: SEARCH_PROPS.map((property) => ({
      op: 'like',
      args: [ { property }, likeValue ],
    })),
  }
}

/**
 * Geometry filter using spatial intersects on a bbox polygon.
 * Optionally includes an extra branch to match records with *no* geometry,
 * implemented as NOT s_intersects(geometry, WORLD_POLY).
 *
 * 

 *
 * @param {import('./filterBlocks.js').BBox|undefined} bbox
 * @param {{ includeEmptyGeometry?: boolean }} [opts]
 * @returns { {op:'or', args:any[]} | {op:'not', args:any[]} | undefined }
 */
export function geometryFilter(bbox, { includeEmptyGeometry = false } = {}) {
    

  const geom = bbox.value ? bboxPolygon(bbox.value).geometry : undefined 
 
  const geomArgs = [
    geom
      ? {
        op: 's_intersects',
        args: [
          {
            property: 'geometry',
          },
          geom,
        ],
      }
      : undefined,
    // The isNull operator does not work. The below is a workaround. It includes items that have no geometry by intersecting with a Polygon that covers the entire world.
    includeEmptyGeometry
      ? {
        op: 'not',
        args: [
          {
            op: 's_intersects',
            args: [
              {
                property: 'geometry',
              },
              {
                type: 'Polygon',
                WORLD_POLY,
              },
            ],
          },
        ],
      }
      : undefined,
  ].filter(Boolean)
 

  return { op: 'or', args: geomArgs }
}

/**
 * Keywords filter.
 * Expects keyword IDs and targets properties.keywords.id.
 *
 * @param {string[]|number[]} keywords
 * @returns {{op:'in', args:[{property:string}, (string[]|number[])]} | undefined}
 */
export function keywordsFilter(keywords) {
  if (!Array.isArray(keywords) || keywords.length === 0) return undefined
  return { op: 'in', args: [ { property: 'properties.keywords.id' }, keywords ] }
}

/**
 * Date/time filter that supports either:
 * - a single datetime field: properties.datetime
 * - a start/end range: properties.start_datetime .. properties.end_datetime
 *
 * If start or end is missing, sensible wide defaults are used to keep the filter valid.
 *
 * @param {Date|string|number|undefined} start
 * @param {Date|string|number|undefined} end
 * @returns {{op:'or', args:any[]} | undefined}
 */
export function dateFilter(startDate, endDate) {
  
  if (!startDate && !endDate) return undefined

  const startDateIso = dateFormat(startDate, 'isoUtcDateTime') || '1900-01-01T00:00:00Z'
  const endDateIso = dateFormat(endDate, 'isoUtcDateTime') || '9999-12-31T23:59:59Z'

  return {
    op: 'or',
    args: [
      // Case 1: single datetime field in range
      {
        op: 'and',
        args: [
          { op: '>=', args: [ { property: 'properties.datetime' }, startDateIso ] },
          { op: '<=', args: [ { property: 'properties.datetime' }, endDateIso ] },
        ],
      },
      // Case 2: overlapping range between [start_datetime, end_datetime] and [startIso, endIso]
      {
        op: 'and',
        args: [
          { op: '>=', args: [ { property: 'properties.start_datetime' }, startDateIso ] },
          { op: '<=', args: [ { property: 'properties.end_datetime' }, endDateIso ] },
        ],
      },
    ],
  }
}

/**
 * Compose your final CQL2-JSON filter with the blocks you want.
 * Pass only the params you need; undefined blocks are ignored.
 */
export function buildFilter({ q = '', bbox, includeEmptyGeometry = false, keywords = [], startDate, endDate } = {}) {
  return [
    geometryFilter(bbox, { includeEmptyGeometry }),
    textFilter(q),
    keywordsFilter(keywords),
    dateFilter(startDate, endDate),
  ]
}
