<script setup lang="ts">
import { Search } from "lucide-vue-next"
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { MapboxMap } from "@studiometa/vue-mapbox-gl"
import { ref } from "vue"
import { Calendar as CalendarIcon } from "lucide-vue-next"
import { Calendar } from "@/components/ui/calendar"
import { ChevronRight, ChevronDown } from "lucide-vue-next"

const keywords = [
  { value: "Unprotected foundation", label: "Unprotected foundation" },
  { value: "Scour protection", label: "Scour protection" },
]
const selectedKeyword = ref("")

const catalogues = [
  { value: "numerical models", label: "numerical models" },
  { value: "experimental facilities", label: "experimental facilities" },
]
const selectedCatalogue = ref("")

const collection = [
  { value: "GeoCentrifuge", label: "GeoCentrifuge" },
  { value: "Delta Basin", label: "Delta Basin" },
]
const selectedCollection = ref("")
const mapCenter = ref([0, 0])
const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw"
const loginDone = ref(false)
const isOpenKeywords = ref(false)
const isOpen = ref(false)
const value = ref("")
const dateDataSet = ref<DateValue>()
const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

function login() {
  loginDone.value = true
}
</script>

<template>
  <div class="grid grid-cols-2 justify-center p-5 size-full...">
    <div class="grid grid-cols-1 justify-center p-5 size-full...">
      <div>
        <div class="relative w-full max-w-sm items-center">
          <Input
            id="search"
            type="text"
            placeholder="Search in title or description..."
            class="pl-10"
          />
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>
      </div>
      <div class="p-5">
        <Label for="dateDataSet" class="pe-4">Start</Label>
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
        <Label for="dateDataSet" class="p-5">End</Label>
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Experimental facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 justify-center p-1 size-full...">
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">GeoCentrifuge</Label>
            </div>
            <div>
              <Checkbox id="DeltaBasin" />
              <Label class="m-2" for="DeltaBasin">DeltaBasin</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">Altantic Basin</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">BioChemisch Lab</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">Another one..</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge"
                >Another one to fill the board</Label
              >
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">The last one</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Numerical Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 justify-center p-1 size-full...">
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">Model</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">Another model</Label>
            </div>
            <div>
              <Checkbox id="GeoCentrifuge" />
              <Label class="m-2" for="GeoCentrifuge">Yet another model</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div>
      <MapboxMap
        id="map"
        style="height: 500px; width: 700px"
        :access-token="accesToken"
        map-style="mapbox://styles/mapbox/streets-v11"
        :center="mapCenter"
        :zoom="1"
      />
    </div>
  </div>
  <div class="flex justify-end p-5 ...">
    <div>
      <Button>Search</Button>
    </div>
  </div>
  <div class="grid grid-cols-[25%_75%] px-5">
    <div class="grid grid-cols-1">
      <Collapsible v-model:open="isOpenKeywords">
        <CollapsibleTrigger as-child>
          <Button variant="ghost" size="sm" class="w-19 p-0">
            Keywords
            <ChevronRight class="h-4 w-4" v-if="!isOpenKeywords" />
            <ChevronDown class="h-4 w-4" v-if="isOpenKeywords" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="grid grid-cols-1">
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Wave
              </label>
            </div>
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Damage
              </label>
            </div>
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Foreshore
              </label>
            </div>
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                3D Model
              </label>
            </div>
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Core
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1">
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Soil
              </label>
            </div>
            <div class="px-4">
              <Checkbox id="terms" />
              <label
                for="terms"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Water
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
    <div class="grid grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>GeoLab FIM</CardTitle>
          <CardDescription>Research on mud slides</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-[25%_75%] text-xs">
            <Label class="text-xs" for="name">Storage location</Label>
            <Label class="text-xs" for="name"
              >P:\geocentrifuge\11206575-019 - Geolab FIM</Label
            >
            <Label class="text-xs" for="name">Date</Label>
            <Label class="text-xs" for="name">2023-03-23</Label>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end px-6 pb-6">
          <Button @click="navigateTo('/view')" variant="outline">View</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>GeoLab FIM</CardTitle>
          <CardDescription>Research on mud slides</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-[25%_75%] text-xs">
            <Label class="text-xs" for="name">Storage location</Label>
            <Label class="text-xs" for="name"
              >P:\geocentrifuge\11206575-019 - Geolab FIM</Label
            >
            <Label class="text-xs" for="name">Date</Label>
            <Label class="text-xs" for="name">2023-03-23</Label>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end px-6 pb-6">
          <Button @click="navigateTo('/view')" variant="outline">View</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
