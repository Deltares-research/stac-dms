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

