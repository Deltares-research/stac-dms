<template>
  <div />
</template>

<script setup>
  import { watch, onMounted, onBeforeUnmount, unref } from 'vue'
  import { useMap } from '@studiometa/vue-mapbox-gl'

  const props = defineProps({
    imagePath: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
  })

  const { map } = useMap()

  function loadImage() {
    const mapInstance = unref(map)
    if (!mapInstance || !props.imagePath || !props.imageName) {
      return
    }

    // Only proceed if map is loaded
    if (!mapInstance.loaded()) {
      return
    }

    // Check if image already exists
    if (mapInstance.hasImage(props.imageName)) {
      return
    }

    mapInstance.loadImage(props.imagePath, (error, image) => {
      if (error) {
        console.error(`Failed to load image ${props.imagePath}:`, error)
        return
      }

      if (!mapInstance.hasImage(props.imageName)) {
        console.log('Adding image to map:', props.imageName)
        mapInstance.addImage(props.imageName, image)
      }
    })
  }

  function setupMapListeners() {
    const mapInstance = unref(map)
    if (!mapInstance) {
      return
    }

    // Load image when map is ready
    mapInstance.on('load', loadImage)

    // Reload image when style changes
    mapInstance.on('style.load', loadImage)
  }

  function cleanupMapListeners() {
    const mapInstance = unref(map)
    if (!mapInstance) {
      return
    }

    mapInstance.off('load', loadImage)
    mapInstance.off('style.load', loadImage)
  }

  watch(
    () => props.imagePath,
    () => {
      loadImage()
    }
  )

  watch(
    () => map.value,
    (newMap) => {
      if (newMap) {
        setupMapListeners()
        // Try to load immediately if map is already loaded
        if (newMap.loaded()) {
          loadImage()
        }
      } else {
        cleanupMapListeners()
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    const mapInstance = unref(map)
    if (mapInstance) {
      setupMapListeners()
      if (mapInstance.loaded()) {
        loadImage()
      }
    }
  })

  onBeforeUnmount(() => {
    cleanupMapListeners()
  })
</script>

