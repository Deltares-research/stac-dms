export default (featureCollection) => {
  // Returns a line layer for polygons (no fill)
  return {
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
      'line-color': '#000000',
      'line-width': 2,
    },
  }
}
