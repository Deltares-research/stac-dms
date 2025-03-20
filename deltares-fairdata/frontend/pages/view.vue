<script setup lang="ts">
import { ref } from "vue"
import { MapboxMap } from "@studiometa/vue-mapbox-gl"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import Label from "@/components/ui/label/Label.vue"
import Container from "~/components/deltares/Container.vue"

import "../node_modules/mapbox-gl/dist/mapbox-gl.css"

const mapCenter = ref([0, 0])
const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw"
</script>

<template>
  <Container class="py-8">
    <h1 class="text-3xl font-semibold">Details data set</h1>
    <p class="text-muted-foreground">GeoCentrifuge</p>
    <div class="grid grid-flow-row gap-5 mt-8">
      <Card>
        <CardHeader><CardTitle>General information</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3 text-sm">
            <strong class="font-semibold">Project number</strong>
            <div>11206575-019</div>
            <strong class="font-semibold">Project title</strong>
            <div>MIDAS I extra tests</div>
            <strong class="font-semibold">Date data set</strong>
            <div>13-03-2023</div>
            <strong class="font-semibold">Status</strong>
            <div>Completed</div>
            <strong class="font-semibold">Language</strong>
            <div>English</div>
            <strong class="font-semibold">Description</strong>
            <div>
              Additional tests for MIDAS I. Research on lateral loading on
              monopiles
            </div>
            <strong>Storage location</strong>
            <div>P:\geocentrifuge\11203259-014 - MIDAS Extra tests 2023</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Keywords</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3">
            <strong class="font-semibold">Keywords</strong>
            <div>No keywords defined</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Restrictions</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3">
            <strong class="font-semibold">Access constraints</strong>
            <div>Trademark</div>
            <strong class="font-semibold">Usage limits</strong>
            <div>No limits defined</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Spatial information</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3">
            <strong class="font-semibold">Spatial reference system</strong>
            <div>WGS 84</div>
            <strong class="font-semibold">Geometry</strong>
            <div>
              <MapboxMap
                id="map"
                style="height: 400px; width: 600px"
                :access-token="accesToken"
                map-style="mapbox://styles/mapbox/streets-v11"
                :center="mapCenter"
                :zoom="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </Container>
</template>
