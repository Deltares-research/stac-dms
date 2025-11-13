<template>
  <div class="map-wrapper">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v12"
      :center="[5.1, 52.07]"
      :zoom="10.5"
      @mb-created="onMapCreated"
      @mb-click="onMapClick"
    >
      <MapboxCluster
        v-if="store.featureCollection && imageLoaded"
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
      
      <!-- Popup for selected feature -->
      <MapboxPopup
        v-if="selectedFeature && popupCoordinates"
        :lng-lat="popupCoordinates"
        anchor="bottom"
        :close-button="true"
        :close-on-click="true"
        :close-on-move="false"
        max-width="420px"
        @mb-close="onPopupClose"
      >
        <v-card class="pa-2" style="min-width: 300px; max-width: 420px;">
          <v-card-title class="text-h6 text-wrap">
            {{ selectedFeature.properties?.title || selectedFeature.id }}
          </v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-3">
              {{ selectedFeature.properties?.description || 'No description.' }}
            </p>
            
            <!-- View details section (same as index.vue) -->
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2" size="small">
                mdi-link-variant
              </v-icon>
              <span v-if="firstAssetHref(selectedFeature)">
                {{ firstAssetHref(selectedFeature) }}
              </span>
              <span v-else>—</span>
            </div>
            
            <div class="mb-3">
              <v-btn
                v-if="firstAssetHref(selectedFeature)"
                :href="firstAssetHref(selectedFeature)"
                target="_blank"
                rel="noopener noreferrer"
                variant="tonal"
                density="comfortable"
                prepend-icon="mdi-open-in-new"
              >
                View details
              </v-btn>
            </div>
            
            <div class="text-body-2">
              {{ formatDate(selectedFeature) }}
            </div>
          </v-card-text>
        </v-card>
      </MapboxPopup>
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { MapboxMap, MapboxCluster, MapboxNavigationControl, MapboxPopup } from '@studiometa/vue-mapbox-gl'
  import { center } from '@turf/turf'
  import { useSearchPageStore } from '~/stores/searchPage'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'
  import MapCustomImage from '@/components/MapCustomImage.vue'
  import { formatDate } from '~/utils/helpers'
  import * as geojsonBounds from 'geojson-bounds'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const imageLoaded = ref(false)
  const selectedFeature = ref(null)
  
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
  
  // Popup coordinates computed property
  const popupCoordinates = computed(() => {
    if (!selectedFeature.value || !selectedFeature.value.geometry) {
      return null
    }
    
    const geometry = selectedFeature.value.geometry
    
    // For Point geometry, coordinates are directly [lng, lat]
    if (geometry.type === 'Point') {
      return geometry.coordinates
    }
    
    // For other geometries, calculate center using @turf/center
    try {
      const centerPoint = center(selectedFeature.value)
      return centerPoint.geometry.coordinates
    } catch (error) {
      console.error('Error calculating center for popup:', error)
      return null
    }
  })
  
  // Helper function to get first asset href (same as index.vue)
  function firstAssetHref(feature) {
    const assets = feature?.assets
    if (!assets) return null
    const firstKey = Object.keys(assets)[0]
    return firstKey ? assets[firstKey]?.href : null
  }
  
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
    
    // Handle missing image event to provide custom marker when requested
    map.on('styleimagemissing', (e) => {
      if (e.id === 'custom-marker') {
        // Load the image if it's missing
        map.loadImage('/custom-marker.png', (error, image) => {
          if (error) {
            console.error('Failed to load custom marker image:', error)
            return
          }
          if (!map.hasImage('custom-marker')) {
            map.addImage('custom-marker', image)
            imageLoaded.value = true
          }
        })
      }
    })
    
    // Also try to load the image immediately if map is already loaded
    if (map.loaded()) {
      loadCustomImage(map)
    } else {
      map.once('load', () => {
        loadCustomImage(map)
      })
    }
  }
  
  function loadCustomImage(map) {
    if (!map || map.hasImage('custom-marker')) {
      imageLoaded.value = true
      return
    }
    
    map.loadImage('/custom-marker.png', (error, image) => {
      if (error) {
        console.error('Failed to load custom marker image:', error)
        return
      }
      if (!map.hasImage('custom-marker')) {
        map.addImage('custom-marker', image)
        imageLoaded.value = true
      }
    })
  }
  
  function onFeatureClicked(feature, event) {
    // Handle individual feature click
    selectedFeature.value = feature
    store.setSelectedFeature(feature.id)
  }
  
  function onClusterClicked(clusterId, event) {
    // Handle cluster click - clear selection and let default zoom behavior happen
    selectedFeature.value = null
    store.clearSelectedFeature()
  }
  
  function onMapClick(event) {
    // Clear selection when clicking empty map area
    selectedFeature.value = null
    store.clearSelectedFeature()
  }
  
  function onPopupClose() {
    // Clear selection when popup is closed
    selectedFeature.value = null
    store.clearSelectedFeature()
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