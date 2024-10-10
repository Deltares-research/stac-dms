<script setup lang="ts">
import { ref } from "vue"
import { cn } from "@/lib/utils"
import { nanoid } from "nanoid"
import "../node_modules/mapbox-gl/dist/mapbox-gl.css"
import { DateFormatter, parseDate } from "@internationalized/date"
import dateFormat from "dateformat"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-icons/vue"
import CustomDropDownComponent from "@/components/CustomDropDownComponent.vue"
import Container from "~/components/deltares/Container.vue"
import Textarea from "~/components/ui/textarea/Textarea.vue"
import { Calendar as CalendarIcon, XIcon } from "lucide-vue-next"
import { CaretSortIcon } from "@radix-icons/vue"

import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { zu } from "@infra-blocks/zod-utils"
import { FormField, FormItem } from "~/components/ui/form"
import { useForm } from "vee-validate"
import { useToast } from "~/components/ui/toast"
import { computedAsync } from "@vueuse/core"
import type { FeatureCollection } from "geojson"
import { bbox } from "@turf/turf"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const readOnly = route.query.readonly ? "readonly" : ""
const readOnlyTag = readOnly ? "readOnly" : undefined

let keywords = ref([])

let assets = ref({
  [nanoid()]: {},
})

function addAsset() {
  assets.value[nanoid()] = {}
}

function removeAsset(id: string | number) {
  delete assets.value[id]
}

function handleChange(e) {
  if (readOnly) return
  const index = keywords.value.findIndex((item) => item.id == e.id)
  if (index == -1) {
    keywords.value.push(e)
  } else {
    keywords.value.splice(index, 1)
  }
}

let updatedGeometry = ref<FeatureCollection>()
let geometry = ref<FeatureCollection>({
  type: "FeatureCollection",
  features: [],
})

function setValue(updateGeometry) {
  updatedGeometry.value = updateGeometry
}

function isSelected(e) {
  return keywords.value.find((item) => item.id == e.id) !== undefined
}

const df = new DateFormatter("en-US", {
  dateStyle: "long",
})

let { data: collectionsResponse, error } = await useApi("/collections", {
  server: true,
})
const update = id !== "create"

let feature = null
if (update) {
  let { data: item } = await useApi("/search", {
    query: { ids: id },
  })
  feature = item.value.features[0]
  keywords.value = feature.properties.keywords
  if (feature.geometry) {
    geometry.value.features.push(feature.geometry)
    updatedGeometry.value = geometry.value
  }
  assets.value = feature.assets
}
const createOrUpdateTitle = update
  ? "Update an existing registration"
  : "Register a new item"
const title = readOnly ? "View registration" : createOrUpdateTitle

let collections = collectionsResponse.value?.collections ?? []
const selectedCollection = update
  ? collections.find((item) => item.id == feature.collection)
  : null

const collectionOptions = collections.map((collection) => ({
  value: collection.id,
  label: collection.description,
}))

let { $api } = useNuxtApp()

let formSchema = toTypedSchema(
  z.object({
    collectionId: z.string().default(feature?.collection),
    requestBody: z.object({
      bbox: z
        .union([
          z.tuple([z.number(), z.number(), z.number(), z.number()]),
          z.tuple([
            z.number(),
            z.number(),
            z.number(),
            z.number(),
            z.number(),
            z.number(),
          ]),
        ])
        .nullable()
        .optional(),
      type: z.literal("Feature").default("Feature"),
      // TODO: Fix any type to the complicated geometry type. Perhaps using turf.js or something
      geometry: z
        .union([
          zu.geojson.point(),
          zu.geojson.multiPoint(),
          zu.geojson.lineString(),
          zu.geojson.multiLineString(),
          zu.geojson.polygon(),
          zu.geojson.multiPolygon(),
          zu.geojson.geometryCollection(),
        ])
        .nullable()
        .default(null),
      properties: z
        .object({
          title: z.string().default(feature?.properties.title),
          projectNumber: z.string().default(feature?.properties.projectNumber),
          description: z.string().default(feature?.properties.description),
          datetime: z
            .string()
            .default(feature?.properties.datetime)
            .transform((v) => {
              return new Date(v).toISOString()
            }),
          storagelocation: z
            .string()
            .default(feature?.properties.storagelocation),
          created: z.string().nullable().optional(),
          updated: z.string().nullable().optional(),
          start_datetime: z.string().nullable().optional(),
          end_datetime: z.string().nullable().optional(),
          license: z.string().nullable().optional(),
          providers: z
            .array(
              z.object({
                name: z.string(),
                description: z.string().nullable().optional(),
                role: z.array(z.string()).nullable().optional(),
                url: z.string().nullable().optional(),
              }),
            )
            .nullable()
            .optional(),
          constellation: z.string().nullable().optional(),
          mission: z.string().nullable().optional(),
          gsd: z.number().nullable().optional(),
        })
        .passthrough(),
      id: z.string().default(nanoid()),
      stac_version: z.string().default("1.0.0"),
      stac_extensions: z.array(z.string()).nullable().optional().default([]),
      assets: z
        .record(
          z.object({
            href: z.string(),
            type: z.string().nullable().optional(),
            title: z.string().nullable().optional(),
            description: z.string().nullable().optional(),
            roles: z.array(z.string()).nullable().optional(),
          }),
        )
        .default(assets.value),
      links: z
        .record(
          z.object({
            href: z.string(),
            rel: z.string(),
            type: z
              .union([
                z.literal("image/tiff; application=geotiff"),
                z.literal(
                  "image/tiff; application=geotiff; profile=cloud-optimized",
                ),
                z.literal("image/jp2"),
                z.literal("image/png"),
                z.literal("image/jpeg"),
                z.literal("application/geo+json"),
                z.literal("application/geopackage+sqlite3"),
                z.literal("application/vnd.google-earth.kml+xml"),
                z.literal("application/vnd.google-earth.kmz"),
                z.literal("application/x-hdf"),
                z.literal("application/x-hdf5"),
                z.literal("application/xml"),
                z.literal("application/json"),
                z.literal("text/html"),
                z.literal("text/plain"),
                z.literal("application/vnd.oai.openapi+json;version=3.0"),
                z.literal("application/schema+json"),
              ])
              .nullable()
              .optional(),
            title: z.string().nullable().optional(),
            "label:assets": z.string().nullable().optional(),
          }),
        )
        .default({})
        .transform((val) => Object.values(val)),
    }),
    // TODO: extract type
  }) satisfies z.ZodType<any>,
)

let { toast } = useToast()

let form = useForm({
  validationSchema: formSchema,
})

const keywordsGroups = computedAsync(async () => {
  const collectionId = update ? feature.collection : form.values.collectionId
  const collection = await $api("/collections/{collection_id}", {
    path: {
      collection_id: collectionId,
    },
  })
  const keywordsLink = collection.links.find(
    (item) => (item.rel = "keywords" && item.id),
  )
  const facilityId = keywordsLink.id
  return await $api("/api/keywords", {
    query: {
      facility_id: facilityId,
    },
  })
}, [])

let onSubmit = form.handleSubmit(async (values) => {
  try {
    let url = "/collections/{collection_id}/items"
    if (update) url = url + "/" + feature.id

    const newItem = {
      ...values.requestBody,
      collection: update ? feature.collection : values.collectionId,
    }
    newItem.properties.keywords = keywords.value
    if (updatedGeometry.value?.features[0]) {
      newItem.geometry = updatedGeometry.value?.features[0].geometry
        ? updatedGeometry.value?.features[0].geometry
        : feature?.geometry

      newItem.bbox = newItem.geometry ? bbox(newItem.geometry) : undefined
    }
    let data = await $api(url, {
      method: update ? "put" : "post",
      body: newItem,
      headers: {
        "Content-Type": "application/json",
      },
      path: {
        collection_id: values.collectionId,
      },
    })

    toast({
      title: "Data registered successfully",
    })

    // TODO: data is typed unknown
    await navigateTo(`/items`)
  } catch (error) {
    console.log(error)
    toast({
      title: "Something went wrong!",
      variant: "destructive",
    })
  }
})

watch(form.errors, () => {})

let datetimeValue = computed({
  get: () => {
    return form.values.requestBody?.properties?.datetime
      ? parseDate(form.values.requestBody?.properties?.datetime)
      : undefined
  },
  set: (val) => val,
})

function getDisplayTime() {
  if (!datetimeValue.value && update) {
    return dateFormat(new Date(feature.properties.datetime), "yyyy-mm-dd")
  }
  return datetimeValue.value ? datetimeValue.value : "Pick a date"
}
</script>

<template>
  <Container class="py-8">
    <h1 class="text-3xl flex font-semibold">{{ title }}</h1>
    <form @submit="onSubmit">
      <FormField name="requestBody.type">
        <FormControl>
          <input type="hidden" name="requestBody.type" value="Feature" />
        </FormControl>
      </FormField>
      <div class="mt-8 grid grid-flow-row gap-5">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Data set collection</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField v-slot="{ componentField }" name="collectionId">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>Collection</FormLabel>
                <FormLabel v-if="update"
                  >{{ selectedCollection?.description }}
                </FormLabel>
                <FormControl v-if="!update">
                  <CustomDropDownComponent
                    :options="collectionOptions"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>

        <Card v-if="update || form.values.collectionId">
          <CardHeader>
            <CardTitle class="text-lg">General information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="max-w-196 flex flex-col gap-5">
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.projectNumber"
              >
                <FormItem>
                  <FormLabel>Project number</FormLabel>
                  <FormControl>
                    <Input
                      :readonly="readOnlyTag"
                      type="text"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.title"
              >
                <FormItem>
                  <FormLabel>Project title</FormLabel>
                  <FormControl>
                    <Input
                      :readonly="readOnlyTag"
                      type="text"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="requestBody.properties.datetime">
                <FormItem class="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <FormControl>
                        <Button
                          v-if="!readOnly"
                          variant="outline"
                          :class="
                            cn(
                              'w-[240px] ps-3 text-start font-normal',
                              !datetimeValue && 'text-muted-foreground',
                            )
                          "
                        >
                          <span>{{ getDisplayTime() }}</span>
                          <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                        <Label v-if="readOnly">{{ getDisplayTime() }}</Label>
                        <input hidden />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model="datetimeValue"
                        calendar-label="Date"
                        initial-focus
                        @update:model-value="
                          (v) => {
                            if (v) {
                              form.setFieldValue(
                                'requestBody.properties.datetime',
                                v.toString(),
                              )
                            } else {
                              form.setFieldValue(
                                'requestBody.properties.datetime',
                                undefined,
                              )
                            }
                          }
                        "
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.description"
              >
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      :readonly="readOnlyTag"
                      type="text"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.storagelocation"
              >
                <FormItem>
                  <FormLabel>Storage location</FormLabel>
                  <FormControl>
                    <Input
                      :readonly="readOnlyTag"
                      type="text"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
        <Card v-if="update || form.values.collectionId">
          <CardHeader>Geometry</CardHeader>
          <CardContent>
            <div class="container mx-auto">
              <ClientOnly>
                <GeometryDraw
                  :initialValue="geometry"
                  @valueChange="setValue"
                />
              </ClientOnly>
            </div>
          </CardContent>
        </Card>
        <div class="grid grid-cols-3 gap-1">
          <Card v-for="group in keywordsGroups">
            <CardHeader>
              <CardTitle class="text-lg">{{ group.group_name_en }}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                v-for="item in group.keywords"
                v-slot="{ value }"
                :key="item"
                type="checkbox"
                :value="item.nl_keyword"
                :ch
                :unchecked-value="false"
                name="items"
              >
                <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      @update:checked="handleChange(item)"
                      :checked="isSelected(item)"
                    />
                  </FormControl>
                  <FormLabel class="font-normal">
                    {{ item.nl_keyword }}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card v-if="update || form.values.collectionId">
            <CardHeader>
              <div class="flex items-center justify-between space-x-4 px-4">
                <CardTitle>Assets</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <div class="flex flex-col">
                <div
                  v-for="(_asset, id) in assets"
                  class="border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6"
                >
                  <FormField
                    v-slot="{ componentField }"
                    :name="`requestBody.assets.${id}.title`"
                  >
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField }"
                    :name="`requestBody.assets.${id}.description`"
                  >
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField }"
                    :name="`requestBody.assets.${id}.href`"
                  >
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField
                    v-slot="{ componentField }"
                    :name="`requestBody.assets.${id}.type`"
                  >
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input type="text" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <Button
                    type="button"
                    @click="removeAsset(id)"
                    variant="outline"
                  >
                    <XIcon class="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
              <div>
                <Button
                  @click="addAsset"
                  variant="outline"
                  class="mt-5"
                  type="button"
                >
                  <PlusIcon class="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="flex justify-between px-6 pb-6 mt-4">
        <Button v-if="!readOnly" as-child variant="outline">
          <NuxtLink to="/items">Cancel</NuxtLink>
        </Button>
        <Button
          v-if="readOnly"
          variant="outline"
          @click.stop.prevent="$router.back()"
          >Back to search
        </Button>
        <Button
          type="submit"
          v-if="!readOnly && (update || form.values.collectionId)"
          >Publish project data
        </Button>
      </div>
    </form>
  </Container>
</template>

<style></style>
