<template>
  <div class="item-map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/light-v11"
      :center="center"
      :zoom="zoom"
      @mb-created="onMapCreated"
    >
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
      <MapCustomImage
        image-path="/custom-marker.png"
        image-name="custom-marker"
      />
      <MapControlsZoom
        v-if="zoomBounds && zoomBounds.length >= 4"
        :bounds="zoomBounds"
      />
      <!-- Handle array of layers (polygon) or single layer (point) -->
      <template v-if="layerOptions">
        <template v-if="Array.isArray(layerOptions)">
          <MapboxLayer
            v-for="layer in layerOptions"
            :id="layer.id"
            :key="layer.id"
            :options="layer"
          />
        </template>
        <MapboxLayer
          v-else
          :id="layerOptions.id"
          :options="layerOptions"
        />
      </template>
      
      <MapSelectTool
        v-if="mapInstance"
        ref="mapSelectToolRef"
        position="top-left"
        enabled-tools="['polygon','marker']"
        :draw-mode="drawMode"
        @change="onToolChange"
        @error="onError"
      />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, provide } from 'vue'
  import { MapboxMap, MapboxNavigationControl, MapboxLayer } from '@studiometa/vue-mapbox-gl'
  import MapSelectTool from '@/components/MapSelectTool.vue'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'

  defineProps({
    drawMode: {
      type: Boolean,
      default: true, 
    },
    center: {
      type: Array,
      default: () => [0, 0],
    },
    layerOptions: {
      type: [Object, Array],
      default: null,
    },
    zoomBounds: {
      type: Array,
      default: () => [],
    }
  })

  const emit = defineEmits(['change'])

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapSelectToolRef = ref(null)

  const zoom = ref(1)

  // Provide map to child components
  provide('map', mapInstance)

  function onMapCreated(map) {
    mapInstance.value = map
  }
  function onError(err) {
    console.error('Map tool error:', err)
  }

  function onToolChange(event) {
    emit('change', event)
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


