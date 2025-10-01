<script setup>
import { ref } from 'vue'
import { MapboxMap } from '@studiometa/vue-mapbox-gl'
import PolygonsLayer from '@/components/PolygonsLayer.vue'

const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const props = defineProps({
  polygons: { type: Array, default: () => [] }, // Array<Feature>
})

const mapRef = ref(null)

function onMapCreated(map) {
  mapRef.value = map
  console.log('🗺️ Map created', map)

  // Optional: fit to polygons on first load
  if (props.polygons?.length) {
    try {
      const bbox = computeBbox(props.polygons)
      if (bbox) map.fitBounds(bbox, { padding: 40, duration: 500 })
    } catch (e) {
      console.warn('fitBounds skipped:', e)
    }
  }
}

// tiny helper – works for Polygon & MultiPolygon
function computeBbox(features) {
  const coords = []
  for (const f of features) {
    const g = f?.geometry
    if (!g) continue
    if (g.type === 'Polygon') coords.push(...g.coordinates.flat())
    else if (g.type === 'MultiPolygon') coords.push(...g.coordinates.flat(2))
  }
  if (!coords.length) return null
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const [x, y] of coords) {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  return [[minX, minY], [maxX, maxY]]
}
</script>

<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapRef"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/light-v11"
      :center="[5.1, 52.07]"
      :zoom="10.5"
      @mb-created="onMapCreated"
    >
      <PolygonsLayer :map="mapRef" :features="polygons" />
    </mapbox-map>
  </div>
</template>

<style>
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>
