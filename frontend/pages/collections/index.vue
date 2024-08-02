<template>
  <Card>
    <CardHeader>
      <CardTitle>Collections</CardTitle>
      <CardDescription
        >List of data sets collections, which you are allowed to edit
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex justify-end">
        <Button>
          <NuxtLink to="/collections/create">Add collection</NuxtLink>
        </Button>
      </div>
      <DataTable
        :columns="collectionColumns"
        :data="collections"
        filterId="title"
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import DataTable from "@/components/table/DataTable.vue"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/vue-table"
import type { components } from "#open-fetch-schemas/api"
import { h, onMounted, ref } from "vue"
import { useNuxtApp, useRouter } from "nuxt/app"

const router = useRouter()
const { $api } = useNuxtApp()
const collections = ref([])

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  let retrievedCollections = []
  let url = "/collections"
  while (url) {
    let pos = url.search("/api") //should be fixed in the backend!
    url = pos != -1 ? url.substring(pos) : url
    url = await retrieveCollection(url, retrievedCollections)
  }
  collections.value = retrievedCollections
})

async function retrieveCollection(
  url: string,
  collections: [],
): Promise<string> {
  try {
    const collectionsData = await $api(url)
    collectionsData.collections.forEach((item) => collections.push(item))
    return collectionsData.links[3].href
  } catch (e) {
    return ""
  }
}

async function updateCollection(id: string) {
  router.push("/collections/update/" + id)
}

async function deleteCollection(id: string) {
  router.push("/collections/delete/" + id)
}

const collectionColumns: ColumnDef<
  components["schemas"]["stac_pydantic__api__collection__Collection"]
>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Title", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => h("div", { class: "lowercase" }, row.getValue("title")),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      return h("div", { class: "lowercase" }, row.getValue("description"))
    },
  },
  {
    id: "edit",
    cell: ({ row }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => {
            updateCollection(row.original.id)
          },
        },
        () => ["Edit", h(Pencil, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => {
            deleteCollection(row.original.id)
          },
        },
        () => ["Delete", h(Trash2, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
]
</script>

<style scoped></style>
