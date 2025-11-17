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

  const emit = defineEmits(['image-loaded'])

  const { map } = useMap()
  
  let loadHandler = null
  let styleLoadHandler = null
  let pollInterval = null

  function loadImage() {
    const mapInstance = unref(map)
  
    if (!mapInstance || !props.imagePath || !props.imageName) {
      return
    }

    // Only proceed if map is loaded
    if (!mapInstance.loaded()) {

      return
    }

    if (mapInstance.hasImage(props.imageName)) {
      emit('image-loaded')
      return
    }
    mapInstance.loadImage(props.imagePath, (error, image) => {
      if (error) {
        return
      }

      if (!mapInstance.hasImage(props.imageName)) {
        mapInstance.addImage(props.imageName, image)
      }
      emit('image-loaded')
    })
  }

  function handleStyleImageMissing(e) {
    // Fallback: if the image is requested but missing, load it
    if (e.id === props.imageName) {
      const mapInstance = unref(map)
      if (!mapInstance) return

      mapInstance.loadImage(props.imagePath, (error, image) => {
        if (error) {
          console.error(`Failed to load image ${props.imagePath} (fallback):`, error)
          return
        }
        if (!mapInstance.hasImage(props.imageName)) {
          mapInstance.addImage(props.imageName, image)
        }
        emit('image-loaded')
      })
    }
  }

  function setupMapListeners() {
    const mapInstance = unref(map)
    if (!mapInstance) {
      return
    }


    if (loadHandler) {
      mapInstance.off('load', loadHandler)
    }
    if (styleLoadHandler) {
      mapInstance.off('style.load', styleLoadHandler)
    }

  
    loadHandler = () => {
      loadImage()
    }
    
    styleLoadHandler = () => {
      loadImage()
    }

   
    mapInstance.on('load', loadHandler)
    mapInstance.on('style.load', styleLoadHandler)
    mapInstance.on('styleimagemissing', handleStyleImageMissing)
    
  
    if (mapInstance.loaded()) {
    
      loadImage()
    } else {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
      pollInterval = setInterval(() => {
        const mapInstance = unref(map)
        if (mapInstance && mapInstance.loaded()) {
          clearInterval(pollInterval)
          pollInterval = null
          loadImage()
        }
      }, 100)
    }
  }

  function cleanupMapListeners() {
    const mapInstance = unref(map)
    
    if (pollInterval) {
      clearInterval(pollInterval)
      pollInterval = null
    }
    
    if (!mapInstance) {
      return
    }

    if (loadHandler) {
      mapInstance.off('load', loadHandler)
      loadHandler = null
    }
    if (styleLoadHandler) {
      mapInstance.off('style.load', styleLoadHandler)
      styleLoadHandler = null
    }
    mapInstance.off('styleimagemissing', handleStyleImageMissing)
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
        // setupMapListeners will handle loading if map is already loaded
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
    } 
  })

  onBeforeUnmount(() => {
    cleanupMapListeners()
  })
</script>

