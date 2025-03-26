<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue"
import { Map, Layers, Sources, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import { MapPinIcon } from "lucide-vue-next"

interface ItemMapProps {
  geometry?: any
  bbox?: number[]
  readOnly?: boolean
}

const props = withDefaults(defineProps<ItemMapProps>(), {
  readOnly: true,
})

// Create a GeoJSON format instance
const geoJson = new GeoJSON()

// Map view state
const center = ref([0, 0])
const zoom = ref(2)
const projection = ref("EPSG:4326")

// References for map components
const vectorRef = ref()
const viewRef = ref()

// Convert bbox to a polygon feature if needed
const featureData = computed(() => {
  if (props.geometry) {
    return props.geometry
  }

  if (props.bbox && props.bbox.length >= 4) {
    const [minLon, minLat, maxLon, maxLat] = props.bbox
    return {
      type: "Polygon",
      coordinates: [
        [
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat],
        ],
      ],
    }
  }

  return null
})

// Create features for OpenLayers
const initialFeatures = computed(() => {
  if (!featureData.value) return []

  const geojson = {
    type: "Feature",
    geometry: featureData.value,
    properties: {},
  }

  return geoJson.readFeatures(geojson, {
    featureProjection: "EPSG:4326",
    dataProjection: "EPSG:4326",
  })
})

// Watch for changes to fit map to features
watch(initialFeatures, () => {
  if (initialFeatures.value.length > 0) {
    setTimeout(() => {
      try {
        const extent = vectorRef.value?.source?.getExtent()
        if (extent && viewRef.value) {
          viewRef.value.fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500,
            maxZoom: 10,
          })
        }
      } catch (e) {
        console.warn("Error fitting map to geometry:", e)
      }
    }, 500)
  }
})

onMounted(() => {
  if (initialFeatures.value.length > 0) {
    setTimeout(() => {
      try {
        const extent = vectorRef.value?.source?.getExtent()
        if (extent && viewRef.value) {
          viewRef.value.fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500,
            maxZoom: 10,
          })
        }
      } catch (e) {
        console.warn("Error fitting map to geometry:", e)
      }
    }, 500)
  }
})
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center mb-2">
      <MapPinIcon class="w-5 h-5 mr-2 text-gray-600" />
      <h2 class="font-semibold text-gray-700">Location</h2>
    </div>

    <div class="aspect-[16/9] w-full border rounded overflow-hidden">
      <Map.OlMap
        class="w-full h-full"
        :loadTilesWhileAnimating="true"
        :loadTilesWhileInteracting="true"
      >
        <Map.OlView
          ref="viewRef"
          :projection="projection"
          :rotation="0"
          :center="center"
          :zoom="zoom"
        />

        <Layers.OlTileLayer>
          <Sources.OlSourceOsm />
        </Layers.OlTileLayer>

        <Layers.OlVectorLayer>
          <Sources.OlSourceVector
            ref="vectorRef"
            :features="initialFeatures"
            :format="geoJson"
          />

          <Styles.OlStyle>
            <Styles.OlStyleStroke color="#3b82f6" :width="3" />
            <Styles.OlStyleFill color="rgba(59, 130, 246, 0.2)" />
            <Styles.OlStyleCircle :radius="7">
              <Styles.OlStyleFill color="#3b82f6" />
              <Styles.OlStyleStroke color="#ffffff" :width="2" />
            </Styles.OlStyleCircle>
          </Styles.OlStyle>
        </Layers.OlVectorLayer>
      </Map.OlMap>
    </div>
  </div>
</template>
