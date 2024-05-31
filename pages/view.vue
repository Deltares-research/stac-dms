<script setup lang="ts">
import { ref } from "vue"
import { MapboxMap } from "@studiometa/vue-mapbox-gl"
import "../node_modules/mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const mapCenter = ref([0, 0])
import Label from "@/components/ui/label/Label.vue"

const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw"
</script>

<template>
  <Label class="text-3xl p-5 flex justify-center">Details data set</Label>
  <Card>
    <CardHeader>Data set collection</CardHeader>
    <CardContent>
      <Label>GeoCentrifuge</Label>
    </CardContent>
    <Card>
      <CardHeader>General information</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label>Project number</Label>
          <Label>11206575-019</Label>
          <Label>Project title</Label>
          <Label>MIDAS I extra tests</Label>
          <Label>Date data set</Label>
          <Label>13-03-2023</Label>
          <Label for="status">Status</Label>
          <Label for="status">Completed</Label>
          <Label for="language">Language</Label>
          <Label for="language">English</Label>
          <Label for="description">Description</Label>
          <Label for="description"
            >Additional tests for MIDAS I. Research on lateral loading on
            monopiles</Label
          >
          <Label for="storagelocation">Storage location</Label>
          <Label for="storagelocation"
            >P:\geocentrifuge\11203259-014 - MIDAS Extra tests 2023</Label
          >
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>Keywords</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label for="keywords" class="m-2">Keywords</Label>
          <Label for="keywords" class="m-2">No keywords defined</Label>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>Restrictions</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label class="m-2" for="accescontraints">Access constraints</Label>
          <Label class="m-2" for="accescontraints">Trademark</Label>
        </div>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label class="m-2" for="limitusage">Usage limits</Label>
          <Label class="m-2" for="limitusage">No limits defined</Label>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>Spatial information</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label class="m-2" for="spatialreference"
            >Spatial reference system</Label
          >
          <Label class="m-2" for="spatialreference">WGS 84</Label>
          <Label class="m-2" for="map">Geometry</Label>
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
  </Card>
</template>
