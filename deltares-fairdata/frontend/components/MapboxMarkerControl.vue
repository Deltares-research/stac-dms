<template>
  <!-- Marker is rendered directly by Mapbox GL JS, no Vue component needed -->
</template>
  
  <script setup>
  import { watch, onBeforeUnmount, computed, ref } from 'vue'
  import mapboxgl from 'mapbox-gl'
  // Remove: import { MglMarker } from '@studiometa/vue-mapbox-gl'
  import MapboxButtonControl from '@/utils/MapboxButtonControl'
  
  // ... rest of the script stays the same ...

  const props = defineProps({
    map: {
      type: Object,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'top-left',
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['change', 'toggle'])

  const marker = ref(null)
  let buttonControl = null
  let staticMode = false
  let mapInstance = null

  const activeMarker = computed(() => marker.value)
  const activeMarkerCoordinates = computed(() => {
    return marker.value && marker.value._lngLat ? Object.values(marker.value._lngLat) : null
  })

  // Watch for active state changes
  watch(
    () => props.active,
    (value) => {
      // Don't allow activation when in static mode
      if (value && staticMode) {
        emit('toggle', false)
        return
      }
      
      if (value) {
        enableControl()
      } else {
        disableControl()
      }
    }
  )

  // Initialize button control when map is available
  watch(
    () => props.map,
    (map) => {
      if (!map || buttonControl) return
      mapInstance = map
      initializeControl(map)
    },
    { immediate: true }
  )

  function initializeControl(map) {
    marker.value = new mapboxgl.Marker({
      color: '#FF0000',
    })

    buttonControl = new MapboxButtonControl({
      className: `mapbox-gl-marker-control ${ props.highlighted ? 'mapbox-gl-marker-control--highlighted' : '' }`,
      icon: 'mdi-map-marker',
      eventHandler: toggleMarker,
      title: 'Plaats een speld op de kaart',
    })

    map.addControl(buttonControl, props.position)
    
    // Attach marker control to map for external access (similar to __draw)
    // This is a common pattern with Mapbox controls - we're extending the map object
    map.__markerControl = {
      clear: () => {
        removeActiveMarker()
      },
      setStaticMode: (enabled) => {
        setStaticMode(enabled)
      },
    }
  }

  function enableControl() {
    if (!props.map) return

    props.map.on('click', getCoordinates)
    props.map.getCanvas().style.cursor = 'crosshair'

    // Update button appearance to show active state
    if (buttonControl && buttonControl._btn) {
      buttonControl._btn.classList.add('active')
    }
  }

  function disableControl() {
    if (!props.map) return

    props.map.off('click', getCoordinates)
    props.map.getCanvas().style.cursor = 'unset'

    // Update button appearance to remove active state
    if (buttonControl && buttonControl._btn) {
      buttonControl._btn.classList.remove('active')
    }
  }

  function getCoordinates(event) {
    const { lng, lat } = event.lngLat || event.target._lngLat

    // Remove existing marker if any
    if (marker.value) {
      marker.value.remove()
    }

    // Set marker coordinates
    marker.value.setLngLat([ lng, lat ]).addTo(props.map)

    // Emit change event
    emit('change', {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        lng,
        lat,
      },
    })
  }

  function removeActiveMarker() {
    if (marker.value) {
      marker.value.remove()
      marker.value = null
    }
    emit('change', null)
  }

  function toggleMarker() {
    // Don't allow toggling when in static mode
    if (staticMode) {
      return
    }
    emit('toggle', !props.active)
  }

  function setStaticMode(enabled) {
    staticMode = enabled
    
    if (buttonControl && buttonControl._container) {
      const buttonElement = buttonControl._container.querySelector('button')
      if (buttonElement) {
        if (enabled) {
          buttonElement.setAttribute('disabled', true)
          buttonElement.style.opacity = '0.5'
          buttonElement.style.cursor = 'not-allowed'
        } else {
          buttonElement.removeAttribute('disabled')
          buttonElement.style.opacity = ''
          buttonElement.style.cursor = ''
        }
      }
    }
    
    // If enabling static mode and control is currently active, disable it
    if (enabled && props.active) {
      disableControl()
      emit('toggle', false)
    }
  }

  function clear() {
    removeActiveMarker()
  }

  onBeforeUnmount(() => {
    disableControl()
    removeActiveMarker()

    if (buttonControl && props.map) {
      props.map.removeControl(buttonControl)
      buttonControl = null
    }
    
    // Clean up the reference to this control
    if (mapInstance && mapInstance.__markerControl) {
      mapInstance.__markerControl = null
    }
  })

  // Expose methods for parent component
  defineExpose({
    clear,
    getMarker: () => marker.value,
    setStaticMode,
  })
</script>

<style>
  .mapboxgl-ctrl-icon.mapbox-gl-marker-control.map-control-tooltip.map-control-tooltip--right.active {
    box-shadow: 0 0 2px 2px rgba(0, 150, 255, 1), inset 0 0 0 3px rgba(0, 150, 255, 1);
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
</style>

