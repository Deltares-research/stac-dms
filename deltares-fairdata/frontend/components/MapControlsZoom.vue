<template>
  <div />
</template>

<script setup>
  import { watch, onMounted, unref } from 'vue'
  import { useMap } from '@studiometa/vue-mapbox-gl'

  const props = defineProps({
    bounds: {
      type: Array,
      default: () => [],
    },
  })

  const { map } = useMap()

  function zoomToExtent() {
    const mapInstance = unref(map)
    if (!mapInstance || !props.bounds || props.bounds.length < 4) {
      return
    }
    
    // Validate bounds - ensure all values are valid numbers
    const [minLng, minLat, maxLng, maxLat] = props.bounds
    if (
      typeof minLng !== 'number' || isNaN(minLng) ||
      typeof minLat !== 'number' || isNaN(minLat) ||
      typeof maxLng !== 'number' || isNaN(maxLng) ||
      typeof maxLat !== 'number' || isNaN(maxLat)
    ) {
      return
    }
    
    const sw = [minLng, minLat]
    const ne = [maxLng, maxLat]
    mapInstance.fitBounds([sw, ne], {
      padding: 100,
      maxZoom: 12,
    })
  }

  watch(
    () => props.bounds,
    () => {
      zoomToExtent()
    }
  )

  onMounted(() => {
    const mapInstance = unref(map)
    if (mapInstance) {
      zoomToExtent()
    }
  })
</script>