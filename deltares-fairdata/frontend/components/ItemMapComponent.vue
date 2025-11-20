<template>
  <div class="item-map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v12"
      :center="center"
      :zoom="zoom"
      @mb-created="onMapCreated"
    >
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
      
      <!-- Consolidated map select tool -->
      <MapSelectTool
        v-if="mapInstance"
        ref="mapSelectToolRef"
        position="top-left"
        :enabled-tools="['polygon', 'rectangle', 'marker']"
        @change="onToolChange"
        @error="onError"
      />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, provide } from 'vue'
  import { MapboxMap, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'
  import MapSelectTool from '@/components/MapSelectTool.vue'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapSelectToolRef = ref(null)

  // Default center (Netherlands)
  const center = ref([5.1, 52.07])
  const zoom = ref(10.5)

  // Provide map to child components
  provide('map', mapInstance)

  function onMapCreated(map) {
    mapInstance.value = map
    console.log('Map created:', map)
  }

  function onToolChange({ tool, feature, active }) {
    console.log('Tool change:', { tool, feature, active })
    // Handle tool changes as needed
  }

  function onError(err) {
    console.error('Map tool error:', err)
  }

  function clearAll() {
    if (mapSelectToolRef.value) {
      mapSelectToolRef.value.clear()
    }
  }

  // Expose methods if needed
  defineExpose({
    clearAll,
  })
</script>

<style scoped>
.item-map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.item-map-wrapper :deep(.mapboxgl-map) {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>


