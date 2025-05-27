<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ref, reactive } from "vue"
import dateFormat from "dateformat"
import type { DateRange } from "radix-vue"
import Input from "~/components/ui/input/Input.vue"
import MapBrowser from "~/components/MapBrowser.vue"
import type { Extent } from "ol/extent"
import { bboxPolygon } from "@turf/turf"
import type { LocationQueryRaw } from "vue-router"
import FilterSystem from "~/components/FilterSystem.vue"
import { parseDate } from "@internationalized/date"

const route = useRoute()
const router = useRouter()

let selectedItemId = ref<string>()

let bbox = ref<Extent>([180, 90, -180, -90])
let bboxFilter = ref<Extent>([180, 90, -180, -90])

// Reactive filter state
const filterState = reactive({
  q: (route.query?.q as string) || "",
  date: undefined as DateRange | undefined,
  keywords: [] as string[],
  collections: [] as string[],
  includeEmptyGeometry: route.query?.includeEmptyGeometry === "on",
})

// Initialize filter state from route query
if (route.query?.start && route.query?.end) {
  filterState.date = {
    start: parseDate(route.query.start as string),
    end: parseDate(route.query.end as string),
  }
}

if (route.query?.keywords) {
  const keywords = route.query.keywords
  filterState.keywords = (Array.isArray(keywords) ? keywords : [keywords])
    .map((id) => id?.toString())
    .filter(Boolean) as string[]
}

if (route.query?.collections) {
  const collections = route.query.collections
  filterState.collections = (
    Array.isArray(collections) ? collections : [collections]
  )
    .map((id) => id?.toString())
    .filter(Boolean) as string[]
}

let datetime = computed(() => {
  if (!filterState.date?.start || !filterState.date?.end) return undefined

  return `${dateFormat(new Date(filterState.date.start as unknown as string), "isoUtcDateTime")}/${dateFormat(new Date(filterState.date.end as unknown as string), "isoUtcDateTime")}`
})

function onChangeBbox(newBox: Extent) {
  bbox.value = newBox
}

function searchBboxArea() {
  bboxFilter.value = bbox.value
}

watch(filterState, onSubmit)

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
          filterState.includeEmptyGeometry
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
              `%${filterState.q}%`,
            ],
          },
          {
            op: "like",
            args: [
              {
                property: "properties.description",
              },
              `%${filterState.q}%`,
            ],
          },
        ],
      },
      filterState.keywords.length > 0
        ? {
            op: "in",
            args: [
              {
                property: "properties.keywords.id",
              },
              filterState.keywords,
            ],
          }
        : undefined,
    ].filter(Boolean),
  }
})

let { data: searchResults, status } = await useApi("/search", {
  method: "post",
  body: {
    collections:
      filterState.collections.length > 0 ? filterState.collections : undefined,
    datetime,
    filter,
    "filter-lang": "cql2-json",
  } as any,
})

function onSubmit() {
  const query: LocationQueryRaw = { q: filterState.q }

  if (filterState.date?.start) {
    query.start = filterState.date.start as unknown as string
  }

  if (filterState.date?.end) {
    query.end = filterState.date.end as unknown as string
  }

  if (filterState.keywords.length > 0) {
    query.keywords = filterState.keywords
  }

  if (filterState.collections.length > 0) {
    query.collections = filterState.collections
  }

  if (filterState.includeEmptyGeometry) {
    query.includeEmptyGeometry = "on"
  }

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
        <div class="flex flex-col gap-4">
          <!-- Filter System -->
          <FilterSystem
            :model-value="filterState as any"
            @update:model-value="(val: any) => Object.assign(filterState, val)"
          />

          <div class="flex gap-2">
            <Input
              v-model="filterState.q"
              placeholder="Search title or description..."
              class="flex-1"
            />
            <Button @click="onSubmit">Search</Button>
          </div>
        </div>

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
              <CardDescription class="line-clamp-3 text-ellipsis">{{
                item.properties.description
              }}</CardDescription>
            </CardHeader>
            <CardContent v-if="item.properties.datetime">
              <NuxtLink :to="'/items/' + item.id + '/view'"
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
          :feature-collection="searchResults as any"
          @change-bbox="onChangeBbox"
          @hover-item="selectedItemId = $event"
        />
      </ClientOnly>
    </div>
  </div>
</template>
