<template></template>

<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  map: { type: Object, default: null },             // Mapbox GL JS instance
  features: { type: Array, default: () => [] },     // Array<GeoJSON Feature>
  idPrefix: { type: String, default: 'polygons' },  // allow multiple instances if needed
})

const sourceId = `${props.idPrefix}-source`
const fillId   = `${props.idPrefix}-fill`
const lineId   = `${props.idPrefix}-outline`

const fc = computed(() => ({
  type: 'FeatureCollection',
  features: (props.features || []).filter(f => f && f.type === 'Feature'),
}))

function ensureLayers() {
  const map = props.map
  if (!map || !map.isStyleLoaded()) return false

  // Source
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: fc.value })
  } else {
    map.getSource(sourceId).setData(fc.value)
  }

  // Fill layer (polygons)
  if (!map.getLayer(fillId)) {
    map.addLayer({
      id: fillId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#2f80ed',
        'fill-opacity': 0.25,
      },
    })
  }

  // Outline layer
  if (!map.getLayer(lineId)) {
    map.addLayer({
      id: lineId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#2f80ed',
        'line-width': 2,
      },
    })
  }

  // Cursor feedback (avoid duplicate handlers)
  const onEnter = () => (map.getCanvas().style.cursor = 'pointer')
  const onLeave = () => (map.getCanvas().style.cursor = '')
  map.off('mouseenter', fillId, onEnter)
  map.off('mouseleave', fillId, onLeave)
  map.on('mouseenter', fillId, onEnter)
  map.on('mouseleave', fillId, onLeave)

  return true
}

function updateData() {
  const map = props.map
  if (!map) return
  const src = map.getSource(sourceId)
  if (src) src.setData(fc.value)
}

function destroy() {
  const map = props.map
  if (!map) return
  if (map.getLayer(lineId)) map.removeLayer(lineId)
  if (map.getLayer(fillId)) map.removeLayer(fillId)
  if (map.getSource(sourceId)) map.removeSource(sourceId)
}

onMounted(() => {
  const map = props.map
  if (!map) return

  // Initial add
  if (map.isStyleLoaded()) ensureLayers()
  else map.once('style.load', ensureLayers)

  // Recreate layers after any style change (e.g. setStyle)
  const readd = () => { destroy(); ensureLayers() }
  map.on('style.load', readd)

  // Save cleaner to instance for unmount
  onBeforeUnmount(() => {
    map.off('style.load', readd)
    destroy()
  })
})

// Keep data fresh
watch(fc, () => updateData(), { immediate: true, deep: true })
</script>
