<template>
  <div style="display: none;">
    <!-- This component doesn't render anything, it just manages MapboxDraw -->
  </div>
</template>

<script setup>
  import { watch, onBeforeUnmount } from 'vue'
  import MapboxDraw from '@mapbox/mapbox-gl-draw'
  import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
  import styles from '@mapbox/mapbox-gl-draw/src/lib/theme'

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
      styles: styles.map(style => {
        // Customize fill color
        if ([
          'gl-draw-polygon-fill-active',
          'gl-draw-polygon-fill-inactive',
          'gl-draw-polygon-fill-static',
        ].includes(style.id)) {
          return {
            ...style,
            paint: {
              ...style.paint,
              'fill-color': '#008fc5',
              'fill-opacity': 0.5,
            },
          }
        }

        // Customize stroke color
        if ([
          'gl-draw-polygon-stroke-active',
          'gl-draw-polygon-stroke-inactive',
          'gl-draw-polygon-stroke-static',
        ].includes(style.id)) {
          return {
            ...style,
            paint: {
              ...style.paint,
              'line-color': '#008fc5',
              'line-width': 5,
            },
          }
        }
        return style
      }),
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

