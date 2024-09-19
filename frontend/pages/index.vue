<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapboxMap } from "@studiometa/vue-mapbox-gl"
import { ref } from "vue"
import dateFormat from "dateformat"
import { DateFormatter } from "@internationalized/date"
import DateRangePicker from "~/components/DateRangePicker.vue"
import type { DateRange } from "radix-vue"

const mapCenter = ref([0, 0])
const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw"

let route = useRoute()

const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

let daterange = ref<DateRange>()

let datetime = computed(() => {
  let { start, end } = route.query
  if (start && end) {
    return `${dateFormat(new Date(start as string), "isoUtcDateTime")}/${dateFormat(new Date(end as string), "isoUtcDateTime")}`
  }
})

let { data: searchResults } = useApi("/search", {
  query: {
    datetime: datetime.value,
  },
})
</script>

<template>
  <div class="grid grid-cols-2 justify-center">
    <div class="p-5">
      <form class="flex items-center gap-1.5" method="get">
        <input name="start" type="hidden" :value="daterange?.start" />
        <input name="end" type="hidden" :value="daterange?.end" />
        <DateRangePicker v-model="daterange" />
        <Button>Search</Button>
      </form>

      <div class="mt-5 flex flex-col gap-5">
        <h1 class="text-2xl font-semibold">
          {{ searchResults?.features.length }}
          {{ searchResults?.features.length === 1 ? "Result" : "Results" }}
        </h1>

        <Card v-for="item of searchResults?.features" :key="item.id">
          <CardHeader>
            <CardTitle class="text-xl">
              {{ item.properties.title ?? item.id }}
            </CardTitle>
            <CardDescription>{{ item.properties.description }}</CardDescription>
          </CardHeader>
          <CardContent v-if="item.properties.datetime">
            <div class="text-xs text-muted-foreground">
              {{
                dateFormat(new Date(item.properties.datetime), "mmmm dS, yyyy")
              }}
            </div>
          </CardContent>
        </Card>
      </div>
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
</template>
