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
        v-if="bounds.length >= 4 && !hasActivePolygonFilter"
        :bounds="bounds"
      />
      <MapCustomImage
        image-path="/custom-marker.png"
        image-name="custom-marker"
        @image-loaded="imageLoaded = true"
      />
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
      <MapControlsZoom
        v-if="mapInstance && store.selectedFeatureBbox"
        :bounds="store.selectedFeatureBbox"
        :padding="50"
        :duration="1000"
        :zoom-on-mount="false"
      />
      <MapSelectTool
        v-if="mapInstance"
        ref="drawControlRef"
        :map="mapInstance"
        :show-buttons="true"
        :enabled-tools="['polygon']"
        @change="onDrawChange"
      />
      
      <MapboxPopup
        v-if="selectedFeature && popupCoordinates && Array.isArray(popupCoordinates) && popupCoordinates.length === 2"
        :key="`popup-${selectedFeature?.id || 'unknown'}`"
        :lng-lat="popupCoordinates"
        anchor="bottom"
        :offset="[0, -30]"
        :close-button="false"
        :close-on-click="true"
        :close-on-move="false"
        max-width="420px"
        @mb-close="onPopupClose"
      >
        <PopupContent :feature="selectedFeature" />
      </MapboxPopup>
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick } from 'vue'
  import { MapboxMap, MapboxCluster, MapboxNavigationControl, MapboxPopup } from '@studiometa/vue-mapbox-gl'
  import { center, bbox } from '@turf/turf'
  import { isEqual } from 'lodash'
  import { useSearchPageStore } from '~/stores/searchPage'
  import MapControlsZoom from '@/components/MapControlsZoom.vue'
  import MapCustomImage from '@/components/MapCustomImage.vue'
  import MapSelectTool from '@/components/MapSelectTool.vue'
  import PopupContent from '@/components/PopupContent.vue'
  import * as geojsonBounds from 'geojson-bounds'
  import {
    unclusteredPointLayout,
    unclusteredPointPaint,
    clustersPaint,
    clusterCountLayout,
    clusterCountPaint
  } from '~/utils/mapbox-cluster-config'

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
  
  // Flag to prevent recursive updates
  const isClearingPolygon = ref(false)
  
  // Check if polygon filter is active (bbox is not default)
  const hasActivePolygonFilter = computed(() => {
    if (!store.bboxFilter || store.bboxFilter.length !== 4) return false
    return !isEqual(store.bboxFilter, DEFAULT_BBOX)
  })
  
  // Watch for bboxFilter changes to clear polygon when reset to default
  watch(
    () => store.bboxFilter,
    (newBbox, oldBbox) => {
      // Skip if we're already clearing (prevent recursion)
      if (isClearingPolygon.value) return
      
      // Only clear if bboxFilter was changed from non-default to default
      // (i.e., not when it's already default)
      const wasNonDefault = oldBbox && oldBbox.length === 4 && !isEqual(oldBbox, DEFAULT_BBOX)
      
      // If bboxFilter is reset to default (and it wasn't already default), clear the polygon on map
      if (wasNonDefault &&
        newBbox &&
        newBbox.length === 4 &&
        isEqual(newBbox, DEFAULT_BBOX) &&
        drawControlRef.value) {
        // Check if polygon actually exists before clearing
        const draw = drawControlRef.value.getDraw()
        if (draw) {
          const { features } = draw.getAll()
          if (features && features.length > 0) {
            isClearingPolygon.value = true
            drawControlRef.value.clear()
            // Reset flag after a short delay to allow the clear to complete
            nextTick(() => {
              setTimeout(() => {
                isClearingPolygon.value = false
              }, 100)
            })
          }
        }
      }
    }
  )
  
  // Watch for changes to selectedFeatureId from store (e.g., when clicking a card in the list)
  watch(
    () => store.selectedFeatureId,
    (newFeatureId) => {
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
          if (feature.bbox) {
            store.setSelectedFeatureBbox(feature.bbox)
          }
        }
      }
    }
  )
  
  // Timestamp that updates when featureCollectionWithGeometry changes
  const layerTimestamp = ref(Date.now())
  
  watch(
    () => store.featureCollectionWithGeometry,
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
  
  
  // Popup coordinates computed property
  const popupCoordinates = computed(() => {
    if (!selectedFeature.value?.geometry) {
      return null
    }
    
    const geometry = selectedFeature.value.geometry
    
    if (geometry.type === 'Point') {
      const coords = geometry.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        return [coords[0], coords[1]]
      }
      return null
    }
    
    try {
      const centerPoint = center(selectedFeature.value)
      const coords = centerPoint.geometry.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        return [coords[0], coords[1]]
      }
      return null
    } catch {
      return null
    }
  })

  const bounds = computed(() => {
    if (!store.featureCollectionWithGeometry) {
      return []
    }
    const extent = geojsonBounds.extent(store.featureCollectionWithGeometry)
    if (!extent || extent.length < 4) {
      return []
    }
    return extent
  })
  
  function onMapCreated(map) {
    mapInstance.value = map

  }
  
  async function onFeatureClicked(feature, event) {
   
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
    if (featureToUse.bbox) {
      store.setSelectedFeatureBbox(featureToUse.bbox)
    }
    
    // Ensure reactivity has processed
    await nextTick()
    
    // Reset flag after popup has had time to mount
    setTimeout(() => { 
      justClickedFeature.value = false 
    }, 400)
  }
  
  function onClusterClicked() {
    selectedFeature.value = null
    store.clearSelectedFeature()
  }
  
  function onMapClick() {
    if (mapClickTimeout) {
      clearTimeout(mapClickTimeout)
    }
    
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

  function onDrawChange({ feature }) {
    if (isClearingPolygon.value) return
    if (!feature || !feature.geometry) {
      const currentBbox = store.bboxFilter
      if (!currentBbox || !isEqual(currentBbox, DEFAULT_BBOX)) {
        store.bboxFilter = [...DEFAULT_BBOX]
      }
      return
    }
    
    const featureBbox = bbox(feature)
    store.bboxFilter = featureBbox
  }
</script>

<style>
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>

