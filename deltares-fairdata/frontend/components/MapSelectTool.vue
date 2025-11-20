<template>
  <div style="display: none;">
    <!-- This component doesn't render anything, it just manages map controls -->
  </div>
</template>

<script setup>
  import { watch, onBeforeUnmount, ref, unref, computed } from 'vue'
  import { useMap } from '@studiometa/vue-mapbox-gl'
  import MapboxDraw from '@mapbox/mapbox-gl-draw'
  import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
  import mapboxgl from 'mapbox-gl'
  import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
  import drawStyle from '@/utils/draw-style'
  import StaticMode from '@/utils/static-mode'
  import MapboxButtonControl from '@/utils/MapboxButtonControl'

  const props = defineProps({
    // Map can be provided as prop OR via useMap composable
    map: {
      type: Object,
      default: null,
    },
    // External control mode - when provided, component is controlled externally
    drawMode: {
      type: String,
      default: null, // null, 'polygon', 'rectangle', or 'marker'
    },
    // Show/hide the UI buttons (hide when externally controlled)
    showButtons: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: 'top-left',
    },
    enabledTools: {
      type: Array,
      default: () => ['polygon', 'rectangle', 'marker'],
      validator: (value) => {
        const validTools = ['polygon', 'rectangle', 'marker']
        return value.every(tool => validTools.includes(tool))
      },
    },
  })

  const emit = defineEmits(['change', 'error'])

  // Get map from composable if not provided as prop
  const { map: mapFromComposable } = useMap()
  
  // Use provided map or composable map
  const map = computed(() => props.map || mapFromComposable.value)
  
  // Determine if we're in external control mode
  const isExternalControl = computed(() => props.drawMode !== null)

  // Internal state
  const currentTool = ref(null) // 'polygon', 'rectangle', or 'marker'
  const currentDrawMode = ref(null) // 'polygon' or 'rectangle' for draw mode
  const mbDraw = ref(null)
  const marker = ref(null)
  const polygonButton = ref(null)
  const rectangleButton = ref(null)
  const markerButton = ref(null)
  const deleteButton = ref(null)
  let staticMode = false

  // Watch for external drawMode changes
  watch(
    () => props.drawMode,
    (mode) => {
      if (!isExternalControl.value) return
      const mapInstance = unref(map.value)
      if (!mapInstance || !mbDraw.value) return
      
      if (mode === 'rectangle') {
        mapInstance.getCanvas().style.cursor = 'crosshair'
        mbDraw.value.changeMode('draw_rectangle')
      } else if (mode === 'polygon') {
        mapInstance.getCanvas().style.cursor = 'crosshair'
        mbDraw.value.changeMode('draw_polygon')
      } else if (mode === 'marker') {
        mapInstance.getCanvas().style.cursor = 'crosshair'
        // For marker in external mode, we'll handle it via click handler
        mapInstance.on('click', handleExternalMarkerClick)
      } else {
        mapInstance.getCanvas().style.cursor = ''
        mbDraw.value.changeMode('simple_select')
        mapInstance.off('click', handleExternalMarkerClick)
      }
    }
  )

  // Initialize when map is available
  watch(
    () => map.value,
    (mapRef) => {
      const mapInstance = unref(mapRef)
      if (!mapInstance || mbDraw.value) return
      
      // Wait for map to be fully loaded before adding controls
      if (mapInstance.loaded && mapInstance.loaded()) {
        initializeControls(mapInstance)
      } else {
        mapInstance.once('load', () => {
          initializeControls(mapInstance)
        })
      }
    },
    { immediate: true }
  )

  function initializeControls(mapInstance) {
    // Initialize MapboxDraw
    const modes = MapboxDraw.modes
    modes.draw_rectangle = DrawRectangle
    modes.static = StaticMode

    mbDraw.value = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: false,
        trash: false,
      },
      defaultMode: 'simple_select',
      modes,
      styles: drawStyle,
    })

    mapInstance.addControl(mbDraw.value, props.position)
    mapInstance.__draw = mbDraw.value

    // Only create buttons if showButtons is true and not in external control mode
    if (!props.showButtons || isExternalControl.value) {
      // Listen to draw events only
      mapInstance
        .on('draw.create', handleDrawChange)
        .on('draw.delete', handleDrawChange)
        .on('draw.update', handleDrawChange)
        .on('draw.selectionchange', handleDrawChange)
        .on('draw.modechange', handleModeChange)
      return
    }

    // Create polygon button if enabled
    if (props.enabledTools.includes('polygon')) {
      polygonButton.value = new MapboxButtonControl({
        className: 'mapbox-gl-draw-polygon-control',
        icon: 'mdi-vector-polygon',
        eventHandler: () => handleToolClick('polygon'),
        title: 'Teken een polygoon',
      })
      mapInstance.addControl(polygonButton.value, props.position)
    }

    // Create rectangle button if enabled
    if (props.enabledTools.includes('rectangle')) {
      rectangleButton.value = new MapboxButtonControl({
        className: 'mapbox-gl-draw-rectangle-control',
        icon: 'mdi-rectangle-outline',
        eventHandler: () => handleToolClick('rectangle'),
        title: 'Teken een rechthoek',
      })
      mapInstance.addControl(rectangleButton.value, props.position)
    }

    // Create marker button if enabled
    if (props.enabledTools.includes('marker')) {
      marker.value = new mapboxgl.Marker({
        color: '#FF0000',
      })

      markerButton.value = new MapboxButtonControl({
        className: 'mapbox-gl-marker-control',
        icon: 'mdi-map-marker',
        eventHandler: () => handleToolClick('marker'),
        title: 'Plaats een speld op de kaart',
      })
      mapInstance.addControl(markerButton.value, props.position)
      mapInstance.__markerControl = {
        clear: clearMarker,
        setStaticMode: setStaticMode,
      }
    }

    // Create delete button
    deleteButton.value = new MapboxButtonControl({
      className: 'mapbox-gl-draw-trash-control',
      icon: 'mdi-delete',
      eventHandler: handleDelete,
      title: 'Wis alles',
    })
    mapInstance.addControl(deleteButton.value, props.position)

    // Listen to draw events
    mapInstance
      .on('draw.create', handleDrawChange)
      .on('draw.delete', handleDrawChange)
      .on('draw.update', handleDrawChange)
      .on('draw.selectionchange', handleDrawChange)
      .on('draw.modechange', handleModeChange)
  }

  // Handle marker click in external control mode
  function handleExternalMarkerClick(event) {
    const mapInstance = unref(map.value)
    if (props.drawMode !== 'marker' || !mapInstance) return

    const { lng, lat } = event.lngLat

    // Remove existing marker if any
    if (marker.value && marker.value._lngLat) {
      marker.value.remove()
    }

    // Set marker coordinates
    marker.value.setLngLat([lng, lat]).addTo(mapInstance)

    // Emit change event
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        lng,
        lat,
      },
    }

    emit('change', { tool: 'marker', feature, active: false })
  }

  function handleToolClick(tool) {
    if (staticMode || isExternalControl.value) return

    // If clicking the same tool, deactivate it
    if (currentTool.value === tool) {
      deactivateTool()
      return
    }

    // Deactivate current tool first
    if (currentTool.value) {
      deactivateTool()
    }

    // Activate new tool
    activateTool(tool)
  }

  function activateTool(tool) {
    if (isExternalControl.value) return
    const mapInstance = unref(map.value)
    if (!mapInstance || !mbDraw.value) return
    
    currentTool.value = tool

    if (tool === 'polygon' || tool === 'rectangle') {
      // Clear marker if active
      if (marker.value && marker.value._lngLat) {
        clearMarker()
      }

      // Ensure we're not in marker mode (remove click handler if it exists)
      mapInstance.off('click', handleMapClick)

      // Set draw mode
      currentDrawMode.value = tool
      mapInstance.getCanvas().style.cursor = 'crosshair'
      
      // Change to drawing mode - MapboxDraw will handle double-click automatically
      if (tool === 'polygon') {
        mbDraw.value.changeMode('draw_polygon')
      } else {
        mbDraw.value.changeMode('draw_rectangle')
      }

      // Highlight appropriate button
      updateButtonHighlight('polygon', tool === 'polygon')
      updateButtonHighlight('rectangle', tool === 'rectangle')
      updateButtonHighlight('marker', false)
    } else if (tool === 'marker') {
      // Clear any drawn features
      if (mbDraw.value) {
        mbDraw.value.deleteAll()
        mbDraw.value.changeMode('simple_select')
      }

      // Enable marker placement
      mapInstance.getCanvas().style.cursor = 'crosshair'
      
      // Register marker click handler
      mapInstance.on('click', handleMapClick)
      
      // Highlight marker button
      updateButtonHighlight('polygon', false)
      updateButtonHighlight('rectangle', false)
      updateButtonHighlight('marker', true)
    }

    emit('change', { tool, feature: null, active: true })
  }

  function deactivateTool() {
    if (isExternalControl.value) return
    const mapInstance = unref(map.value)
    if (!currentTool.value || !mapInstance) return

    const previousTool = currentTool.value
    currentTool.value = null
    currentDrawMode.value = null

    // Reset cursor
    mapInstance.getCanvas().style.cursor = ''

    // Reset draw mode to simple_select
    if (mbDraw.value) {
      mbDraw.value.changeMode('simple_select')
    }

    // Remove marker click handler
    mapInstance.off('click', handleMapClick)

    // Remove highlights
    updateButtonHighlight('polygon', false)
    updateButtonHighlight('rectangle', false)
    updateButtonHighlight('marker', false)

    emit('change', { tool: previousTool, feature: null, active: false })
  }

  function handleMapClick(event) {
    if (isExternalControl.value) return
    const mapInstance = unref(map.value)
    if (currentTool.value !== 'marker' || staticMode || !mapInstance) return

    const { lng, lat } = event.lngLat

    // Remove existing marker if any
    if (marker.value && marker.value._lngLat) {
      marker.value.remove()
    }

    // Set marker coordinates
    marker.value.setLngLat([lng, lat]).addTo(mapInstance)

    // Emit change event
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        lng,
        lat,
      },
    }

    emit('change', { tool: 'marker', feature, active: false })
    
    // Deactivate marker tool after placement
    deactivateTool()
  }

  function handleModeChange() {
    const mapInstance = unref(map.value)
    if (!mbDraw.value || !mapInstance) return

    const currentMode = mbDraw.value.getMode()
    
    // In external control mode, emit change when drawing completes
    if (isExternalControl.value) {
      if (currentMode === 'simple_select' && props.drawMode) {
        const { features } = mbDraw.value.getAll()
        const feature = features[0] || null
        if (feature) {
          emit('change', { tool: props.drawMode, feature, active: false })
        }
      }
      return
    }
    
    // If mode changed from drawing to simple_select, drawing was completed
    if (currentMode === 'simple_select' && (currentTool.value === 'polygon' || currentTool.value === 'rectangle')) {
      const { features } = mbDraw.value.getAll()
      const feature = features[0] || null
      
      if (feature) {
        // Drawing was completed - force MapboxDraw to refresh by updating the feature
        // This makes the polygon show red immediately, matching rectangle behavior
        setTimeout(() => {
          if (mbDraw.value && feature) {
            // Force MapboxDraw to re-render by setting the features again
            // This triggers a style update without selecting the feature
            const allFeatures = mbDraw.value.getAll()
            if (allFeatures.features && allFeatures.features.length > 0) {
              // Temporarily remove and re-add to force style refresh
              mbDraw.value.deleteAll()
              mbDraw.value.add(allFeatures)
            }
          }
        }, 10)
        
        // Deactivate tool
        currentTool.value = null
        currentDrawMode.value = null
        mapInstance.getCanvas().style.cursor = ''
        updateButtonHighlight('polygon', false)
        updateButtonHighlight('rectangle', false)
        
        emit('change', { tool: 'draw', feature, active: false })
      }
    }
  }

  function handleDrawChange() {
    const mapInstance = unref(map.value)
    if (!mbDraw.value || !mapInstance) return

    const { features } = mbDraw.value.getAll()
    const feature = features[0] || null

    // In external control mode, emit change directly
    if (isExternalControl.value) {
      emit('change', { tool: props.drawMode || 'draw', feature, active: false })
      return
    }

    if (feature) {
      // Feature was created/selected - keep it highlighted
      // Don't change mode here, let MapboxDraw handle it naturally
      
      // If we were in drawing mode and feature was just created, force repaint
      const currentMode = mbDraw.value.getMode()
      if (currentMode === 'simple_select' && (currentTool.value === 'polygon' || currentTool.value === 'rectangle')) {
        // Force map repaint to update styles immediately
        setTimeout(() => {
          if (mapInstance && mapInstance.triggerRepaint) {
            mapInstance.triggerRepaint()
          }
        }, 0)
        
        currentTool.value = null
        currentDrawMode.value = null
        mapInstance.getCanvas().style.cursor = ''
        updateButtonHighlight('polygon', false)
        updateButtonHighlight('rectangle', false)
      }
    }

    emit('change', { tool: currentTool.value || 'draw', feature, active: false })
  }

  function handleDelete() {
    // Clear all drawn features
    if (mbDraw.value) {
      mbDraw.value.deleteAll()
    }

    // Clear marker
    clearMarker()

    // Deactivate any active tool
    deactivateTool()

    emit('change', { tool: null, feature: null, active: false })
  }

  function clearMarker() {
    if (marker.value && marker.value._lngLat) {
      marker.value.remove()
    }
  }

  function updateButtonHighlight(buttonType, highlighted) {
    let buttonControl = null
    if (buttonType === 'polygon' && polygonButton.value) {
      buttonControl = polygonButton.value
    } else if (buttonType === 'rectangle' && rectangleButton.value) {
      buttonControl = rectangleButton.value
    } else if (buttonType === 'marker' && markerButton.value) {
      buttonControl = markerButton.value
    }

    if (buttonControl && buttonControl._btn) {
      if (highlighted) {
        buttonControl._btn.classList.add(`${buttonControl._className}--highlighted`)
      } else {
        buttonControl._btn.classList.remove(`${buttonControl._className}--highlighted`)
      }
    }
  }

  function setStaticMode(enabled) {
    staticMode = enabled

    // Disable all buttons
    const buttons = [polygonButton.value, rectangleButton.value, markerButton.value, deleteButton.value]
    buttons.forEach(button => {
      if (button && button._btn) {
        if (enabled) {
          button._btn.setAttribute('disabled', true)
          button._btn.style.opacity = '0.5'
          button._btn.style.cursor = 'not-allowed'
        } else {
          button._btn.removeAttribute('disabled')
          button._btn.style.opacity = ''
          button._btn.style.cursor = ''
        }
      }
    })

    // If enabling static mode and a tool is active, deactivate it
    if (enabled && currentTool.value) {
      deactivateTool()
    }
  }

  function clear() {
    handleDelete()
  }

  function getDraw() {
    return mbDraw.value
  }

  function getMarker() {
    return marker.value
  }

  onBeforeUnmount(() => {
    const mapInstance = unref(map.value)
    if (!mapInstance) return

    // Remove event listeners
    mapInstance.off('click', handleMapClick)
    mapInstance.off('click', handleExternalMarkerClick)
    mapInstance.off('draw.create', handleDrawChange)
    mapInstance.off('draw.delete', handleDrawChange)
    mapInstance.off('draw.update', handleDrawChange)
    mapInstance.off('draw.selectionchange', handleDrawChange)
    mapInstance.off('draw.modechange', handleModeChange)

    // Remove controls
    if (polygonButton.value) {
      mapInstance.removeControl(polygonButton.value)
    }
    if (rectangleButton.value) {
      mapInstance.removeControl(rectangleButton.value)
    }
    if (markerButton.value) {
      mapInstance.removeControl(markerButton.value)
    }
    if (deleteButton.value) {
      mapInstance.removeControl(deleteButton.value)
    }
    if (mbDraw.value) {
      mapInstance.removeControl(mbDraw.value)
    }

    // Clear marker
    clearMarker()

    // Clean up references
    if (mapInstance.__draw) {
      mapInstance.__draw = null
    }
    if (mapInstance.__markerControl) {
      mapInstance.__markerControl = null
    }
  })

  // Expose methods for parent component
  defineExpose({
    clear,
    getDraw,
    getMarker,
    setStaticMode,
  })
</script>

<style>
  /* Hide default MapboxDraw controls */
  .mapbox-gl-draw_ctrl-draw-btn,
  .mapbox-gl-draw_ctrl-trash {
    display: none !important;
  }

  /* Style polygon button */
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

  /* Style rectangle button */
  .mapboxgl-ctrl-icon.mapbox-gl-draw-rectangle-control {
    border-radius: 4px;
    background-color: #fff;
  }

  .mapbox-gl-draw-rectangle-control i::before {
    color: #000;
  }

  .mapbox-gl-draw-rectangle-control--highlighted {
    background: #008fc5 !important;
    border-radius: 4px;
  }

  .mapbox-gl-draw-rectangle-control--highlighted i::before {
    color: #fff;
  }

  .mapbox-gl-draw-rectangle-control:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  .mapbox-gl-draw-rectangle-control:disabled i::before {
    color: #999 !important;
  }

  /* Style marker button */
  .mapboxgl-ctrl-icon.mapbox-gl-marker-control {
    border-radius: 4px;
    background-color: #fff;
  }

  .mapbox-gl-marker-control i::before {
    color: #000;
  }

  .mapbox-gl-marker-control--highlighted {
    background: #008fc5 !important;
    border-radius: 4px;
  }

  .mapbox-gl-marker-control--highlighted i::before {
    color: #fff;
  }

  .mapbox-gl-marker-control:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
  }

  .mapbox-gl-marker-control:disabled i::before {
    color: #999 !important;
  }

  /* Style delete button */
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

