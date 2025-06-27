<script setup lang="ts">
import { ref, watchEffect } from "vue"
import { cn } from "@/lib/utils"
import { nanoid } from "nanoid"
import "../node_modules/mapbox-gl/dist/mapbox-gl.css"
import { parseDate } from "@internationalized/date"
import dateFormat from "dateformat"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-icons/vue"
import CustomDropDownComponent from "@/components/CustomDropDownComponent.vue"
import Container from "~/components/deltares/Container.vue"
import Textarea from "~/components/ui/textarea/Textarea.vue"
import DateRangePicker from "@/components/DateRangePicker.vue"
import { CalendarIcon, XIcon, DatabaseIcon, Loader2Icon } from "lucide-vue-next"

import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { zu } from "@infra-blocks/zod-utils"
import { FormField, FormItem, FormDescription } from "~/components/ui/form"
import { useForm } from "vee-validate"
import { useToast } from "~/components/ui/toast"
import { computedAsync } from "@vueuse/core"
import type { FeatureCollection, Geometry } from "geojson"
import type { DateRange } from "radix-vue"
import { bbox } from "@turf/turf"
import { nullToUndefined } from "~/lib/null-to-undefined"
import type { Keyword } from "~/lib/types"
import { spatialReferenceSystem } from "~/lib/spatialReferenceSystem"
const route = useRoute()
const id = route.params.id === "create" ? undefined : String(route.params.id)

let spatialReferenceSystemOptions = spatialReferenceSystem.map((item) => {
  return { label: item, value: item }
})

spatialReferenceSystemOptions.unshift({
  label: "not applicable",
  value: "not applicable",
})

function handleChange(kw: Keyword) {
  const index = keywords.value.findIndex((item) => item.id == kw.id)
  if (index == -1) {
    keywords.value.push(kw)
  } else {
    keywords.value.splice(index, 1)
  }
}

function isSelected(kw: Keyword) {
  return keywords.value.find((item) => item.id == kw.id) !== undefined
}

let { data: collectionsResponse } = await useApi("/collections", {
  server: true,
})

let { data: collectionPermissions } = await useApi("/collection-permissions", {
  server: true,
})

let searchResult = id
  ? await useApi("/search", {
      query: { ids: id },
    })
  : undefined

let initialValues = computed(() => {
  if (!id) return

  let feature = searchResult?.data.value?.features[0]

  if (!feature) return

  return feature
})

console.log(initialValues.value)

let keywords = ref<Keyword[]>(
  (initialValues.value?.properties?.keywords as Keyword[]) ?? [],
)

let geometry = ref<FeatureCollection>({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: toRaw(initialValues.value?.geometry) as unknown as Geometry,
      properties: null,
    },
  ],
})

function setValue(updateGeometry: FeatureCollection) {
  geometry.value = updateGeometry
}

let assets = ref(
  initialValues.value?.assets ?? {
    [nanoid()]: {},
  },
)

function addAsset() {
  assets.value[nanoid()] = {}
}

function removeAsset(id: string | number) {
  delete assets.value[id]
}

const title = initialValues.value
  ? "Update an existing registration"
  : "Register a new item"

let collections =
  collectionsResponse.value?.collections.filter((item) => {
    return collectionPermissions.value?.some(
      (permission) =>
        permission.collection_id === item.id &&
        permission.permissions.includes("item:create"),
    )
  }) ?? []

const selectedCollection = initialValues.value
  ? collections.find((item) => item.id == initialValues.value?.collection)
  : null

const collectionOptions = collections.map((collection) => ({
  value: collection.id,
  label: collection.title ?? "",
}))

const languages = [
  { value: "eng", label: "English" },
  { value: "dut", label: "Dutch" },
  { value: "ger", label: "German" },
  { value: "fre", label: "French" },
]

const legalRestrictionsOptions = [
  { value: "copyright", label: "copyright" },
  { value: "patent", label: "patent" },
  { value: "patentPending", label: "patent pending" },
  { value: "trademark ", label: "trademark" },
  { value: "license", label: "license" },
  {
    value: "intellectualPropertyRights ",
    label: "intellectual property rights",
  },
  { value: "restricted ", label: "Prohibition of distribution and use" },
]

let { $api } = useNuxtApp()

let schema = z.object({
  collectionId: z.string(),
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
        title: z.string(),
        projectNumber: z.string(),
        description: z.string(),
        publication_datetime: z.string(),
        spatialReferenceSystem: z.string(),
        dataQualityInfoStatement: z.string(),
        dataQualityInfoScore: z.string().default("dataSet"),
        dateType: z.string().optional().default("publication"),
        legalRestrictions: z.string(),
        restrictionsOfUse: z.string(),
        metadataStandardName: z.string().default("ISO 19115"),
        metadataStandardVersion: z.string().default("2.1.0"),
        progressCode: z.string().default("completed"),
        language: z.string(),
        hierarchyLevel: z.string().default("dataSet"),
        originatorDataEmail: z.string(),
        originatorDataRoleCode: z.string().default("originator"),
        originatorDataOrganisation: z.string().default("Deltares"),
        originatorMetaDataOrganisation: z.string().default("Deltares"),
        originatorMetaDataEmail: z.string(),
        originatorMetaDataRoleCode: z.string().default("originator"),
        metaDataLanguage: z.string().default("eng"),
        created: z.string().nullable().optional(),
        updated: z.string().nullable().optional(),
        datetime: z.string().nullable().optional(),
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
    assets: z.record(
      z.object({
        href: z.string(),
        type: z.string().nullable().optional(),
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
        roles: z.array(z.string()).nullable().optional(),
      }),
    ),
    // links: z
    //   .record(
    //     z.object({
    //       href: z.string(),
    //       rel: z.string(),
    //       type: z
    //         .union([
    //           z.literal("image/tiff; application=geotiff"),
    //           z.literal(
    //             "image/tiff; application=geotiff; profile=cloud-optimized",
    //           ),
    //           z.literal("image/jp2"),
    //           z.literal("image/png"),
    //           z.literal("image/jpeg"),
    //           z.literal("application/geo+json"),
    //           z.literal("application/geopackage+sqlite3"),
    //           z.literal("application/vnd.google-earth.kml+xml"),
    //           z.literal("application/vnd.google-earth.kmz"),
    //           z.literal("application/x-hdf"),
    //           z.literal("application/x-hdf5"),
    //           z.literal("application/xml"),
    //           z.literal("application/json"),
    //           z.literal("text/html"),
    //           z.literal("text/plain"),
    //           z.literal("application/vnd.oai.openapi+json;version=3.0"),
    //           z.literal("application/schema+json"),
    //         ])
    //         .nullable()
    //         .optional(),
    //       title: z.string().nullable().optional(),
    //       "label:assets": z.string().nullable().optional(),
    //     }),
    //   )
    //   .default({})
    //   .transform((val) => Object.values(val)),
  }),
  // TODO: extract type
})

type Schema = z.infer<typeof schema>

let formSchema = toTypedSchema(schema)

let { toast } = useToast()

let form = useForm({
  validationSchema: formSchema,
  initialValues: {
    collectionId: initialValues.value?.collection ?? undefined,
    requestBody: {
      properties: {
        ...nullToUndefined(toRaw(initialValues.value?.properties)),
        datetime: initialValues.value?.properties.publication_datetime
          ? dateFormat(
              initialValues.value?.properties.publication_datetime as string,
              "yyyy-mm-dd",
            )
          : undefined,
        legalRestrictions:
          (initialValues.value?.properties.legalRestrictions as string) ??
          "license",
        language: (initialValues.value?.properties.language as string) ?? "eng",
      },
      assets: assets.value,
    },
  },
})

const keywordsGroups = computedAsync(async () => {
  const collectionId = initialValues.value?.collection

  if (!collectionId) return []

  const collection = await $api("/collections/{collection_id}", {
    path: {
      collection_id: collectionId,
    },
  })
  const keywordsLink = collection.links.find(
    (item) => item.rel === "keywords" && item.id,
  )

  // TODO: Fix type assertion
  const facilityId = keywordsLink?.id as string

  if (!facilityId) return []

  return await $api("/keywords", {
    query: {
      facility_id: facilityId,
    },
  })
}, [])

let onSubmit = form.handleSubmit(async (values) => {
  try {
    if (id && id !== "create") {
      // Update

      const newItem = {
        ...values.requestBody,
        collection: values.collectionId,
        links: [],
      }

      // Handle datetime fields from DateRangePicker
      if (dateRangeValue.value.start && dateRangeValue.value.end) {
        // Both dates selected - save as start_datetime and end_datetime
        newItem.properties.datetime = null
        newItem.properties.start_datetime = new Date(
          dateRangeValue.value.start.toString(),
        ).toISOString()
        newItem.properties.end_datetime = new Date(
          dateRangeValue.value.end.toString(),
        ).toISOString()
        // Don't set datetime when using date range
      } else if (dateRangeValue.value.start && !dateRangeValue.value.end) {
        // Only start date - save as datetime
        newItem.properties.datetime = new Date(
          dateRangeValue.value.start.toString(),
        ).toISOString()
        newItem.properties.start_datetime = undefined
        newItem.properties.end_datetime = undefined
      } else {
        return toast({
          title: "Please select a date or date range.",
          variant: "destructive",
        })
      }

      newItem.properties.keywords = keywords.value

      let newGeometry = geometry.value?.features[0]
      if (newGeometry) {
        newItem.geometry =
          newGeometry.geometry as unknown as Schema["requestBody"]["geometry"]
        newItem.bbox = newItem.geometry ? bbox(newItem.geometry) : undefined
      }

      let result = await useApi(
        "/collections/{collection_id}/items/{item_id}",
        {
          method: "put",
          body: newItem,
          headers: {
            "Content-Type": "application/json",
          },
          path: {
            collection_id: values.collectionId,
            item_id: id,
          },
        },
      )

      if (!result.error.value) {
        toast({
          title: "Data updated successfully",
        })
      } else {
        throw result.error.value
      }

      await navigateTo(`/items`)
    } else {
      // Create

      const newItem = {
        ...values.requestBody,
        collection: values.collectionId,
        links: [],
      }

      // Handle datetime fields from DateRangePicker
      if (dateRangeValue.value.start && dateRangeValue.value.end) {
        // Both dates selected - save as start_datetime and end_datetime
        newItem.properties.start_datetime = new Date(
          dateRangeValue.value.start.toString(),
        ).toISOString()
        newItem.properties.end_datetime = new Date(
          dateRangeValue.value.end.toString(),
        ).toISOString()
      } else if (dateRangeValue.value.start && !dateRangeValue.value.end) {
        // Only start date - save as datetime
        newItem.properties.datetime = new Date(
          dateRangeValue.value.start.toString(),
        ).toISOString()
      }

      newItem.properties.keywords = keywords.value

      let newGeometry = geometry.value?.features[0]
      if (newGeometry) {
        newItem.geometry =
          newGeometry.geometry as unknown as Schema["requestBody"]["geometry"]
        newItem.bbox = newItem.geometry ? bbox(newItem.geometry) : undefined
      }

      let result = await useApi("/collections/{collection_id}/items", {
        method: "post",
        body: newItem,
        headers: {
          "Content-Type": "application/json",
        },
        path: {
          collection_id: values.collectionId,
        },
      })

      if (!result.error.value) {
        toast({
          title: "Data registered successfully",
        })
      } else {
        throw result.error.value
      }

      await navigateTo(`/items`)
    }
  } catch (error) {
    console.error(error)
    toast({
      title: "Something went wrong!",
      variant: "destructive",
    })
  }
})

let publicationDatetimeValue = computed({
  get: () => {
    return form.values.requestBody?.properties?.publication_datetime
      ? parseDate(form.values.requestBody?.properties?.publication_datetime)
      : undefined
  },
  set: (val) => val,
})

function getDisplayTime() {
  let value = form.values.requestBody?.properties?.publication_datetime

  return value ?? "Pick a date"
}

const initProps = initialValues.value?.properties

// Date range picker logic - parse existing datetime fields on load
const dateRangeValue = ref<DateRange>({
  start: initProps?.start_datetime
    ? parseDate(initProps.start_datetime.split("T")[0])
    : initProps?.datetime
      ? parseDate(initProps.datetime.split("T")[0])
      : undefined,
  end: initProps?.end_datetime
    ? parseDate(initProps.end_datetime.split("T")[0])
    : undefined,
})

function handleDateRangeChange(dateRange: DateRange) {
  dateRangeValue.value = dateRange
}

const isSubmitting = computed(() => form.isSubmitting.value)
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
        <!-- Empty state when no collections are available -->
        <Card v-if="collectionOptions.length === 0">
          <CardContent
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <div class="rounded-full bg-muted p-4 mb-4">
              <DatabaseIcon class="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 class="text-lg font-semibold mb-2">No collections available</h3>
            <p class="text-muted-foreground max-w-md mb-4">
              There are no collections you have permission to add items to.
              Please contact your administrator to get access.
            </p>

            <Button as-child variant="outline" class="mt-6">
              <NuxtLink to="/items">Return to items</NuxtLink>
            </Button>
          </CardContent>
        </Card>

        <Card v-if="collectionOptions.length > 0">
          <CardHeader>
            <CardTitle class="text-lg">Data set domain</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField v-slot="{ componentField }" name="collectionId">
              <FormItem class="flex flex-col gap-1">
                <FormLabel>Domain</FormLabel>
                <FormControl>
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

        <Card v-if="form.values.collectionId">
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
                    <Input type="text" v-bind="componentField" />
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
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="requestBody.properties.publication_datetime">
                <FormItem class="flex flex-col">
                  <FormLabel>
                    <NuxtLink
                      target="_blank"
                      external
                      to="https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                      >Publication date</NuxtLink
                    ></FormLabel
                  >
                  <Popover>
                    <PopoverTrigger as-child>
                      <FormControl>
                        <Button
                          variant="outline"
                          :class="
                            cn(
                              'w-[240px] ps-3 text-start font-normal',
                              !publicationDatetimeValue &&
                                'text-muted-foreground',
                            )
                          "
                        >
                          <span>{{ getDisplayTime() }}</span>
                          <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                        <input hidden />
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar
                        v-model="publicationDatetimeValue"
                        calendar-label="Date"
                        initial-focus
                        @update:model-value="
                          (v) => {
                            if (v) {
                              form.setFieldValue(
                                'requestBody.properties.publication_datetime',
                                v.toString(),
                              )
                            } else {
                              form.setFieldValue(
                                'requestBody.properties.publication_datetime',
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
                    <Textarea type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.language"
              >
                <FormItem class="flex flex-col gap-1">
                  <FormLabel>Language</FormLabel>
                  <CustomDropDownComponent
                    :options="languages"
                    v-bind="componentField"
                  />
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.legalRestrictions"
              >
                <FormItem class="flex flex-col gap-1">
                  <div>
                    <FormLabel>
                      <NuxtLink
                        target="_blank"
                        external
                        to="https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                        >Legal restrictions</NuxtLink
                      >
                    </FormLabel>
                  </div>
                  <CustomDropDownComponent
                    :options="legalRestrictionsOptions"
                    v-bind="componentField"
                  />
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.restrictionsOfUse"
              >
                <FormItem class="flex flex-col">
                  <div class="flex items-start">
                    <FormLabel>
                      <NuxtLink
                        target="_blank"
                        external
                        to="https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                        >Applications for which this data set is not
                        suitable</NuxtLink
                      >
                    </FormLabel>
                  </div>
                  <Textarea type="text" v-bind="componentField" />
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.spatialReferenceSystem"
              >
                <FormItem class="flex flex-col gap-1">
                  <FormLabel
                    >Spatial reference system (choose one from the list or
                    define a custom one)</FormLabel
                  >
                  <div class="flex flex-row space-x-4">
                    <CustomDropDownComponent
                      :options="spatialReferenceSystemOptions"
                      v-bind="componentField"
                    />
                    <Input type="text" v-bind="componentField" />
                  </div>
                  <FormControl></FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
        <Card v-if="form.values.collectionId">
          <CardHeader>
            <CardTitle class="text-lg">Data quality</CardTitle>
            <CardContent>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.dataQualityInfoStatement"
              >
                <FormItem>
                  <FormLabel>
                    <NuxtLink
                      target="_blank"
                      external
                      to="https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                      >Description of the origin of this data set</NuxtLink
                    >
                  </FormLabel>
                  <FormControl>
                    <Textarea type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
          </CardHeader>
        </Card>
        <Card v-if="form.values.collectionId">
          <CardHeader>
            <CardTitle class="text-lg">Originator data set</CardTitle>
            <CardContent>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.originatorDataOrganisation"
              >
                <FormItem>
                  <FormLabel>Organisation</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.originatorDataEmail"
              >
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
          </CardHeader>
        </Card>
        <Card v-if="form.values.collectionId">
          <CardHeader>
            <CardTitle class="text-lg">Originator meta data</CardTitle>
            <CardContent>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.originatorMetaDataOrganisation"
              >
                <FormItem>
                  <FormLabel>Organisation</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ componentField }"
                name="requestBody.properties.originatorMetaDataEmail"
              >
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="text" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </CardContent>
          </CardHeader>
        </Card>
        <Card v-if="form.values.collectionId">
          <CardHeader>Geometry</CardHeader>
          <CardContent>
            <div class="container mx-auto">
              <ClientOnly fallback="Loading...">
                <LazyGeometryDraw
                  :initialValue="geometry"
                  @valueChange="setValue"
                />
              </ClientOnly>
            </div>
          </CardContent>
        </Card>

        <Card v-if="form.values.collectionId">
          <CardHeader>
            <CardTitle class="text-lg">Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              v-slot="{ componentField }"
              name="requestBody.properties.datetime"
            >
              <div class="max-w-96 flex flex-col gap-5">
                <div class="flex flex-col">
                  <label
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2"
                  >
                    Select date or date range
                  </label>
                  <DateRangePicker
                    :modelValue="dateRangeValue"
                    @update:modelValue="handleDateRangeChange"
                  />
                  <p class="text-sm text-muted-foreground mt-2">
                    Select a single date or a date range.
                  </p>
                </div>
              </div>
              <FormMessage />
            </FormField>
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
                :key="item.id"
                type="checkbox"
                :value="item.nl_keyword"
                :checked="isSelected(item)"
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
          <Card v-if="form.values.collectionId">
            <CardHeader>
              <div class="flex items-center justify-between space-x-4 px-4">
                <CardTitle>Storage location data set</CardTitle>
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
                      <FormLabel>Title of the dataset</FormLabel>
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
                      <FormLabel>Description of the dataset</FormLabel>
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
                      <FormLabel>Link to the dataset</FormLabel>
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
                      <FormLabel>Type of dataset (e.g. file type)</FormLabel>
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
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div class="flex justify-between mt-4">
        <Button as-child variant="outline">
          <NuxtLink to="/items">Cancel</NuxtLink>
        </Button>
        <Button type="submit" :disabled="isSubmitting">
          <Loader2Icon v-if="isSubmitting" class="animate-spin size-4 mr-1.5" />
          Publish project data
        </Button>
      </div>
    </form>
  </Container>
</template>
