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
    const sw = [props.bounds[0], props.bounds[1]]
    const ne = [props.bounds[2], props.bounds[3]]
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