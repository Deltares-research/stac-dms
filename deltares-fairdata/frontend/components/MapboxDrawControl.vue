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
  import drawStyle from '@/utils/draw-style'
  import StaticMode from '@/utils/static-mode'
  import MapboxButtonControl from '@/utils/MapboxButtonControl'

  const props = defineProps({
    map: {
      type: Object,
      default: null,
    },
    drawMode: {
      type: String,
      default: null, // null, 'polygon', or 'rectangle'
    },
    position: {
      type: String,
      default: 'top-left',
    },
    active: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['change', 'toggle'])

  let mbDraw = null
  let polygonButtonControl = null
  let trashButtonControl = null

  // Watch for drawMode changes
  watch(
    () => props.drawMode,
    (mode) => {
      if (!props.map || !mbDraw) return
      
      if (mode === 'rectangle') {
        props.map.getCanvas().style.cursor = 'crosshair'
        mbDraw.changeMode('draw_rectangle')
      } else if (mode === 'polygon') {
        props.map.getCanvas().style.cursor = 'crosshair'
        mbDraw.changeMode('draw_polygon')
      } else {
        props.map.getCanvas().style.cursor = ''
        mbDraw.changeMode('simple_select')
      }

      // Update polygon button icon and label when mode changes
      if (polygonButtonControl && polygonButtonControl._btn) {
        const polygonIcon = mode === 'rectangle' ? 'mdi-rectangle-outline' : 'mdi-vector-polygon'
        const polygonLabel = mode === 'rectangle' ? 'Teken een rechthoek' : 'Teken een polygoon'
        polygonButtonControl._btn.innerHTML = `<i aria-hidden="true" class="v-icon notranslate mdi ${ polygonIcon } theme--light"></i>`
        polygonButtonControl._btn.setAttribute('title', polygonLabel)
      }
    }
  )

  // Watch for highlighted prop changes
  watch(
    () => props.highlighted,
    (highlighted) => {
      if (polygonButtonControl && polygonButtonControl._btn) {
        if (highlighted) {
          polygonButtonControl._btn.classList.add('mapbox-gl-draw-polygon-control--highlighted')
        } else {
          polygonButtonControl._btn.classList.remove('mapbox-gl-draw-polygon-control--highlighted')
        }
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
    modes.static = StaticMode

    mbDraw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false, // Disable default controls - we'll use custom buttons
        trash: false,
      },
      defaultMode: 'simple_select',
      modes,
      styles: drawStyle,
    })

    map.addControl(mbDraw, props.position)
    
    // Store reference on map for external access
    map.__draw = mbDraw

    // Create custom polygon button
    const polygonIcon = props.drawMode === 'rectangle' ? 'mdi-rectangle-outline' : 'mdi-vector-polygon'
    const polygonLabel = props.drawMode === 'rectangle' ? 'Teken een rechthoek' : 'Teken een polygoon'
    
    polygonButtonControl = new MapboxButtonControl({
      className: `mapbox-gl-draw-polygon-control ${ props.highlighted ? 'mapbox-gl-draw-polygon-control--highlighted' : '' }`,
      icon: polygonIcon,
      eventHandler: () => {
        // Toggle between polygon and rectangle, or activate drawing
        if (props.drawMode === 'rectangle') {
          mbDraw.changeMode('draw_rectangle')
        } else {
          mbDraw.changeMode('draw_polygon')
        }
        emit('toggle', true)
      },
      title: polygonLabel,
    })

    map.addControl(polygonButtonControl, props.position)

    // Create custom trash button
    trashButtonControl = new MapboxButtonControl({
      className: 'mapbox-gl-draw-trash-control',
      icon: 'mdi-delete',
      eventHandler: () => {
        mbDraw.deleteAll()
        emit('change', null)
      },
      title: 'Wis alles',
    })

    map.addControl(trashButtonControl, props.position)

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
      .on('draw.selectionchange', onChangeFn) // Listen for selection changes

    map.on('draw.modechange', () => {
      emit('toggle', true)
    })
  }

  onBeforeUnmount(() => {
    if (polygonButtonControl && props.map) {
      props.map.removeControl(polygonButtonControl)
      polygonButtonControl = null
    }
    if (trashButtonControl && props.map) {
      props.map.removeControl(trashButtonControl)
      trashButtonControl = null
    }
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
  /* Hide default MapboxDraw controls */
  .mapbox-gl-draw_ctrl-draw-btn,
  .mapbox-gl-draw_ctrl-trash {
    display: none !important;
  }

  /* Style custom polygon button */
  .mapboxgl-ctrl-icon.mapbox-gl-draw-polygon-control {
    border-radius: 4px;
    background-color: #fff;
  }

  .mapbox-gl-draw-polygon-control i::before {
    color: #000;
  }

  .mapbox-gl-draw-polygon-control--highlighted {
    background: #008fc5 !important;
    border-radius: 4px;
  }

  .mapbox-gl-draw-polygon-control--highlighted i::before {
    color: #fff;
  }

  .mapbox-gl-draw-polygon-control:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  .mapbox-gl-draw-polygon-control:disabled i::before {
    color: #999 !important;
  }

  /* Style custom trash button */
  .mapboxgl-ctrl-icon.mapbox-gl-draw-trash-control {
    border-radius: 4px;
    background-color: #fff;
  }

  .mapbox-gl-draw-trash-control i::before {
    color: #000;
  }

  .mapbox-gl-draw-trash-control:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  .mapbox-gl-draw-trash-control:disabled i::before {
    color: #999 !important;
  }
</style>

