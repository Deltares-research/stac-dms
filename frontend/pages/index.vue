<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ref } from "vue"
import dateFormat from "dateformat"
import DateRangePicker from "~/components/DateRangePicker.vue"
import type { DateRange } from "radix-vue"
import Input from "~/components/ui/input/Input.vue"
import MapBrowser from "~/components/MapBrowser.vue"
import type { Extent } from "ol/extent"
import KeywordsCombobox from "~/components/keywords/KeywordsCombobox.vue"
import CollectionCombobox from "~/components/collections/CollectionCombobox.vue"
import Label from "~/components/ui/label/Label.vue"
import { bboxPolygon } from "@turf/turf"

let route = useRoute()

let daterange = ref<DateRange>()
let bbox = ref<Extent>()

let datetime = computed(() => {
  let { start, end } = route.query
  if (start && end) {
    return `${dateFormat(new Date(start as string), "isoUtcDateTime")}/${dateFormat(new Date(end as string), "isoUtcDateTime")}`
  }
})

function onChangeBbox(newBox: Extent) {
  bbox.value = newBox
}

let bboxAsPolygon = computed(() => {
  if (!bbox.value)
    return {
      type: "Polygon",
      coordinates: [
        [
          [-214.1047111774557, -80.10370486246764],
          [145.8952888225443, -80.10370486246764],
          [145.8952888225443, 85.05112877980659],
          [-214.1047111774557, 85.05112877980659],
          [-214.1047111774557, -80.10370486246764],
        ],
      ],
    }

  return bboxPolygon(bbox.value).geometry
})

let filter = computed(() => {
  return {
    op: "and",
    args: [
      // within bbox
      // {
      //   op: "or",
      //   args: [
      // {
      //   op: "s_intersects",
      //   args: [
      //     {
      //       property: "geometry",
      //     },
      //     bboxAsPolygon.value,
      //   ],
      // },
      {
        op: "isNull",
        args: [
          {
            property: "geometry",
          },
        ],
      },
      //   ],
      // },
      // {
      //   op: "or",
      //   args: [
      //     {
      //       op: "like",
      //       args: [
      //         {
      //           property: "properties.title",
      //         },
      //         `%${route.query.q ?? ""}%`,
      //       ],
      //     },
      //     {
      //       op: "like",
      //       args: [
      //         {
      //           property: "properties.description",
      //         },
      //         `%${route.query.q ?? ""}%`,
      //       ],
      //     },
      //   ],
      // },
      // route.query.keywords
      //   ? {
      //       op: "in",
      //       args: [
      //         {
      //           property: "properties.keywords.id",
      //         },
      //         keywordIds,
      //       ],
      //     }
      //   : undefined,
    ],
  }
})

let keywordIds = (
  Array.isArray(route.query.keywords)
    ? route.query.keywords
    : [route.query.keywords]
)
  .map((id) => id?.toString())
  .filter(Boolean) as string[]

let collectionIds = (
  Array.isArray(route.query.collections)
    ? route.query.collections
    : [route.query.collections]
)
  .map((id) => id?.toString())
  .filter(Boolean) as string[]

let {
  data: searchResults,
  refresh,
  error,
} = useApi("/search", {
  method: "post",
  body: {
    // collections: collectionIds,
    // datetime: datetime,
    // bbox: bbox,
    filter,
    "filter-lang": "cql-json",
  },
})

console.log(error)
</script>

<template>
  <div class="grid grid-cols-2 justify-center h-full">
    <div class="p-5">
      <form class="flex flex-col gap-1.5" method="get">
        <Input
          name="q"
          placeholder="Search title or description..."
          :model-value="route.query.q as string"
        />

        <input name="start" type="hidden" :value="daterange?.start" />
        <input name="end" type="hidden" :value="daterange?.end" />
        <DateRangePicker v-model="daterange" />

        <KeywordsCombobox
          name="keywords"
          placeholder="Keywords"
          :model-value="keywordIds"
        />

        <CollectionCombobox
          name="collections"
          placeholder="Collections"
          :model-value="collectionIds"
        />

        <Label class="py-1.5 flex items-center gap-1.5">
          <Checkbox name="includeItemsWithoutLocation" />
          Include items without location
        </Label>

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
            <NuxtLink :to="'/items/' + item.id + '?readonly=true'"
              >View details</NuxtLink
            >
            <div class="text-xs text-muted-foreground">
              {{
                dateFormat(new Date(item.properties.datetime), "mmmm dS, yyyy")
              }}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="relative h-full">
      <ClientOnly>
        <MapBrowser
          :feature-collection="searchResults"
          @change-bbox="onChangeBbox"
        />
      </ClientOnly>
    </div>
  </div>
</template>
