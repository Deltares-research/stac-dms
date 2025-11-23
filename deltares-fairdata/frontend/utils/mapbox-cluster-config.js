/**
 * Mapbox cluster configuration constants
 */

export const unclusteredPointLayout = {
  'icon-image': 'custom-marker',
  'icon-size': 0.04,
  'icon-allow-overlap': true,
  'icon-anchor': 'bottom',
}

export const unclusteredPointPaint = {}

export const clustersPaint = {
  'circle-color': '#51bbd6',
  'circle-radius': [
    'step',
    [ 'get', 'point_count' ],
    20, // radius for clusters with < 100 points
    30, // radius for clusters with < 750 points
    40, // radius for clusters >= 750 points
  ],
}

export const clusterCountLayout = {
  'text-field': [ 'get', 'point_count_abbreviated' ],
  'text-font': [ 'Open Sans Semibold', 'Arial Unicode MS Bold' ],
  'text-size': 12,
}

export const clusterCountPaint = {
  'text-color': '#fff',
}
