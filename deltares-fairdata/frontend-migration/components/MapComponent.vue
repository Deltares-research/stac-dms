<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v12"
      :center="[5.1, 52.07]"
      :zoom="10.5"
      @mb-created="onMapCreated"
    >
      <MapboxCluster
        v-if="store.featureCollection"
        :key="layerKey"
        :data="store.featureCollection"
        :cluster-max-zoom="14"
        :cluster-radius="50"
        :cluster-min-points="2"
        :unclustered-point-layer-type="'symbol'"
        :unclustered-point-layout="unclusteredPointLayout"
        :unclustered-point-paint="unclusteredPointPaint"
        :clusters-paint="clustersPaint"
        :cluster-count-layout="clusterCountLayout"
        :cluster-count-paint="clusterCountPaint"
        @mb-feature-click="onFeatureClicked"
        @mb-cluster-click="onClusterClicked"
        @mb-feature-mouseenter="onMouseenter"
        @mb-feature-mouseleave="onMouseleave"
      />
      <MapControlsZoom
        v-if="bounds.length >= 4"
        :bounds="bounds"
      />
      <MapCustomImage
        image-path="/custom-marker.png"
        image-name="custom-marker"
      />
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { MapboxMap, MapboxCluster, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'
  import { useSearchPageStore } from '~/stores/searchPage'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'
  import MapCustomImage from '@/components/MapCustomImage.vue'
  import * as geojsonBounds from 'geojson-bounds'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  
  const store = useSearchPageStore()
  
  // Timestamp that updates when featureCollection changes
  const layerTimestamp = ref(Date.now())
  
  watch(
    () => store.featureCollection,
    () => {
      layerTimestamp.value = Date.now()
    },
    { deep: true }
  )
  
  // Generate a key using timestamp - this will force refresh when data changes
  const layerKey = computed(() => {
    if (!store.featureCollection) return null
    return `cluster-${layerTimestamp.value}`
  })
  
  // Configuration for unclustered points (your custom marker)
  const unclusteredPointLayout = computed(() => ({
    'icon-image': 'custom-marker',
    'icon-size': 0.04,
    'icon-allow-overlap': true,
    'icon-anchor': 'bottom',
  }))
  
  const unclusteredPointPaint = computed(() => ({}))
  
  // Configuration for cluster circles
  const clustersPaint = computed(() => ({
    'circle-color': '#51bbd6',
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,  // radius for clusters with < 100 points
      30,  // radius for clusters with < 750 points
      40   // radius for clusters with >= 750 points
    ],
  }))
  
  // Configuration for cluster count text
  const clusterCountLayout = computed(() => ({
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-size': 12,
  }))
  
  const clusterCountPaint = computed(() => ({
    'text-color': '#fff',
  }))
  
  // Calculate bounds from featureCollection using geojson-bounds
  const bounds = computed(() => {
    if (!store.featureCollection) {
      return []
    }
    const extent = geojsonBounds.extent(store.featureCollection)
    if (!extent || extent.length < 4) {
      return []
    }
    // Validate that all values are valid numbers
    const [minLng, minLat, maxLng, maxLat] = extent
    if (
      typeof minLng !== 'number' || isNaN(minLng) ||
      typeof minLat !== 'number' || isNaN(minLat) ||
      typeof maxLng !== 'number' || isNaN(maxLng) ||
      typeof maxLat !== 'number' || isNaN(maxLat)
    ) {
      return []
    }
    return extent
  })
  
  function onMapCreated(map) {
    mapInstance.value = map
  }
  
  function onFeatureClicked(feature, event) {
    // Handle individual feature click
    console.log('Feature clicked:', feature)
  }
  
  function onClusterClicked(clusterId, event) {
    // Handle cluster click - MapboxCluster will auto-zoom by default
    // but you can prevent default and handle it yourself if needed
    console.log('Cluster clicked:', clusterId)
  }
  
  function onMouseenter(feature, event) {
    // Handle mouse enter on feature
  }
  
  function onMouseleave(event) {
    // Handle mouse leave
  }
</script>

<style>
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>