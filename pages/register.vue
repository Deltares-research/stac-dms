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
import Container from "~/components/deltares/Container.vue"
import Textarea from "~/components/ui/textarea/Textarea.vue"

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
  <Container class="py-8">
    <h1 class="text-3xl flex font-semibold">Register your data</h1>

    <div class="mt-8 grid grid-flow-row gap-5">
      <Card>
        <CardHeader
          ><CardTitle class="text-lg"
            >Data set collection</CardTitle
          ></CardHeader
        >
        <CardContent>
          <CustomDropDownComponent
            id="language"
            :options="frameworks"
            v-model="value"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          ><CardTitle class="text-lg"
            >General information</CardTitle
          ></CardHeader
        >
        <CardContent>
          <div
            class="grid grid-cols-[max-content_1fr] gap-5 items-center items-center"
          >
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
            <Label for="datum type">Datum type</Label>
            <CustomDropDownComponent
              id="datum type"
              :options="datumTypes"
              v-model="selectedDatumType"
            />
            <Label for="status">Status</Label>
            <CustomDropDownComponent
              id="status"
              :options="statusTypes"
              v-model="selectedStatus"
            />
            <Label for="language">Language</Label>
            <CustomDropDownComponent
              id="language"
              :options="languages"
              v-model="selectedLanguage"
            />
            <Label for="description">Description</Label>
            <Textarea id="description" />
            <Label for="storagelocation">Storage location</Label>
            <Input id="storagelocation" type="text" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle class="text-lg">Keywords</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-5 items-center">
            <Label for="keywords">Keywords</Label>
            <Input id="keywords"></Input>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          ><CardTitle class="text-lg">Restrictions</CardTitle></CardHeader
        >
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-5 items-center">
            <Label for="accescontraints">Access constraints</Label>
            <CustomDropDownComponent
              id="accescontraints"
              :options="accessConstraints"
              v-model="selectedAccessConstraint"
            />
            <Label for="limitusage">Usage limits</Label>
            <Input id="limitusage" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          ><CardTitle class="text-lg"
            >Spatial information</CardTitle
          ></CardHeader
        >
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-5 items-center">
            <Label for="spatialreference">Spatial reference system</Label>
            <CustomDropDownComponent
              id="spatialreference"
              :options="spatialReferences"
              v-model="selectedSpatialReference"
            />
            <Label for="map">Geometry</Label>
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
        <CardHeader
          ><CardTitle class="text-lg">Numerical models</CardTitle></CardHeader
        >
        <CardContent>
          <div class="grid grid-cols-[max-content_1fr] gap-5 items-center">
            <Label for="assets">Assets</Label>
            <Button
              id="assets"
              variant="outline"
              class="w-fit justify-start text-left font-normal"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Assets
            </Button>
            <Label for="properties">More properties</Label>
            <Button
              id="properties"
              variant="outline"
              class="w-fit justify-start text-left font-normal"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Numerical models
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </Container>
</template>
