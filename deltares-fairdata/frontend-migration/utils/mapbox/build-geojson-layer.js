export default (data) => {
  console.log('data', data)
  return {
    id: 'features-collection',
    type: 'circle',
    source: {
      type: 'geojson',
      data,
    },
    'paint': {
      'circle-radius': 6,
      'circle-color': '#B42222',
    },
  }
}