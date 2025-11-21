import { getType } from '@turf/invariant'

export default (featureCollection) => {
  // At this point I assume that the featureCollection is a valid GeoJSON feature collection
  // and that the features are all points or polygons
  const feature = featureCollection.features[0]
  const type = getType(feature)
  
  if (type === 'Point') {
    return {
      id: 'features-collection',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: featureCollection,
      },
      layout: {
        'icon-image': 'custom-marker',
        'icon-size': 0.04,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
      paint: {},
    }
  }
  
  if (type === 'Polygon' || type === 'MultiPolygon') {
    // For polygons, we need to return an array with both fill and line layers
    // to match the finished polygon style from draw-style.js
    return [
      {
        id: 'features-collection-fill',
        type: 'fill',
        source: {
          type: 'geojson',
          data: featureCollection,
        },
        paint: {
          'fill-color': '#008fc5',
          'fill-outline-color': '#008fc5',
          'fill-opacity': 0.2,
        },
      },
      {
        id: 'features-collection-stroke',
        type: 'line',
        source: {
          type: 'geojson',
          data: featureCollection,
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#ff0000', // Red line when finished (from draw-style.js)
          'line-width': 2,
        },
      },
    ]
  }
  
  return null
}