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

let keywordIds = (
  Array.isArray(route.query.keywords)
    ? route.query.keywords
    : [route.query.keywords]
).filter(Boolean)

let { data: searchResults, refresh } = useApi("/search", {
  method: "post",
  body: {
    datetime: datetime,
    bbox: bbox,
    filter: {
      op: "and",
      args: [
        {
          op: "or",
          args: [
            {
              op: "like",
              args: [
                {
                  property: "properties.title",
                },
                `%${route.query.q ?? ""}%`,
              ],
            },
            {
              op: "like",
              args: [
                {
                  property: "properties.description",
                },
                `%${route.query.q ?? ""}%`,
              ],
            },
          ],
        },
        route.query.keywords
          ? {
              op: "in",
              args: [
                {
                  property: "properties.keywords.id",
                },
                keywordIds,
              ],
            }
          : undefined,
      ].filter(Boolean),
    },
    "filter-lang": "cql2-json",
  },
})
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
