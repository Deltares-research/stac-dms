<template>
  <div style="display: none;">
    <!-- This component doesn't render anything, it just manages MapboxDraw -->
  </div>
</template>

<script setup>
  import { watch, onBeforeUnmount } from 'vue'
  import MapboxDraw from '@mapbox/mapbox-gl-draw'
  import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

  const props = defineProps({
    map: {
      type: Object,
      default: null,
    },
    drawMode: {
      type: String,
      default: null,
    },
  })

  const emit = defineEmits(['change'])

  let mbDraw = null

  // Define custom styles manually (since we can't import from src/lib/theme)
  const customStyles = [
    // Inactive polygon fill
    {
      id: 'gl-draw-polygon-fill-inactive',
      type: 'fill',
      filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      paint: {
        'fill-color': '#008fc5',
        'fill-opacity': 0.5,
      },
    },
    // Active polygon fill
    {
      id: 'gl-draw-polygon-fill-active',
      type: 'fill',
      filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      paint: {
        'fill-color': '#008fc5',
        'fill-opacity': 0.5,
      },
    },
    // Static polygon fill
    {
      id: 'gl-draw-polygon-fill-static',
      type: 'fill',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      paint: {
        'fill-color': '#008fc5',
        'fill-opacity': 0.5,
      },
    },
    // Inactive polygon stroke
    {
      id: 'gl-draw-polygon-stroke-inactive',
      type: 'line',
      filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      paint: {
        'line-color': '#008fc5',
        'line-width': 5,
      },
    },
    // Active polygon stroke
    {
      id: 'gl-draw-polygon-stroke-active',
      type: 'line',
      filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
      paint: {
        'line-color': '#008fc5',
        'line-width': 5,
      },
    },
    // Static polygon stroke
    {
      id: 'gl-draw-polygon-stroke-static',
      type: 'line',
      filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
      paint: {
        'line-color': '#008fc5',
        'line-width': 5,
      },
    },
    // Vertex points
    {
      id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
      type: 'circle',
      filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
      paint: {
        'circle-radius': 5,
        'circle-color': '#fff',
      },
    },
    {
      id: 'gl-draw-polygon-and-line-vertex-inactive',
      type: 'circle',
      filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
      paint: {
        'circle-radius': 3,
        'circle-color': '#008fc5',
      },
    },
  ]

  // Watch for drawMode changes
  watch(
    () => props.drawMode,
    (mode) => {
      if (!props.map || !mbDraw) return
      
      if (mode === 'rectangle') {
        props.map.getCanvas().style.cursor = 'crosshair'
        mbDraw.changeMode('draw_rectangle')
      } else {
        props.map.getCanvas().style.cursor = ''
        mbDraw.changeMode('simple_select')
      }
    }
  )

  // Initialize MapboxDraw when map is available
  watch(
    () => props.map,
    (map) => {
      if (!map || mbDraw) return
      
      initializeDraw(map)
    },
    { immediate: true }
  )

  function initializeDraw(map) {
    const modes = MapboxDraw.modes
    modes.draw_rectangle = DrawRectangle

    mbDraw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        trash: true,
      },
      modes,
      styles: customStyles, // Use the manually defined styles
    })

    map.addControl(mbDraw)

    // Listen to draw events
    const onChangeFn = () => {
      const { features } = mbDraw.getAll()
      const feature = features[0] || null
      emit('change', feature)
    }

    map
      .on('draw.create', onChangeFn)
      .on('draw.delete', onChangeFn)
      .on('draw.update', onChangeFn)
  }

  onBeforeUnmount(() => {
    if (mbDraw && props.map) {
      props.map.removeControl(mbDraw)
      mbDraw = null
    }
  })

  // Expose methods for parent component
  defineExpose({
    clear: () => {
      if (mbDraw) {
        mbDraw.deleteAll()
      }
    },
    getDraw: () => mbDraw,
  })
</script>

<style>
  /* Hide the default draw controls */
  .mapbox-gl-draw_ctrl-draw-btn {
    display: none !important;
  }
</style>

