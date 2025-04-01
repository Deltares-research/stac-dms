<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import type { FeatureCollection } from "geojson"
import { transformExtent } from "ol/proj"
import {
  createEmpty,
  extend,
  getBottomRight,
  getCenter,
  type Extent,
} from "ol/extent"
import { click } from "ol/events/condition"
import Text from "ol/style/Text"
import { Fill, Icon, Style } from "ol/style"
import CircleStyle from "ol/style/Circle"
import type { GeometryFunction } from "ol/style/Style"
import { Feature } from "ol"
import dateFormat from "dateformat"

function createMarkerSvg(color: string = "rgba(79,117,167,1)") {
  return `
data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" >
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
</svg>
`
}

let geoJson = new GeoJSON({
  dataProjection: "EPSG:4326",
  featureProjection: "EPSG:3857",
})

let { featureCollection, onChangeBbox, onHoverItem } = defineProps<{
  featureCollection?: FeatureCollection
  onChangeBbox(bbox: Extent): void
  onHoverItem?(id: string): void
}>()

let selectCondition = click

let features = computed(() =>
  featureCollection ? geoJson.readFeatures(featureCollection) : undefined,
)

let center = ref([0, 0])
let zoom = ref(1)

let vectorRef = ref()
let mapRef = ref()
let viewRef = ref()

let selectedFeature = ref<Feature | undefined>()

function featureClicked(event: { selected: Feature[] }) {
  const clickedFeature = event.selected[0]

  // Check if the selected feature exists
  if (!clickedFeature) return

  // Check if the selected feature is a cluster by checking for the 'features' property
  const isCluster = clickedFeature.get("features") !== undefined

  // If it's not a cluster, we can directly use the feature ID for hover
  if (!isCluster) {
    selectedFeature.value = clickedFeature

    return
  }

  // Check if the selected feature is a cluster
  const clusterMembers = clickedFeature.get("features") as Feature[]

  if (clusterMembers?.length === 1) {
    selectedFeature.value = clusterMembers[0]

    return
  }

  const extent = createEmpty()

  clusterMembers?.forEach((member) => {
    const memberExtent = member.getGeometry()?.getExtent()
    if (memberExtent) {
      extend(extent, memberExtent)
    }
  })

  viewRef.value?.fit(extent, {
    padding: [50, 50, 50, 50],
    duration: 500,
    maxZoom: 10,
  })
}

const selectedFeatureCenter = computed(() => {
  if (!selectedFeature.value) return undefined

  // Get the center of the feature's geometry as the base position
  return getCenter(selectedFeature.value.getGeometry()?.getExtent() as Extent)
})

const selectedFeatureProperties = computed(() => {
  if (!selectedFeature.value) return undefined

  return selectedFeature.value.getProperties()
})

function onMoveEnd(event: { map: any; target: any }) {
  let extent = event.map.getView().calculateExtent(event.map.getSize())
  let bbox = transformExtent(
    extent,
    event.map.getView().getProjection(),
    "EPSG:4326",
  )

  onChangeBbox(bbox)
}

// Zoom to fit all features when featureCollection updates
watch(
  () => JSON.stringify(featureCollection),
  async (newVal) => {
    if (newVal && features.value?.length) {
      // Wait for features to be rendered
      await nextTick()

      // Get the source from the vector layer
      const source = vectorRef.value?.source

      if (source) {
        // Get the extent of all features
        const extent = source.getExtent()

        // Check if extent is valid (not empty)
        if (
          extent &&
          !extent.every((val: number) => val === Infinity || val === -Infinity)
        ) {
          // Fit view to the features extent with some padding
          viewRef.value?.fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 500,
            maxZoom: 10,
          })
        }
      }
    }
  },
  { immediate: true },
)

const overrideStyleFunction: Styles.OverrideStyleFunction = (feature) => {
  const clusteredFeatures = feature.get("features")
  const size = clusteredFeatures.length

  if (size > 1) {
    return new Style({
      image: new CircleStyle({
        radius: size * 4 + 8,
        fill: new Fill({ color: "rgba(79,117,167,1)" }),
      }),
      text: new Text({
        text: size.toString(),
        font: `16px sans-serif`,
        fill: new Fill({ color: "#ffffff" }),
      }),
    })
  }

  return new Style({
    image: new Icon({
      src: createMarkerSvg(),
    }),
  })
}

const geometryFunction: GeometryFunction = (feature) => {
  const type = feature.getGeometry()?.getType()

  if (type === "Point") {
    return feature.getGeometry()
  }

  return undefined
}

function outsideClick() {
  selectedFeature.value = undefined
}
</script>

<template>
  <div class="relative w-full h-full">
    <Map.OlMap
      ref="mapRef"
      @moveend="onMoveEnd"
      class="overflow-hidden w-full h-full"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      @click="outsideClick"
    >
      <Map.OlView ref="viewRef" :center="center" :zoom="zoom" />

      <Layers.OlTileLayer>
        <Sources.OlSourceOsm />
      </Layers.OlTileLayer>

      <Interactions.OlInteractionSelect
        @select.stop="featureClicked"
        :condition="selectCondition"
      >
        <Styles.OlStyle>
          <Styles.OlStyleStroke color="rgba(79,117,167,1)" :width="3" />
          <Styles.OlStyleFill color="rgba(44, 82, 133, 0.4)" />

          <Styles.OlStyleIcon :src="createMarkerSvg('rgba(44, 82, 133, 1)')" />
        </Styles.OlStyle>
      </Interactions.OlInteractionSelect>

      <Map.OlOverlay
        :position="selectedFeatureCenter"
        v-if="selectedFeature"
        :autoPan="{
          animation: {
            duration: 250,
          },
          margin: 20,
        }"
        :offset="[0, -32]"
        positioning="bottom-center"
      >
        <template v-slot="slotProps">
          <Card class="min-w-[300px] max-w-[420px]">
            <CardHeader>
              <CardTitle class="text-xl">
                {{
                  selectedFeatureProperties?.title ?? selectedFeature?.getId()
                }}
              </CardTitle>
              <CardDescription>{{
                selectedFeatureProperties?.description
              }}</CardDescription>
            </CardHeader>
            <CardContent v-if="selectedFeatureProperties?.datetime">
              <NuxtLink :to="'/items/' + selectedFeature?.getId() + '/view'"
                >View details</NuxtLink
              >
              <div class="text-xs text-muted-foreground">
                {{
                  dateFormat(
                    new Date(selectedFeatureProperties?.datetime),
                    "mmmm dS, yyyy",
                  )
                }}
              </div>
            </CardContent>
          </Card>
        </template>
      </Map.OlOverlay>

      <Layers.OlVectorLayer id="cluster">
        <Sources.OlSourceCluster
          :distance="80"
          :minDistance="40"
          :geometryFunction="geometryFunction"
        >
          <Sources.OlSourceVector
            ref="vectorRef"
            :features="features"
            :format="geoJson"
          />
        </Sources.OlSourceCluster>

        <Styles.OlStyle :overrideStyleFunction="overrideStyleFunction" />
      </Layers.OlVectorLayer>

      <Layers.OlVectorLayer>
        <Sources.OlSourceVector
          :features="
            features?.filter(
              (feature) => feature.getGeometry()?.getType() !== 'Point',
            )
          "
          :format="geoJson"
        />

        <Styles.OlStyle>
          <Styles.OlStyleFill color="rgba(79,117,167,0.4)" />
          <Styles.OlStyleStroke color="rgba(79,117,167,1)" :width="3" />
        </Styles.OlStyle>
      </Layers.OlVectorLayer>
    </Map.OlMap>
  </div>
</template>
