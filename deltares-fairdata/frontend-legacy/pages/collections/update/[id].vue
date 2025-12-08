<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      {{ collection?.title }}
    </h3>

    <Tabs defaultValue="form" class="mt-8">
      <TabsList>
        <TabsTrigger value="form">Collection</TabsTrigger>
        <TabsTrigger value="roles">Permissions</TabsTrigger>
      </TabsList>

      <TabsContent value="form" forceMount>
        <div class="mt-8 relative">
          <div
            v-if="!hasPermission('collection:update')"
            class="absolute inset-0 bg-white/70 flex items-center justify-center text-center text-sm text-muted-foreground"
          >
            <Lock class="size-4 mr-2" />
            You have no permission to update this collection
          </div>
          <form @submit="onSubmitUpdateCollectionForm">
            <CollectionCardForm />
            <Button type="submit" class="mt-5 min-w-[120px]">Update</Button>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="roles" forceMount>
        <div class="mt-8 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-full">Group</TableHead>
                <TableHead class="whitespace-nowrap">Data Producer</TableHead>
                <TableHead class="whitespace-nowrap">
                  Domain Data Steward
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="group in groups" :key="group.id">
                <!-- TODO: Replace with group name -->
                <TableCell>{{ group.name }}</TableCell>
                <TableCell class="text-center">
                  <div class="relative flex items-center justify-center">
                    <Loader2
                      v-if="
                        pendingRoleChanges.includes(`${group.id}-data_producer`)
                      "
                      class="size-3 animate-spin absolute"
                    />
                    <Checkbox
                      :disabled="
                        pendingRoleChanges.includes(`${group.id}-data_producer`)
                      "
                      @update:checked="
                        (v) => toggleRole(group.id, 'data_producer', v)
                      "
                      :checked="hasRole(group.id, 'data_producer')"
                    />
                  </div>
                </TableCell>
                <TableCell class="text-center">
                  <div class="relative flex items-center justify-center">
                    <Loader2
                      v-if="
                        pendingRoleChanges.includes(
                          `${group.id}-collection_data_steward`,
                        )
                      "
                      class="size-3 animate-spin absolute"
                    />
                    <Checkbox
                      class="disabled:opacity-50"
                      :disabled="
                        pendingRoleChanges.includes(
                          `${group.id}-collection_data_steward`,
                        )
                      "
                      @update:checked="
                        (v) =>
                          toggleRole(group.id, 'collection_data_steward', v)
                      "
                      :checked="hasRole(group.id, 'collection_data_steward')"
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  </Container>
</template>

<script setup lang="ts">
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
import { useNuxtApp, useRoute } from "nuxt/app"
import { ref } from "vue"
import { toast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { collectionFormSchema } from "~/schemas/collection"
import type { components } from "#open-fetch-schemas/api"
import Container from "~/components/deltares/Container.vue"
import TableHeader from "~/components/ui/table/TableHeader.vue"
import { Loader2, Lock } from "lucide-vue-next"
import { useCollectionPermissions } from "@/composables/permissions"

const roles = [
  "collection_data_steward",
  "data_producer",
] as const satisfies components["schemas"]["Role"][]

const { $api } = useNuxtApp()

const errors = ref("")

const route = useRoute()
const collectionId = String(route.params.id)

const { hasPermission, refresh: refreshCollectionPermissions } =
  await useCollectionPermissions(collectionId)

let { data: groups } = await useApi("/groups")

function hasRole(group_id: string | undefined, role: (typeof roles)[number]) {
  if (!group_id) return false

  return (
    permissions.value?.some(
      (p) => p.group_id === group_id && p.role === role,
    ) ?? false
  )
}

let pendingRoleChanges = ref<`${string}-${(typeof roles)[number]}`[]>([])

async function toggleRole(
  group_id: string | undefined,
  role: (typeof roles)[number],
  checked: boolean,
) {
  pendingRoleChanges.value.push(`${group_id}-${role}`)

  if (!group_id) {
    return
  }

  if (checked) {
    await $api("/group-role/{collection_id}", {
      method: "post",
      path: { collection_id: collectionId },
      body: { group_id, role },
    })
  } else {
    await $api("/group-role/{collection_id}", {
      method: "delete",
      path: { collection_id: collectionId },
      query: { group_id, role },
    })
  }

  await refreshPermissions()
  await refreshCollectionPermissions()

  toast({
    title: "Permissions updated",
  })

  pendingRoleChanges.value = pendingRoleChanges.value.filter(
    (p) => p !== `${group_id}-${role}`,
  )
}

const { data: permissions, refresh: refreshPermissions } = await useApi(
  "/group-role/{collection_id}",
  {
    method: "get",
    path: { collection_id: collectionId },
  },
)

const { data, refresh } = await useApi("/collections/{collection_id}", {
  path: {
    collection_id: collectionId,
  },
})

if (!data.value) {
  throw navigateTo("/collections")
}

let collection = computed(() => data.value)

let updateCollectionFormSchema = toTypedSchema(collectionFormSchema)

const updateCollectionForm = useForm({
  validationSchema: updateCollectionFormSchema,
  initialValues: {
    title: data.value.title ?? "",
    description: data.value.description ?? "",
    keywordsFacility:
      data.value.links?.find((item) => item.rel == "keywords")?.id ??
      "No keywords",
  },
})

let onSubmitUpdateCollectionForm = updateCollectionForm.handleSubmit(
  async (values) => {
    const { error } = await useApi("/collections/{collection_id}", {
      method: "PUT",
      path: {
        collection_id: collectionId,
      },
      body: {
        type: "Collection",
        stac_version: "1.0.0",
        stac_extensions: [],
        id: collectionId,
        title: values.title,
        description: values.description,
        keywords: [],
        license: "proprietary",
        extent: {
          spatial: {
            bbox: [[-180, -56, 180, 83]],
          },
          temporal: {
            interval: [[]],
          },
        },
        links:
          values.keywordsFacility !== "No keywords"
            ? [
                {
                  rel: "keywords",
                  href: "/facilities/" + values.keywordsFacility,
                  type: "application/json",
                  id: values.keywordsFacility,
                },
              ]
            : [],
      },
    })

    if (error.value) {
      errors.value =
        (error.value?.data?.detail as unknown as string) ??
        "Something went wrong"
      return
    }

    toast({
      title: "Domain updated",
    })

    await refresh()
  },
)
</script>
