<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/light-v11"
      :center="[5.1, 52.07]"
      :zoom="10.5"
      @mb-created="onMapCreated"
    >
      <MapboxLayer
        v-if="layerConfig"
        :id="layerConfig.id"
        :key="layerKey"
        :options="layerConfig"
        @mb-click="onLayerClicked"
        @mb-mouseenter="onMouseenter"
        @mb-mouseleave="onMouseleave"
      />
      <MapControlsZoom
        v-if="bounds.length >= 4"
        :bounds="bounds"
      />
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { MapboxMap, MapboxLayer, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'
  import { useSearchPageStore } from '~/stores/searchPage'
  import buildGeojsonLayer from '@/utils/mapbox/build-geojson-layer.js'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'
  import * as geojsonBounds from 'geojson-bounds'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  
  const store = useSearchPageStore()
  
  const layerConfig = computed(() => {
    if (!store.featureCollection) {
      return null
    }
    return buildGeojsonLayer(store.featureCollection)
  })
  
  // Timestamp that updates when featureCollection changes
  const layerTimestamp = ref(Date.now())
  
  watch(
    () => store.featureCollection,
    () => {
      layerTimestamp.value = Date.now()
    },
    { deep: true }
  )
  
  // Generate a key using timestamp
  const layerKey = computed(() => {
    if (!layerConfig.value) return null
    return `${layerConfig.value.id}-${layerTimestamp.value}`
  })
  
  // Calculate bounds from featureCollection using geojson-bounds
  const bounds = computed(() => {
    if (!store.featureCollection) {
      return []
    }
    return geojsonBounds.extent(store.featureCollection) || []
  })
  
  function onMapCreated(map) {
    mapInstance.value = map
  }
  
  function onLayerClicked() {
    // Handle layer click if needed
  }
  
  function onMouseenter() {
    // Handle mouse enter if needed
  }
  
  function onMouseleave() {
    // Handle mouse leave if needed
  }
</script>
<style>
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>