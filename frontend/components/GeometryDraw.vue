<script setup lang="ts">
import { ref } from "vue"
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import type { FeatureCollection } from "geojson"
import { Circle, MapPin, Pentagon, Spline, Trash2 } from "lucide-vue-next"

let geoJson = new GeoJSON()

let projection = ref("EPSG:3857")

let { onValueChange, initialValue } = defineProps<{
  onValueChange?: (newValue: FeatureCollection) => void
  initialValue?: FeatureCollection
}>()

let initialFeatures = geoJson.readFeatures(initialValue, {
  featureProjection: "EPSG:4326",
  dataProjection: "EPSG:3857",
})

let center = ref([0, 0])
let zoom = ref(1)

let vectorRef = ref()

let drawEnable = ref(false)
let drawType = ref<"Polygon" | "Point" | "Circle">("Polygon")

let drawend = (event) => {
  let map = vectorRef.value.source
  let allFeatures = map.getFeatures()
  allFeatures.forEach((feature) => {
    if (feature === event.feature) return
    map.removeFeature(feature)
  })
  drawEnable.value = false
}

let selectedFeature = ref()

function featureSelected(event) {
  selectedFeature.value = event.selected[0]
}

function onChange(event) {
  let features = event.target.getFeatures()
  let featureCollection = geoJson.writeFeaturesObject(features, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  })
  onValueChange?.(featureCollection)
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Delete" || event.key === "Backspace") {
    removeSelectedFeature()
  }
})

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
</script>

<template>
  <div class="relative">
    <div class="absolute top-0 right-0 z-10 p-3 flex flex-col gap-2">
      <div class="flex flex-col">
        <Button
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

        <!--        <Button-->
        <!--          variant="outline"-->
        <!--          size="icon"-->
        <!--          type="button"-->
        <!--          @click="() => selectDrawType('Circle')"-->
        <!--          :class="{-->
        <!--            'bg-gray-100': drawType === 'Circle' && drawEnable,-->
        <!--            'rounded-none border-y-0': true,-->
        <!--          }"-->
        <!--        >-->
        <!--          <Circle class="w-4 h-4" />-->
        <!--        </Button>-->
        <Button
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
      <Map.OlView
        :projection="projection"
        :rotation="0"
        ref="view"
        :center="center"
        :zoom="zoom"
      />

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
        <Sources.OlSourceVector
          ref="vectorRef"
          @change="onChange"
          :features="initialFeatures"
          :format="geoJson"
        >
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
  </div>
</template>
