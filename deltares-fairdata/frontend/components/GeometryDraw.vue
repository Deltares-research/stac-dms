<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, onUpdated, watchEffect } from "vue"
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import type {
  FeatureCollection,
  Feature as GeoJSONFeature,
  Geometry as GeoJSONGeometry,
} from "geojson"
import { Feature } from "ol"
import type { Geometry } from "ol/geom"
import {
  Circle,
  MapPin,
  Pentagon,
  Spline,
  Trash2,
  HelpCircle,
} from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

let geoJson = new GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857",
})

let {
  onValueChange,
  initialValue,
  readOnly = false,
} = defineProps<{
  onValueChange?: (newValue: FeatureCollection) => void
  initialValue?: FeatureCollection
  readOnly?: Boolean
}>()

let initialFeatures = geoJson.readFeatures(initialValue)

let center = ref([0, 0])
let zoom = ref(1)

let vectorRef = ref()

let drawEnable = ref(false)
let drawType = ref<"Polygon" | "Point" | "Circle">("Polygon")

// Manual coordinate input state
let coordinateInput = ref("")
let detectedGeometryType = ref<"Point" | "Rectangle" | "Polygon" | null>(null)
let selectedGeometryType = ref<"Point" | "Rectangle" | "Polygon">("Point")
let latLongOrder = ref(true) // true for lat/lng, false for lng/lat
let inputValid = ref(false)
let validationMessage = ref("")
let parsedCoordinates = ref<number[][]>([])
let isInitializing = ref(false) // Flag to prevent reactive loops

let drawend = (event: any) => {
  let map = vectorRef.value.source
  let allFeatures = map.getFeatures()
  allFeatures.forEach((feature: Feature<Geometry>) => {
    if (feature === event.feature) return
    map.removeFeature(feature)
  })
  drawEnable.value = false
}

let selectedFeature = ref()

function featureSelected(event: any) {
  selectedFeature.value = event.selected[0]
}

function onChange(event: any) {
  let features = event.target.getFeatures()
  let featureCollection = geoJson.writeFeaturesObject(features)
  onValueChange?.(featureCollection)
}

// Global event listener for delete key
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Delete" || event.key === "Backspace") {
    removeSelectedFeature()
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown)
})

// Debug re-render tracking
let renderCount = 0
let lastRenderTime = Date.now()
let componentDisabled = ref(false)
const MAX_RENDERS = 1000

function removeSelectedFeature() {
  let map = vectorRef.value.source
  if (selectedFeature.value) {
    map.removeFeature(selectedFeature.value)
  }
}

function selectDrawType(type: "Point" | "Polygon" | "Circle") {
  drawType.value = type
  drawEnable.value = true
}

// Parse coordinate input and detect geometry type
function parseAndValidateCoordinates(input: string) {
  if (!input.trim()) {
    inputValid.value = false
    detectedGeometryType.value = null
    validationMessage.value = ""
    parsedCoordinates.value = []
    return null
  }

  try {
    // Clean up input - handle different separators
    let cleaned = input.trim()

    // Split by newlines to get potential coordinate pairs
    let lines = cleaned.split(/\n/).filter((line) => line.trim())

    // If we still only have one line, try to split by multiple spaces/tabs
    if (lines.length === 1) {
      let singleLine = lines[0]
      // Look for patterns like "coord1,coord2  coord3,coord4" (multiple spaces between coordinate pairs)
      let parts = singleLine.split(/\s{2,}|\t/).filter((part) => part.trim())
      if (parts.length > 1) {
        lines = parts
      }
    }

    let coordinates: number[][] = []

    for (let line of lines) {
      // Clean up each line - normalize internal spaces and commas
      let cleanLine = line
        .trim()
        .replace(/\s*,\s*/g, ",")
        .replace(/\s+/g, " ")

      // Try to parse coordinate pair from line
      let matches = cleanLine.match(/(-?\d+\.?\d*)\s*[,\s]\s*(-?\d+\.?\d*)/)

      if (!matches) {
        throw new Error(`Invalid coordinate format: "${line}"`)
      }

      let [, first, second] = matches
      let coord1 = parseFloat(first)
      let coord2 = parseFloat(second)

      if (isNaN(coord1) || isNaN(coord2)) {
        throw new Error(`Invalid numbers in: "${line}"`)
      }

      // Validate coordinate ranges (basic validation)
      if (latLongOrder.value) {
        // first is lat, second is lng
        if (coord1 < -90 || coord1 > 90) {
          throw new Error(
            `Invalid latitude: ${coord1} (must be between -90 and 90)`,
          )
        }
        if (coord2 < -180 || coord2 > 180) {
          throw new Error(
            `Invalid longitude: ${coord2} (must be between -180 and 180)`,
          )
        }
        coordinates.push([coord2, coord1]) // [lng, lat] for GeoJSON
      } else {
        // first is lng, second is lat
        if (coord1 < -180 || coord1 > 180) {
          throw new Error(
            `Invalid longitude: ${coord1} (must be between -180 and 180)`,
          )
        }
        if (coord2 < -90 || coord2 > 90) {
          throw new Error(
            `Invalid latitude: ${coord2} (must be between -90 and 90)`,
          )
        }
        coordinates.push([coord1, coord2]) // [lng, lat] for GeoJSON
      }
    }

    if (coordinates.length === 0) {
      throw new Error("No valid coordinates found")
    }

    // Detect geometry type
    if (coordinates.length === 1) {
      detectedGeometryType.value = "Point"
      selectedGeometryType.value = "Point"
    } else if (coordinates.length === 2) {
      detectedGeometryType.value = "Rectangle"
      selectedGeometryType.value = "Rectangle"
    } else {
      detectedGeometryType.value = "Polygon"
      selectedGeometryType.value = "Polygon"
    }

    inputValid.value = true
    parsedCoordinates.value = coordinates
    validationMessage.value = `Detected: ${detectedGeometryType.value} with ${coordinates.length} point${coordinates.length > 1 ? "s" : ""}`

    return coordinates
  } catch (error: any) {
    inputValid.value = false
    detectedGeometryType.value = null
    parsedCoordinates.value = []
    validationMessage.value = `Error: ${error.message}`
    return null
  }
}

// Convert GeoJSON FeatureCollection back to coordinate text format
function convertFeatureCollectionToCoordinateText(
  featureCollection?: FeatureCollection,
): string {
  if (
    !featureCollection ||
    !featureCollection.features ||
    featureCollection.features.length === 0
  ) {
    return ""
  }

  // Take the first feature for simplicity
  const feature = featureCollection.features[0]
  const geometry = feature.geometry

  if (!geometry) return ""

  const formatCoordinate = (coord: number[]) => {
    const [lng, lat] = coord
    return latLongOrder.value ? `${lat}, ${lng}` : `${lng}, ${lat}`
  }

  switch (geometry.type) {
    case "Point":
      return formatCoordinate(geometry.coordinates as number[])

    case "Polygon":
      const coordinates = geometry.coordinates[0] as number[][] // First ring

      // Check if this might be a rectangle (4 corners + closing point = 5 coordinates)
      if (coordinates.length === 5) {
        // Check if it's a rectangle by seeing if it has right angles
        const [nw, ne, se, sw] = coordinates
        const isRectangle =
          nw[1] === ne[1] && // NW and NE have same latitude
          se[1] === sw[1] && // SE and SW have same latitude
          nw[0] === sw[0] && // NW and SW have same longitude
          ne[0] === se[0] // NE and SE have same longitude

        if (isRectangle) {
          // Return as rectangle (NW and SE corners)
          return [formatCoordinate(nw), formatCoordinate(se)].join("\n")
        }
      }

      // Return as polygon (exclude the closing coordinate)
      return coordinates
        .slice(0, -1) // Remove closing coordinate
        .map(formatCoordinate)
        .join("\n")

    default:
      return ""
  }
}

// Initialize coordinate input with initial value
function initializeCoordinateInput() {
  if (initialValue) {
    const coordinateText =
      convertFeatureCollectionToCoordinateText(initialValue)
    if (coordinateText) {
      isInitializing.value = true
      coordinateInput.value = coordinateText
      // Trigger validation to set the detected geometry type
      parseAndValidateCoordinates(coordinateText)
      isInitializing.value = false
    }
  }
}

// Watch coordinate input for live validation
watch(coordinateInput, (newValue) => {
  // Skip parsing if we're in the middle of initializing to prevent reactive loops
  if (!isInitializing.value) {
    parseAndValidateCoordinates(newValue)
  }
})

watch(latLongOrder, () => {
  if (coordinateInput.value) {
    parseAndValidateCoordinates(coordinateInput.value)
  } else if (initialValue) {
    // Re-initialize coordinate input with new lat/lng order preference
    initializeCoordinateInput()
  }
})

function createGeometryFromCoordinates() {
  let coordinates = parseAndValidateCoordinates(coordinateInput.value)
  if (!coordinates || !inputValid.value) return

  let geometry: GeoJSONGeometry

  if (selectedGeometryType.value === "Point") {
    geometry = {
      type: "Point",
      coordinates: coordinates[0],
    }
  } else if (selectedGeometryType.value === "Rectangle") {
    // Create rectangle from NW and SE corners
    let [nw, se] = coordinates
    let [nwLng, nwLat] = nw
    let [seLng, seLat] = se

    geometry = {
      type: "Polygon",
      coordinates: [
        [
          [nwLng, nwLat], // NW
          [seLng, nwLat], // NE
          [seLng, seLat], // SE
          [nwLng, seLat], // SW
          [nwLng, nwLat], // Close polygon
        ],
      ],
    }
  } else {
    // Polygon
    // Close polygon if not already closed
    let coords = [...coordinates]
    if (coords.length > 2) {
      let first = coords[0]
      let last = coords[coords.length - 1]
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first) // Close polygon
      }
    }

    geometry = {
      type: "Polygon",
      coordinates: [coords],
    }
  }

  // Create feature and add to map
  let feature = geoJson.readFeature({
    type: "Feature",
    geometry: geometry,
    properties: {},
  })

  let map = vectorRef.value.source
  // Clear existing features
  map.clear()
  // Add new feature
  map.addFeature(feature)

  // Fit map to new feature
  setTimeout(() => {
    try {
      const extent = map.getExtent()
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
  }, 100)
}

function clearCoordinateInput() {
  coordinateInput.value = ""
  detectedGeometryType.value = null
  inputValid.value = false
  validationMessage.value = ""
  parsedCoordinates.value = []
}

const initialized = ref(false)

// Watch for changes to fit map to features and update coordinate input
watch(
  () => initialValue,
  (newValue) => {
    if (initialized.value) {
      return
    }

    initialized.value = true

    if (newValue && vectorRef.value?.source) {
      // Clear existing features
      vectorRef.value.source.clear()

      // Add new features
      const features = geoJson.readFeatures(newValue)
      features.forEach((feature) => {
        vectorRef.value.source.addFeature(feature)
      })

      if (features.length > 0) {
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
    }

    // Update coordinate input text with new initial value
    initializeCoordinateInput()
  },
  { immediate: true },
)

const viewRef = ref()

onMounted(() => {
  // Add initial features to the map
  if (initialFeatures.length > 0 && vectorRef.value?.source) {
    initialFeatures.forEach((feature) => {
      vectorRef.value.source.addFeature(feature)
    })

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

  // Initialize coordinate input with initial value
  initializeCoordinateInput()
})
</script>

<template>
  <div class="relative">
    <div class="absolute top-0 right-0 z-10 p-3 flex flex-col gap-2">
      <div class="flex flex-col">
        <Button
          v-if="!readOnly"
          variant="outline"
          size="icon"
          type="button"
          @click="() => selectDrawType('Point')"
          :class="{
            'bg-gray-100': drawType === 'Point' && drawEnable,
            'rounded-b-none': true,
          }"
        >
          <MapPin class="w-4 h-4" />
        </Button>

        <Button
          v-if="!readOnly"
          variant="outline"
          size="icon"
          type="button"
          @click="() => selectDrawType('Polygon')"
          :class="{
            'bg-gray-100': drawType === 'Polygon' && drawEnable,
            'rounded-t-none': true,
          }"
        >
          <Spline class="w-4 h-4" />
        </Button>
      </div>

      <Button
        v-if="selectedFeature"
        variant="outline"
        size="icon"
        type="button"
        @click="removeSelectedFeature"
      >
        <Trash2 class="w-4 h-4" />
      </Button>
    </div>

    <Map.OlMap
      class="rounded overflow-hidden aspect-[16/9] w-full"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
    >
      <Map.OlView :rotation="0" ref="viewRef" :center="center" :zoom="zoom" />

      <Layers.OlTileLayer>
        <Sources.OlSourceOsm />
      </Layers.OlTileLayer>

      <Interactions.OlInteractionSelect
        v-if="!drawEnable"
        @select="featureSelected"
      >
        <Styles.OlStyle>
          <Styles.OlStyleStroke color="blue" :width="10" />
          <Styles.OlStyleFill color="rgba(255, 255, 255, 0.4)" />
          <Styles.OlStyleIcon>
            <span class="w-5 h-5 bg-black/40 border-blue-500 border-[10px]" />
          </Styles.OlStyleIcon>
        </Styles.OlStyle>
      </Interactions.OlInteractionSelect>

      <Layers.OlVectorLayer>
        <Sources.OlSourceVector ref="vectorRef" @change="onChange">
          <Interactions.OlInteractionDraw
            v-if="drawEnable"
            :type="drawType"
            :stopClick="true"
            @drawend="drawend"
          >
            <Styles.OlStyle>
              <Styles.OlStyleStroke color="blue" :width="2" />
              <Styles.OlStyleFill color="rgba(255, 255, 0, 0.4)" />
              <Styles.OlStyleCircle :radius="5">
                <Styles.OlStyleFill color="#00dd11" />
                <Styles.OlStyleStroke color="blue" :width="2" />
              </Styles.OlStyleCircle>
            </Styles.OlStyle>
          </Interactions.OlInteractionDraw>
        </Sources.OlSourceVector>

        <Styles.OlStyle>
          <Styles.OlStyleStroke color="red" :width="2"></Styles.OlStyleStroke>
          <Styles.OlStyleFill
            color="rgba(255,255,255,0.1)"
          ></Styles.OlStyleFill>
          <Styles.OlStyleCircle :radius="7">
            <Styles.OlStyleFill color="red"></Styles.OlStyleFill>
          </Styles.OlStyleCircle>
        </Styles.OlStyle>
      </Layers.OlVectorLayer>
    </Map.OlMap>

    <!-- Coordinate Input Panel - Always visible -->
    <div v-if="!readOnly" class="mt-4 p-4 border rounded-lg bg-gray-50">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-sm">Enter coordinates manually</h3>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-6 w-6 p-0"
                type="button"
              >
                <HelpCircle class="h-4 w-4" />
                <span class="sr-only">Show coordinate examples</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80" align="end">
              <div class="space-y-3">
                <h4 class="font-medium text-sm">Coordinate Input Examples</h4>
                <div class="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Point:</strong><br />
                    <code class="bg-gray-100 px-1 rounded text-xs"
                      >40.7128, -74.0060</code
                    >
                  </div>
                  <div>
                    <strong>Rectangle:</strong><br />
                    <code
                      class="bg-gray-100 px-1 rounded text-xs whitespace-pre block"
                      >40.73, -73.94 <br />40.71, -73.92</code
                    >
                  </div>
                  <div>
                    <strong>Polygon:</strong><br />
                    <code class="bg-gray-100 px-1 rounded text-xs">
                      40.73, -73.94<br />
                      40.71, -73.94<br />
                      40.71, -73.92
                    </code>
                  </div>
                  <div class="text-gray-500 border-t pt-2 mt-2">
                    <strong>Tips:</strong><br />
                    • Use new lines to separate multiple coordinates<br />
                    • Rectangle mode creates a box from NW and SE corners<br />
                    • Polygon mode automatically closes the shape
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Textarea
          v-model="coordinateInput"
          placeholder="40.7128, -74.0060"
          class="min-h-[80px] text-sm"
        />

        <!-- Options -->
        <div class="space-y-3">
          <!-- Coordinate Order Toggle -->
          <div class="flex items-center space-x-2">
            <Checkbox id="latLngOrder" v-model:checked="latLongOrder" />
            <label for="latLngOrder" class="text-sm">
              Lat/Lng order (uncheck for Lng/Lat)
            </label>
          </div>
        </div>

        <!-- Validation Message -->
        <div
          v-if="validationMessage"
          class="text-xs p-2 rounded"
          :class="
            inputValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          "
        >
          {{ validationMessage }}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <Button
            type="button"
            size="sm"
            :disabled="!inputValid"
            @click="createGeometryFromCoordinates"
          >
            Create Geometry
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            @click="clearCoordinateInput"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
