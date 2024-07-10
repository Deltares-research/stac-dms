<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@radix-icons/vue";
import { MapboxMap } from "@studiometa/vue-mapbox-gl";
import { nanoid } from "nanoid";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  CalendarDate,
  today,
} from "@internationalized/date";
import { toDate } from "radix-vue/date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

import { Calendar as CalendarIcon, XIcon } from "lucide-vue-next";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const mapCenter = ref([0, 0]);
import Label from "@/components/ui/label/Label.vue";
import CustomDropDownComponent from "@/components/CustomDropDownComponent.vue";
import Container from "~/components/deltares/Container.vue";
import Textarea from "~/components/ui/textarea/Textarea.vue";

import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { zu } from "@infra-blocks/zod-utils";
import { AutoForm } from "~/components/ui/auto-form";
import { FormField, FormItem } from "~/components/ui/form";
import { useForm } from "vee-validate";
import { useToast } from "~/components/ui/toast";

const accesToken =
  "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw";
const selectedStatus = ref("");
const statusTypes = [
  { value: "completed", label: "completed" },
  { value: "historicalArchive", label: "historical archive" },
  { value: "obsolete", label: "obsolete" },
  { value: "onGoing", label: "on going" },
  { value: "planned", label: "planned" },
  { value: "required", label: "required" },
  { value: "underDevelopment", label: "under development" },
];

const selectedDatumType = ref("");
const datumTypes = [
  { value: "creation", label: "creation" },
  { value: "publication", label: "publication" },
  { value: "revision", label: "revision" },
];

let { data, error } = await useApi("/collections", {
  server: true,
});

let collections = data.value?.collections ?? [];

const collectionOptions = collections.map((collection) => ({
  value: collection.id,
  label: collection.description,
}));

const selectedLanguage = ref("");
const languages = [
  { value: "du", label: "Dutch" },
  { value: "eng", label: "English" },
  { value: "ger", label: "German" },
];
const spatialReferences = [{ value: "WGS 84", label: "WGS 84" }];

const accessConstraints = [
  { value: "copyright", label: "copyright" },
  { value: "patentPending", label: "patent pending" },
  { value: "trademark", label: "trademark" },
  { value: "license", label: "license" },
];
const selectedAccessConstraint = ref("");
const selectedSpatialReference = ref("");

let { $api } = useNuxtApp();

let formSchema = toTypedSchema(
  z.object({
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
          title: z.string().nullable().optional(),
          description: z.string().nullable().optional(),
          datetime: z
            .string()
            .nullable()
            .transform((v) => new Date(v).toISOString()),
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
              })
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
          })
        )
        .default({}),
      links: z
        .record(
          z.object({
            href: z.string(),
            rel: z.string(),
            type: z
              .union([
                z.literal("image/tiff; application=geotiff"),
                z.literal(
                  "image/tiff; application=geotiff; profile=cloud-optimized"
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
          })
        )
        .default({})
        .transform((val) => Object.values(val)),
    }),
    // TODO: extract type
  }) satisfies z.ZodType<any>
);

let { toast } = useToast();

let form = useForm({
  validationSchema: formSchema,
});

let onSubmit = form.handleSubmit(
  async (values) => {
    try {
      let data = await $api("/collections/{collection_id}/items", {
        method: "post",
        body: {
          ...values.requestBody,
          collection: values.collectionId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        path: {
          collection_id: values.collectionId,
        },
      });

      toast({
        title: "Data registered successfully",
      });

      // TODO: data is typed unknown
      await navigateTo(`/view/${data.id}`);
    } catch (error) {
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    }
  },
  (_errors) => {
    toast({
      title: "Your form contains errors!",
      variant: "destructive",
    });
  }
);

watch(form.errors, () => {
  console.log("Form errors", form.errors.value);
});

let datetimeValue = computed({
  get: () =>
    form.values.requestBody?.properties?.datetime
      ? parseDate(form.values.requestBody?.properties?.datetime)
      : undefined,
  set: (val) => val,
});

let assets = ref({
  [nanoid()]: {},
});

function addAsset() {
  assets.value[nanoid()] = {};
}

function removeAsset(id: string | number) {
  delete assets.value[id];
}

let links = ref({
  [nanoid()]: {},
});

function addLink() {
  links.value[nanoid()] = {};
}

function removeLink(id: string | number) {
  delete links.value[id];
}
</script>

<template>
  <Container class="py-8">
    <h1 class="text-3xl flex font-semibold">Register your data</h1>

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

        <Card>
          <CardHeader>
            <CardTitle class="text-lg">General information</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="max-w-96 flex flex-col gap-5">
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

              <FormField name="requestBody.properties.datetime">
                <FormItem class="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger as-child>
                      <FormControl>
                        <Button
                          variant="outline"
                          :class="
                            cn(
                              'w-[240px] ps-3 text-start font-normal',
                              !datetimeValue && 'text-muted-foreground'
                            )
                          "
                        >
                          <span>{{
                            datetimeValue
                              ? df.format(toDate(datetimeValue))
                              : "Pick a date"
                          }}</span>
                          <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
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
                                v.toString()
                              );
                            } else {
                              form.setFieldValue(
                                'requestBody.properties.datetime',
                                undefined
                              );
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle class="text-lg">Assets</CardTitle></CardHeader>
          <CardContent>
            <div class="flex flex-col">
              <div
                v-for="(_asset, id) in assets"
                class="border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6"
              >
                <Button
                  type="button"
                  @click="removeAsset(id)"
                  variant="destructive"
                >
                  <XIcon class="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <FormField
                  v-slot="{ componentField }"
                  :name="`requestBody.assets.${id}.href`"
                >
                  <FormItem>
                    <FormLabel>Href</FormLabel>
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
              </div>
            </div>

            <Button
              @click="addAsset"
              variant="outline"
              class="mt-5"
              type="button"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle class="text-lg">Links</CardTitle></CardHeader>
          <CardContent>
            <div class="flex flex-col">
              <div
                v-for="(_link, id) in links"
                class="border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6"
              >
                <Button
                  type="button"
                  @click="removeLink(id)"
                  variant="destructive"
                >
                  <XIcon class="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <FormField
                  v-slot="{ componentField }"
                  :name="`requestBody.links.${id}.href`"
                >
                  <FormItem>
                    <FormLabel>Href</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField
                  v-slot="{ componentField }"
                  :name="`requestBody.links.${id}.rel`"
                >
                  <FormItem>
                    <FormLabel>Rel</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField
                  v-slot="{ componentField }"
                  :name="`requestBody.links.${id}.type`"
                >
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField
                  v-slot="{ componentField }"
                  :name="`requestBody.links.${id}.title`"
                >
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <Button
              @click="addLink"
              variant="outline"
              class="mt-5"
              type="button"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            ><CardTitle class="text-lg">Keywords</CardTitle></CardHeader
          >
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

      <Button type="submit" class="mt-8">Submit</Button>
    </form>
  </Container>
</template>
