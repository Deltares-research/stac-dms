<script setup lang="ts">
// This route functions as a demo

import GeometryDraw from "~/components/GeometryDraw.vue"
import type { FeatureCollection } from "geojson"

let value = ref<FeatureCollection>({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-2629065.199942168, 5294768.771676265],
            [5317816.899121739, 5351088.490832003],
            [5317816.899121739, -834604.6000602674],
            [-6897722.107977686, -1076153.6177726556],
            [-2629065.199942168, 5294768.771676265],
          ],
        ],
      },
      properties: null,
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-11455697.705430442, 6953071.613484104],
      },
      properties: null,
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [9487830.25153137, 4561182.0805778755],
      },
      properties: null,
    },
  ],
})

function setValue(newValue: FeatureCollection) {
  console.log(newValue)
  value.value = newValue
}
</script>

<template>
  <div class="container mx-auto">
    <ClientOnly>
      <GeometryDraw :initialValue="value" @valueChange="setValue" />
    </ClientOnly>

    <pre class="mt-12">{{ JSON.stringify(value, null, 2) }}</pre>
  </div>
</template>
