<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers"
import { GeoJSON } from "ol/format"
import type { FeatureCollection } from "geojson"
import { transformExtent } from "ol/proj"
import { createEmpty, extend, getCenter, type Extent } from "ol/extent"
import { pointerMove } from "ol/events/condition"
import Text from "ol/style/Text"
import { Fill, Icon, Stroke, Style } from "ol/style"
import CircleStyle from "ol/style/Circle"
import type { GeometryFunction } from "ol/style/Style"
import { Feature, MapBrowserEvent } from "ol"
import dateFormat from "dateformat"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselApi,
} from "@/components/ui/carousel"
import { watchOnce } from "@vueuse/core"

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

let { featureCollection, onChangeBbox, onHoverItem, onActiveItem } =
  defineProps<{
    featureCollection?: FeatureCollection
    onChangeBbox(bbox: Extent): void
    onHoverItem?(id: string): void
    onActiveItem?(id: string): void
  }>()

let features = computed(() =>
  featureCollection ? geoJson.readFeatures(featureCollection) : undefined,
)

let center = ref([0, 0])
let zoom = ref(1)

let vectorRef = ref()
let mapRef = ref()
let viewRef = ref()

let selectedFeatures = ref<Feature[]>([])
let clickPosition = ref<[number, number] | undefined>()

function handleClick(event: MapBrowserEvent<UIEvent>) {
  selectedFeatures.value = []
  activeFeatureId.value = undefined
  // Get features at the click position
  const map = event.target
  if (!map || !event || !event.coordinate) {
    return
  }
  const featuresAtPixel: Feature[] = []
  map.forEachFeatureAtPixel(
    map.getPixelFromCoordinate(event.coordinate),
    (feature: Feature) => {
      featuresAtPixel.push(feature)
    },
  )

  selectedFeatures.value = featuresAtPixel

  // Store the click position if available
  clickPosition.value = event.coordinate as [number, number]

  let containsCluster = false

  const clickedFeatures = featuresAtPixel.flatMap((feature: Feature) => {
    const clusterMembers = feature.get("features") as Feature[]

    if (clusterMembers) {
      containsCluster = true
    }

    return clusterMembers ? clusterMembers : feature
  })

  selectedFeatures.value = clickedFeatures

  activeFeatureId.value = clickedFeatures[0]?.getId()

  if (!containsCluster) {
    return
  }

  const extent = createEmpty()
  clickedFeatures?.forEach((member) => {
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

const popupPosition = computed(() => {
  // Use click position if available, otherwise fall back to first feature center
  if (clickPosition.value) {
    return clickPosition.value
  }

  if (selectedFeatures.value.length > 0) {
    const firstFeature = selectedFeatures.value[0]
    return getCenter(firstFeature.getGeometry()?.getExtent() as Extent)
  }

  return undefined
})

const selectedFeatureProperties = computed(() => {
  if (selectedFeatures.value.length === 0) return undefined

  return selectedFeatures.value[0].getProperties()
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

const carouselApi = ref<CarouselApi>()
const activeFeatureId = ref<string | number | undefined>()

function handleCarouselInit(api: CarouselApi) {
  carouselApi.value = api
}

watchOnce(carouselApi, (api) => {
  if (!api) return

  api.on("select", () => {
    activeFeatureId.value =
      selectedFeatures.value[api.selectedScrollSnap() || 0]?.getId()
  })
})

watch(activeFeatureId, () => {
  const val = activeFeatureId.value
  if (!val) return
  onActiveItem?.(String(val))
})

const getHighlightedStyles: Styles.OverrideStyleFunction = (feature) => {
  // TODO: Delay in map rendering makes this confusing
  const isActive = false
  // const isActive = feature.getId() === activeFeatureId.value

  return [
    new Style({
      stroke: new Stroke({
        color: isActive ? "rgba(255, 204, 0, 1)" : "rgba(79,117,167,1)",
        width: 3,
      }),
      fill: new Fill({
        color: isActive ? "rgba(255, 204, 0, 0.4)" : "rgba(44, 82, 133, 0.4)",
      }),
      image: new Icon({
        src: createMarkerSvg("rgba(44, 82, 133, 1)"),
      }),
    }),
  ]
}

const getHoverStyles: Styles.OverrideStyleFunction = (feature) => {
  return [
    new Style({
      stroke: new Stroke({
        color: "rgba(255, 204, 0, 1)",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(255, 204, 0, 0.4)",
      }),
      image: new Icon({
        src: createMarkerSvg("rgba(44, 82, 133, 1)"),
      }),
    }),
  ]
}

function onInteractionHover(event: { selected: Feature[] }) {
  onHoverItem?.(String(event.selected[0]?.getId()))
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
      @click="handleClick"
    >
      <Map.OlView ref="viewRef" :center="center" :zoom="zoom" />

      <Layers.OlTileLayer>
        <Sources.OlSourceOsm />
      </Layers.OlTileLayer>

      <Interactions.OlInteractionSelect
        :condition="pointerMove"
        @select.stop="onInteractionHover"
      >
        <Styles.OlStyle :overrideStyleFunction="getHoverStyles" />
      </Interactions.OlInteractionSelect>

      <Map.OlOverlay
        :position="popupPosition"
        v-if="selectedFeatures.length > 0"
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
          <!-- Multiple features carousel -->
          <Card class="min-w-[350px] max-w-[500px]">
            <CardHeader class="hidden">
              <CardTitle class="text-xl">
                {{ selectedFeatures.length }} features found
              </CardTitle>
              <CardDescription
                >Use the arrows to browse through features</CardDescription
              >
            </CardHeader>
            <CardContent>
              <Carousel class="w-full" @init-api="handleCarouselInit">
                <CarouselContent class="w-full pt-5">
                  <CarouselItem
                    v-for="feature in selectedFeatures"
                    :key="feature.getId()"
                  >
                    <div class="space-y-3">
                      <h3 class="font-semibold text-lg">
                        {{ feature.getProperties()?.title ?? feature.getId() }}
                      </h3>
                      <p
                        v-if="feature.getProperties()?.description"
                        class="text-sm text-muted-foreground"
                      >
                        {{ feature.getProperties()?.description }}
                      </p>
                      <div class="space-y-2">
                        <NuxtLink
                          :to="'/items/' + feature.getId() + '/view'"
                          class="text-primary hover:underline"
                        >
                          View details
                        </NuxtLink>
                        <div
                          class="text-xs text-muted-foreground"
                          v-if="feature.getProperties()?.datetime"
                        >
                          {{
                            dateFormat(
                              new Date(feature.getProperties()?.datetime),
                              "mmmm dS, yyyy",
                            )
                          }}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselDots v-if="selectedFeatures.length > 1" />
                <CarouselPrevious v-if="selectedFeatures.length > 1" />
                <CarouselNext v-if="selectedFeatures.length > 1" />
              </Carousel>
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

      <Layers.OlVectorLayer id="features">
        <Sources.OlSourceVector
          :features="
            features?.filter(
              (feature) => feature.getGeometry()?.getType() !== 'Point',
            )
          "
          :format="geoJson"
        />

        <Styles.OlStyle :overrideStyleFunction="getHighlightedStyles">
          <Styles.OlStyleFill color="rgba(79,117,167,0.4)" />
          <Styles.OlStyleStroke color="rgba(79,117,167,1)" :width="3" />
        </Styles.OlStyle>
      </Layers.OlVectorLayer>
    </Map.OlMap>
  </div>
</template>
