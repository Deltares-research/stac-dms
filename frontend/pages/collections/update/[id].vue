<template>
  <div class="grid grid-cols-2 gap-12">
    <CollectionCardForm
      card-title="Edit collection"
      button-title="update"
      :errors="errors"
      @update="updateCollection"
      :title="title"
      :description="description"
      :collectionType="selectedCollectionType"
      :keywordFacility="selectedKeywordsFacility"
    />

    <div class="mt-12 flex flex-col space-y-1.5">
      <h2 class="text-lg font-semibold">Permissions</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableHead>Group</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow v-for="permission in permissions" :key="permission.id">
            <!-- TODO: Replace with group name -->
            <TableCell>{{ permission.group_id }}</TableCell>
            <TableCell>
              {{ roles?.find((r) => r.id === permission.role_id)?.name }}
            </TableCell>
            <TableCell>
              <DeletePermission
                @deleted="refreshPermissions"
                :group_id="permission.group_id"
                :object="permission.object"
                :role_name="
                  // TODO: Replace with role name
                  roles?.find((r) => r.id === permission.role_id)?.name
                "
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <form
        @submit="onSubmitAddPermissionForm"
        class="mt-12 flex items-end gap-1.5 w-full"
      >
        <FormField v-slot="{ componentField }" name="group_ids">
          <FormItem class="w-full">
            <FormLabel>Group</FormLabel>
            <FormControl>
              <GroupCombobox v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="role_name">
          <FormItem class="w-full">
            <FormLabel>Role</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="role in roles"
                    :key="role.id"
                    :value="role.name"
                  >
                    {{ role.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="mt-3">Add</Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Collection } from "@/lib/collection"
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
import { useNuxtApp, useRoute, useRouter } from "nuxt/app"
import { ref } from "vue"
import GroupCombobox from "~/components/rbac/GroupCombobox.vue"
import { toast } from "@/components/ui/toast"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { useForm } from "vee-validate"
import DeletePermission from "~/components/rbac/DeletePermission.vue"

const { $api } = useNuxtApp()

const errors = ref("")
const title = ref("")
const description = ref("")
const selectedCollectionType = ref("")
const selectedKeywordsFacility = ref("")
const selectedGroups = ref([])

const route = useRoute()

const collectionId = route.params.id as string

const { data: roles } = await useApi("/roles", {
  method: "get",
})

let addPermissionSchema = toTypedSchema(
  z.object({
    group_ids: z.array(z.string()),
    role_name: z.string(),
  }),
)

let addPermissionForm = useForm({
  validationSchema: addPermissionSchema,
})

let onSubmitAddPermissionForm = addPermissionForm.handleSubmit(
  async (values) => {
    let response = await $api("/permissions", {
      method: "post",
      body: {
        role_name: values.role_name,
        group_id: values.group_ids[0],
        object: collectionId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      title: response.message,
    })

    addPermissionForm.resetForm()
    refreshPermissions()
  },
)

const { data: permissions, refresh: refreshPermissions } = await useApi(
  "/permissions/{obj}",
  {
    method: "post",
    path: { obj: collectionId },
  },
)

const data = await $api("/collections/{collection_id}", {
  path: {
    collection_id: route.params.id,
  },
})

title.value = data.title
description.value = data.description
selectedCollectionType.value = data.keywords[0]
const keywordsLink = data.links.find((item) => item.rel == "keywords")
selectedKeywordsFacility.value =
  keywordsLink !== undefined ? keywordsLink.id : "No keywords"

async function updateCollection(emitedCollection: Collection) {
  const updatedCollection = {
    type: "Collection",
    stac_version: "1.0.0",
    id: data.id,
    title: emitedCollection.title,
    description: emitedCollection.description,
    keywords: [emitedCollection.collectionType],
    license: "proprietary",
    extent: {
      spatial: {
        bbox: [[-180, -56, 180, 83]],
      },
      temporal: {
        interval: [[]],
      },
    },
    links: [],
  }
  if (emitedCollection.keywordsFacility !== "No keywords") {
    updatedCollection.links.push({
      rel: "keywords",
      href: "/facilities/" + emitedCollection.keywordsFacility,
      type: "application/json",
      id: emitedCollection.keywordsFacility,
    })
  }
  try {
    errors.value = ""
    const data = await $api("/collections/{id}", {
      method: "PUT",
      path: {
        id: route.params.id,
      },
      body: updatedCollection,
    })
  } catch (e) {
    errors.value = "It was not possible to update the collection"
    return
  }

  const router = useRouter()
  router.push("/collections")
}
</script>

<style scoped></style>
