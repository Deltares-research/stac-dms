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
import { bboxPolygon } from "@turf/turf"
import type { LocationQueryRaw } from "vue-router"

const route = useRoute()
const router = useRouter()

let selectedItemId = ref<string>()

let daterange = ref<DateRange>()
let bbox = ref<Extent>([180, 90, -180, -90])
let bboxFilter = ref<Extent>([180, 90, -180, -90])

let datetime = computed(() => {
  if (!route || !route.query) return undefined

  let { start, end } = route.query
  if (start && end) {
    return `${dateFormat(new Date(start as string), "isoUtcDateTime")}/${dateFormat(new Date(end as string), "isoUtcDateTime")}`
  }
})

function onChangeBbox(newBox: Extent) {
  bbox.value = newBox
}

function searchBboxArea() {
  bboxFilter.value = bbox.value
}

let keywordIds = computed(() => {
  if (!route || !route.query || !route.query.keywords) return []

  const keywords = route.query.keywords
  return (Array.isArray(keywords) ? keywords : [keywords])
    .map((id) => id?.toString())
    .filter(Boolean) as string[]
})

let collectionIds = computed(() => {
  if (!route || !route.query || !route.query.collections) return []

  const collections = route.query.collections
  return (Array.isArray(collections) ? collections : [collections])
    .map((id) => id?.toString())
    .filter(Boolean) as string[]
})

let filter = computed(() => {
  let geometry = bboxFilter.value
    ? bboxPolygon(bboxFilter.value as [number, number, number, number]).geometry
    : undefined

  return {
    op: "and",
    args: [
      {
        op: "or",
        args: [
          geometry
            ? {
                op: "s_intersects",
                args: [
                  {
                    property: "geometry",
                  },
                  geometry,
                ],
              }
            : undefined,
          // The isNull operator does not work. The below is a workaround. It includes items that have no geometry by intersecting with a Polygon that covers the entire world.
          route.query?.includeEmptyGeometry === "on"
            ? {
                op: "not",
                args: [
                  {
                    op: "s_intersects",
                    args: [
                      {
                        property: "geometry",
                      },
                      {
                        type: "Polygon",
                        coordinates: [
                          [
                            [-180, -90],
                            [180, -90],
                            [180, 90],
                            [-180, 90],
                            [-180, -90],
                          ],
                        ],
                      },
                    ],
                  },
                ],
              }
            : undefined,
        ].filter(Boolean),
      },
      {
        op: "or",
        args: [
          {
            op: "like",
            args: [
              {
                property: "properties.title",
              },
              `%${route.query?.q ?? ""}%`,
            ],
          },
          {
            op: "like",
            args: [
              {
                property: "properties.description",
              },
              `%${route.query?.q ?? ""}%`,
            ],
          },
        ],
      },
      keywordIds.value.length > 0
        ? {
            op: "in",
            args: [
              {
                property: "properties.keywords.id",
              },
              keywordIds.value,
            ],
          }
        : undefined,
    ].filter(Boolean),
  }
})

let { data: searchResults, status } = await useApi("/search", {
  method: "post",
  body: {
    collections: collectionIds,
    datetime,
    filter,
    "filter-lang": "cql2-json",
  } as any,
})

function onSubmit(event: Event) {
  let formData = new FormData(event.target as HTMLFormElement)
  let query = Object.fromEntries(formData.entries()) as LocationQueryRaw
  router.push({ query })
}
</script>

<template>
  <div class="grid grid-cols-2 justify-center h-[calc(100vh-57px)]">
    <div class="relative h-full overflow-hidden">
      <div
        v-if="status === 'pending'"
        class="z-10 absolute inset-0 flex items-center justify-center bg-white/80"
      >
        <Loader2 class="w-4 h-4 animate-spin" />
      </div>
      <div class="p-5 h-full overflow-y-auto">
        <form
          class="flex flex-col gap-1.5"
          method="get"
          @submit.prevent="onSubmit"
        >
          <Input
            name="q"
            placeholder="Search title or description..."
            :model-value="(route.query?.q as string) || ''"
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

          <div class="flex items-center space-x-2 py-2">
            <Checkbox
              id="includeEmptyGeometry"
              name="includeEmptyGeometry"
              :default-checked="route.query?.includeEmptyGeometry === 'on'"
            />
            <label
              for="includeEmptyGeometry"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include empty geometries
            </label>
          </div>

          <Button>Search</Button>
        </form>

        <div class="mt-5 flex flex-col gap-5">
          <Card
            v-for="item of searchResults?.features"
            :key="item.id"
            :class="selectedItemId === item.id ? 'border-emerald-500' : ''"
          >
            <CardHeader>
              <CardTitle class="text-xl">
                {{ item.properties.title ?? item.id }}
              </CardTitle>
              <CardDescription>{{
                item.properties.description
              }}</CardDescription>
            </CardHeader>
            <CardContent v-if="item.properties.datetime">
              <NuxtLink :to="'/items/' + item.id + '?readonly=true'"
                >View details</NuxtLink
              >
              <div class="text-xs text-muted-foreground">
                {{
                  dateFormat(
                    new Date(item.properties.datetime),
                    "mmmm dS, yyyy",
                  )
                }}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <div class="relative h-full flex justify-center">
      <Button
        size="sm"
        @click="searchBboxArea"
        v-if="bboxFilter !== bbox"
        class="absolute top-4 z-10 animate-in fade-in-0 duration-200"
      >
        Search this area
      </Button>
      <ClientOnly>
        <MapBrowser
          :feature-collection="searchResults"
          @change-bbox="onChangeBbox"
          @hover-item="selectedItemId = $event"
        />
      </ClientOnly>
    </div>
  </div>
</template>
