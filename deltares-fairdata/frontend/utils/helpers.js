function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export function formatDateWithOrdinal(dateStr) {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null
    
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const day = date.getDate()
    const year = date.getFullYear()
    const suffix = getOrdinalSuffix(day)
    
    return `${ month } ${ day }${ suffix }, ${ year }`
  } catch {
    return null
  }
}

export function formatDate(feature) {
  if (!feature?.properties) return '—'
  
  const props = feature.properties
  const startDate = props.start_datetime
  const endDate = props.end_datetime
  const singleDate = props.datetime
  
  if (startDate && endDate) {
    const startFormatted = formatDateWithOrdinal(startDate)
    const endFormatted = formatDateWithOrdinal(endDate)
    if (startFormatted && endFormatted) {
      return `${ startFormatted } - ${ endFormatted }`
    }
    if (startFormatted) return startFormatted
    if (endFormatted) return endFormatted
  }
  
  if (startDate && !endDate) {
    const formatted = formatDateWithOrdinal(startDate)
    if (formatted) return formatted
  }
  
  if (endDate && !startDate) {
    const formatted = formatDateWithOrdinal(endDate)
    if (formatted) return formatted
  }
  
  if (singleDate) {
    const formatted = formatDateWithOrdinal(singleDate)
    if (formatted) return formatted
  }
  
  return '—'
}

export function firstAssetHref(feature) {
  const assets = feature?.assets
  if (!assets) return null
  const firstKey = Object.keys(assets)[0]
  return firstKey ? assets[firstKey]?.href : null
}

/**
 * Parse and validate coordinate input string
 * @param {string} input - Coordinate input string (e.g., "40.7128, -74.0060")
 * @param {boolean} latLongOrder - If true, input is lat/lng, if false, input is lng/lat
 * @returns {{ coordinates: Array<[number, number]> | null, isValid: boolean, message: string }}
 */
export function parseAndValidateCoordinates(input, latLongOrder = true) {
  if (!input || !input.trim()) {
    return {
      coordinates: null,
      isValid: false,
      message: '',
    }
  }

  try {
    const cleaned = input.trim()
    const lines = cleaned.split(/\n/).filter(line => line.trim())
    const coordinates = []

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length !== 2) {
        throw new Error(`Invalid coordinate format: "${ line }"`)
      }

      const coord1 = parseFloat(parts[0])
      const coord2 = parseFloat(parts[1])

      if (isNaN(coord1) || isNaN(coord2)) {
        throw new Error(`Invalid numbers in: "${ line }"`)
      }

      // GeoJSON uses [lng, lat] format
      if (latLongOrder) {
        coordinates.push([ coord2, coord1 ]) // Convert lat/lng to lng/lat
      } else {
        coordinates.push([ coord1, coord2 ]) // Already lng/lat
      }
    }

    if (coordinates.length === 0) {
      throw new Error('No valid coordinates found')
    }

    let detectedType = 'Point'
    if (coordinates.length === 2) {
      detectedType = 'Rectangle'
    } else if (coordinates.length > 2) {
      detectedType = 'Polygon'
    }

    return {
      coordinates,
      isValid: true,
      message: `Detected: ${ detectedType } with ${ coordinates.length } point${ coordinates.length > 1 ? 's' : '' }`,
    }
  } catch (error) {
    return {
      coordinates: null,
      isValid: false,
      message: error.message || 'Invalid coordinate format',
    }
  }
}

/**
 * Create GeoJSON geometry from parsed coordinates
 * @param {Array<[number, number]>} coordinates - Array of coordinate pairs [lng, lat]
 * @returns {Object | null} GeoJSON geometry object
 */
export function createGeometryFromCoordinates(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null
  }

  if (coordinates.length === 1) {
    // Point
    return {
      type: 'Point',
      coordinates: coordinates[0],
    }
  } else if (coordinates.length === 2) {
    // Rectangle - create polygon from NW and SE corners
    const [ nw, se ] = coordinates
    return {
      type: 'Polygon',
      coordinates: [ [
        [ nw[0], nw[1] ], // NW
        [ se[0], nw[1] ], // NE
        [ se[0], se[1] ], // SE
        [ nw[0], se[1] ], // SW
        [ nw[0], nw[1] ], // Close polygon
      ] ],
    }
  } else {
    // Polygon - close the shape
    const coords = [ ...coordinates ]
    coords.push(coords[0]) // Close the polygon
    return {
      type: 'Polygon',
      coordinates: [ coords ],
    }
  }
}

