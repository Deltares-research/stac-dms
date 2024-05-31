<script setup lang="ts">
import { ref } from "vue"
import { cn } from "@/lib/utils"
import { PlusIcon } from "@radix-icons/vue"
import { MapboxMap } from "@studiometa/vue-mapbox-gl"
import "../node_modules/mapbox-gl/dist/mapbox-gl.css"
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

import { Calendar as CalendarIcon } from "lucide-vue-next"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

const mapCenter = ref([0, 0])
import Label from "@/components/ui/label/Label.vue"
import CustomDropDownComponent from "@/components/CustomDropDownComponent.vue"

const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw"
const selectedStatus = ref("")
const statusTypes = [
  { value: "completed", label: "completed" },
  { value: "historicalArchive", label: "historical archive" },
  { value: "obsolete", label: "obsolete" },
  { value: "onGoing", label: "on going" },
  { value: "planned", label: "planned" },
  { value: "required", label: "required" },
  { value: "underDevelopment", label: "under development" },
]

const selectedDatumType = ref("")
const datumTypes = [
  { value: "creation", label: "creation" },
  { value: "publication", label: "publication" },
  { value: "revision", label: "revision" },
]

const frameworks = [
  { value: "GeoCentrifuge", label: "GeoCentrifuge" },
  { value: "Deltagoot", label: "Deltagoot" },
]

const selectedLanguage = ref("")
const languages = [
  { value: "du", label: "Dutch" },
  { value: "eng", label: "English" },
  { value: "ger", label: "German" },
]
const spatialReferences = [{ value: "WGS 84", label: "WGS 84" }]

const accessConstraints = [
  { value: "copyright", label: "copyright" },
  { value: "patentPending", label: "patent pending" },
  { value: "trademark", label: "trademark" },
  { value: "license", label: "license" },
]
const selectedAccessConstraint = ref("")
const selectedSpatialReference = ref("")

const value = ref("")
const dateDataSet = ref<DateValue>()
</script>

<template>
  <Label class="text-3xl flex justify-center p-5">Register your data</Label>
  <Card>
    <CardHeader>Data set collection</CardHeader>
    <CardContent>
      <CustomDropDownComponent
        id="language"
        :options="frameworks"
        v-model="value"
      />
    </CardContent>
    <Card>
      <CardHeader>General information</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label for="projectnumber">Project number</Label>
          <Input id="projectnumber" type="text" />
          <Label for="projecttitle">Project title</Label>
          <Input id="projecttitle" type="text" />
          <Label for="dateDataSet">Date data set</Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                id="dateDataSet"
                variant="outline"
                :class="
                  cn(
                    'w-[280px] justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{
                  dateDataSet
                    ? df.format(dateDataSet.toDate(getLocalTimeZone()))
                    : "Pick a date"
                }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="dateDataSet" initial-focus />
            </PopoverContent>
          </Popover>
          <Label class="m-2" for="datum type">Datum type</Label>
          <CustomDropDownComponent
            id="datum type"
            :options="datumTypes"
            v-model="selectedDatumType"
          />
          <Label class="m-2" for="status">Status</Label>
          <CustomDropDownComponent
            id="status"
            :options="statusTypes"
            v-model="selectedStatus"
          />
          <Label class="m-2" for="language">Language</Label>
          <CustomDropDownComponent
            id="language"
            :options="languages"
            v-model="selectedLanguage"
          />
          <Label class="m-2" for="description">Description</Label>
          <textarea class="m-2" id="description" />
          <Label class="m-2" for="storagelocation">Storage location</Label>
          <Input class="m-2" id="storagelocation" type="text" />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>Keywords</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label for="keywords" class="m-2">Keywords</Label>
          <Input id="keywords"></Input>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>Restrictions</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label class="m-2" for="accescontraints">Access constraints</Label>
          <CustomDropDownComponent
            id="accescontraints"
            :options="accessConstraints"
            v-model="selectedAccessConstraint"
          />
        </div>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label class="m-2" for="limitusage">Usage limits</Label>
          <Input id="limitusage" />
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
          <CustomDropDownComponent
            id="spatialreference"
            :options="spatialReferences"
            v-model="selectedSpatialReference"
          />
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
    <Card>
      <CardHeader>Numerical models</CardHeader>
      <CardContent>
        <div class="grid grid-cols-[15%_85%] gap-5 p-5">
          <Label for="assets" class="m-2">Assets</Label>
          <Button
            id="assets"
            variant="outline"
            class="w-[280px] justify-start text-left font-normal"
          >
            <PlusIcon class="w-4 h-4" />
            Assets
          </Button>
          <Label for="properties" class="m-2">More properties</Label>
          <Button
            id="properties"
            variant="outline"
            class="w-[280px] justify-start text-left font-normal"
          >
            <PlusIcon class="w-4 h-4" />
            Numerical models
          </Button>
        </div>
      </CardContent>
    </Card>
  </Card>
</template>
