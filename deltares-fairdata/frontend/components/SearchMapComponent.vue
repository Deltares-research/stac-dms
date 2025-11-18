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
        v-if="store.featureCollectionWithGeometry && imageLoaded"
        :key="clusterKey"
        :data="store.featureCollectionWithGeometry"
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
      />
      <MapControlsZoom
        v-if="bounds.length >= 4"
        :bounds="bounds"
      />
      <MapCustomImage
        image-path="/custom-marker.png"
        image-name="custom-marker"
        @image-loaded="imageLoaded = true"
      />
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
      
      <!-- Draw control for area selection -->
      <MapboxDrawControl
        v-if="mapInstance"
        ref="drawControlRef"
        :map="mapInstance"
        :draw-mode="drawMode"
        @change="onDrawChange"
      />
      
      <!-- Popup for selected feature -->
      <MapboxPopup
        v-if="selectedFeature && popupCoordinates && Array.isArray(popupCoordinates) && popupCoordinates.length === 2"
        :key="`popup-${selectedFeature?.id || 'unknown'}`"
        :lng-lat="popupCoordinates"
        anchor="bottom"
        :offset="[0, -30]"
        :close-button="true"
        :close-on-click="true"
        :close-on-move="false"
        max-width="420px"
        @mb-close="onPopupClose"
      >
        <v-card style="min-width: 300px; max-width: 420px; box-shadow: none;">
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
  import { ref, computed, watch, nextTick } from 'vue'
  import { MapboxMap, MapboxCluster, MapboxNavigationControl, MapboxPopup } from '@studiometa/vue-mapbox-gl'
  import { center } from '@turf/turf'
  import { useSearchPageStore } from '~/stores/searchPage'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'
  import MapCustomImage from '@/components/MapCustomImage.vue'
  import MapboxDrawControl from '@/components/MapboxDrawControl.vue'
  import { formatDate } from '~/utils/helpers'
  import * as geojsonBounds from 'geojson-bounds'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const imageLoaded = ref(false)
  const selectedFeature = ref(null)
  const justClickedFeature = ref(false)
  let mapClickTimeout = null
  
  const store = useSearchPageStore()
  
  // Draw control reference
  const drawControlRef = ref(null)
  
  // Default bbox (whole world)
  const DEFAULT_BBOX = [180, 90, -180, -90]
  
  // Draw mode for area selection
  const drawMode = computed(() => {
    return store.areaDrawMode ? 'rectangle' : null
  })
  
  // Watch for areaDrawMode changes to clear draw when disabled
  watch(
    () => store.areaDrawMode,
    (isActive) => {
      if (!isActive && drawControlRef.value) {
        // Clear the drawn rectangle when draw mode is disabled
        drawControlRef.value.clear()
        // Reset bbox filter to default
        store.bboxFilter = [...DEFAULT_BBOX]
      }
    }
  )
  
  // Watch for changes to selectedFeatureId from store (e.g., when clicking a card in the list)
  watch(
    () => store.selectedFeatureId,
    (newFeatureId, oldFeatureId) => {
      // If selection was cleared, clear local state
      if (!newFeatureId) {
        selectedFeature.value = null
        justClickedFeature.value = false
        return
      }
      
      // If clicking the same feature that's already selected, do nothing
      if (selectedFeature.value?.id === newFeatureId) {
        return
      }
      
      // If the change is from a map click (same feature ID maintained), don't override
      // This prevents circular updates when clicking on the map
      const isMapClickUpdate = justClickedFeature.value && 
        selectedFeature.value?.id === newFeatureId
      
      if (isMapClickUpdate) {
        return
      }
      
      // Reset the flag since we're updating from store (card click or external change)
      justClickedFeature.value = false
      
      // Cancel any pending map click handlers
      if (mapClickTimeout) {
        clearTimeout(mapClickTimeout)
        mapClickTimeout = null
      }
      
      // Find the feature in featureCollection by ID
      if (store.featureCollectionWithGeometry && store.featureCollectionWithGeometry.features) {
        const feature = store.featureCollectionWithGeometry.features.find(f => f.id === newFeatureId)
        if (feature) {
          selectedFeature.value = feature
        }
      }
    }
  )
  
  // Timestamp that updates when featureCollectionWithGeometry changes
  const layerTimestamp = ref(Date.now())
  
  watch(
    () => store.featureCollectionWithGeometry,
    () => console.log('featureCollectionWithGeometry changed', JSON.stringify(store.featureCollectionWithGeometry)),
    () => {
      layerTimestamp.value = Date.now()
    },
    { deep: true }
  )
  
  // Generate a key using timestamp - this will force refresh when data changes
  const clusterKey = computed(() => {
    if (!store.featureCollectionWithGeometry) return null
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
      40   // radius for clusters >= 750 points
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
    if (!selectedFeature.value?.geometry) {
      return null
    }
    
    const geometry = selectedFeature.value.geometry
    
    // For Point geometry, coordinates are directly [lng, lat]
    if (geometry.type === 'Point') {
      const coords = geometry.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        return [coords[0], coords[1]]
      }
      return null
    }
    
    // For other geometries, calculate center using @turf/center
    try {
      const centerPoint = center(selectedFeature.value)
      const coords = centerPoint.geometry.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        return [coords[0], coords[1]]
      }
      return null
    } catch (error) {
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
  
  
  // Calculate bounds from featureCollectionWithGeometry using geojson-bounds
  const bounds = computed(() => {
    if (!store.featureCollectionWithGeometry) {
      return []
    }
    const extent = geojsonBounds.extent(store.featureCollectionWithGeometry)
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
  
  async function onFeatureClicked(feature, event) {
    console.log('onFeatureClicked', JSON.stringify(feature))
   
    // Cancel any pending map click handlers
    if (mapClickTimeout) {
      clearTimeout(mapClickTimeout)
      mapClickTimeout = null
    }
    
    // Set flag immediately to prevent map click from clearing
    justClickedFeature.value = true
    
    // Stop event propagation to prevent map click from firing
    if (event) {
      if (event.originalEvent) {
        event.originalEvent.stopPropagation()
        event.originalEvent.preventDefault()
      }
      if (event.stopPropagation) {
        event.stopPropagation()
      }
    }
    
    // Get the feature ID from properties (normalized in store)
    const featureId = feature.properties?.id || feature.id
    
    if (!featureId) {
      justClickedFeature.value = false
      return
    }
    
    // Find the matching feature from the original featureCollection by ID
    // This gives us the full feature with id, assets, etc.
    let matchedFeature = null
    if (store.featureCollectionWithGeometry && store.featureCollectionWithGeometry.features) {
      matchedFeature = store.featureCollectionWithGeometry.features.find(f => f.id === featureId)
    }
    
    // Use matched feature if found, otherwise use the clicked feature
    const featureToUse = matchedFeature || feature
    
    // Check if clicking the same feature
    const currentId = selectedFeature.value?.id
    const newId = featureToUse.id
    
    if (currentId && newId && currentId === newId) {
      setTimeout(() => { justClickedFeature.value = false }, 100)
      return
    }
    
    // Set the feature - Vue reactivity and the :key prop will handle remounting
    selectedFeature.value = featureToUse
    store.setSelectedFeature(featureToUse.id)
    
    // Ensure reactivity has processed
    await nextTick()
    
    // Reset flag after popup has had time to mount
    setTimeout(() => { 
      justClickedFeature.value = false 
    }, 400)
  }
  
  function onClusterClicked(clusterId, event) {
    // Handle cluster click - clear selection and let default zoom behavior happen
    selectedFeature.value = null
    store.clearSelectedFeature()
  }
  
  function onMapClick(event) {
    // Only clear selection if clicking empty map area (not on a feature)
    // Cancel any previous pending map click handler
    if (mapClickTimeout) {
      clearTimeout(mapClickTimeout)
    }
    
    // Check the flag with a small delay to account for async feature click handler
    mapClickTimeout = setTimeout(() => {
      mapClickTimeout = null
      if (justClickedFeature.value) {
        return
      }
      
      selectedFeature.value = null
      store.clearSelectedFeature()
    }, 150)
  }
  function onPopupClose() {
    if (!justClickedFeature.value && !store.selectedFeatureId) {
      selectedFeature.value = null
      store.clearSelectedFeature()
    }
  }

  
  // Handle draw control changes (when user draws a rectangle)
  function onDrawChange(feature) {
    if (!feature || !feature.geometry) {
      // Draw was cleared - reset bbox filter to default
      console.log('Draw cleared - resetting bbox filter')
      store.bboxFilter = [...DEFAULT_BBOX]
      return
    }
    
    // Extract bbox from polygon
    if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates && feature.geometry.coordinates.length > 0) {
      const coordinates = feature.geometry.coordinates[0] // First ring of polygon
      
      // Find min/max lng and lat
      let minLng = Infinity
      let minLat = Infinity
      let maxLng = -Infinity
      let maxLat = -Infinity
      
      coordinates.forEach(coord => {
        const [lng, lat] = coord
        minLng = Math.min(minLng, lng)
        minLat = Math.min(minLat, lat)
        maxLng = Math.max(maxLng, lng)
        maxLat = Math.max(maxLat, lat)
      })
      
      const bbox = [minLng, minLat, maxLng, maxLat]
      console.log('Area selected - BBox:', bbox)
      
      // Update the bbox filter in the store
      // This will trigger the watcher in index.vue which will call store.search()
      store.bboxFilter = bbox
    }
  }
</script>

<style>
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>

