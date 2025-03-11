<script setup lang="ts">
import { ref } from "vue"
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import type { FeatureCollection } from "geojson"
import { transformExtent } from "ol/proj"
import type { Extent } from "ol/extent"
import { pointerMove, click } from "ol/events/condition"

let geoJson = new GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857",
})

let { featureCollection, onChangeBbox, onHoverItem } = defineProps<{
  featureCollection?: FeatureCollection
  onChangeBbox(bbox: Extent): void
  onHoverItem?(id: string): void
}>()

let selectCondition = onHoverItem ? pointerMove : click

let features = computed(() =>
  featureCollection ? geoJson.readFeatures(featureCollection) : undefined,
)

let center = ref([0, 0])
let zoom = ref(1)

let vectorRef = ref()

let selectedFeature = ref()

function featureSelected(event) {
  selectedFeature.value = event.selected[0]

  onHoverItem?.(selectedFeature.value?.getId())
}

function onMoveEnd(event) {
  let extent = event.map.getView().calculateExtent(event.map.getSize())
  let bbox = transformExtent(
    extent,
    event.map.getView().getProjection(),
    "EPSG:4326",
  )

  onChangeBbox(bbox)
}
</script>

<template>
  <div class="relative w-full h-full">
    <Map.OlMap
      @moveend="onMoveEnd"
      class="overflow-hidden w-full h-full"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
    >
      <Map.OlView ref="view" :center="center" :zoom="zoom" />

      <Layers.OlTileLayer>
        <Sources.OlSourceOsm />
      </Layers.OlTileLayer>

      <Interactions.OlInteractionSelect
        @select="featureSelected"
        :condition="selectCondition"
      >
        <Styles.OlStyle>
          <Styles.OlStyleStroke color="#10b981" :width="4" />
          <Styles.OlStyleFill color="rgba(255, 255, 255, 0.4)" />
          <Styles.OlStyleIcon>
            <span class="w-5 h-5 bg-black/40 border-blue-500 border-[10px]" />
          </Styles.OlStyleIcon>
        </Styles.OlStyle>
      </Interactions.OlInteractionSelect>

      <Layers.OlVectorLayer>
        <Sources.OlSourceVector
          ref="vectorRef"
          :features="features"
          :format="geoJson"
        />

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
