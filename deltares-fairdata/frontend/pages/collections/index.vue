<template>
  <Card>
    <CardHeader>
      <CardTitle>Domains</CardTitle>
      <CardDescription
        >List of data sets domains, which you are allowed to edit
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex justify-end mb-3">
        <Button v-if="hasPermission('group:create')">
          <NuxtLink to="/collections/create">Add domain</NuxtLink>
        </Button>
      </div>
      <DataTable :columns="collectionColumns" :data="collections" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import DataTable from "@/components/table/DataTable.vue"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/vue-table"
import type { components } from "#open-fetch-schemas/api"
import { h } from "vue"
import { collectionTypes } from "@/lib/collectionTypes"
import { NuxtLink } from "#components"
import { usePermissions } from "@/composables/permissions"
import { toast } from "~/components/ui/toast"

const { hasPermission } = await usePermissions()

const { $api } = useNuxtApp()

let { data: keywords } = await useApi("/facilities")

const { data, refresh } = await useApi("/collections?limit=1000")

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  await refresh()
})

const collections = computed(() => data.value?.collections)

async function deleteCollection(
  collection: components["schemas"]["stac_pydantic__api__collection__Collection"],
) {
  if (
    confirm(
      `Are you sure you want to delete collection: ${collection.title || collection.id}?`,
    )
  ) {
    try {
      await $api("/collections/{collection_id}", {
        method: "DELETE",
        path: {
          collection_id: collection.id,
        },
      })

      refresh()
    } catch (error) {
      console.error("error", error)
      toast({
        variant: "destructive",
        title: "Error deleting collection",
      })
    }
  }
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
    cell: ({ row }) => row.getValue("title"),
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
      return h(
        "div",
        {
          class:
            "whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis",
        },
        row.getValue("description") ?? "",
      )
    },
  },
  {
    accessorKey: "links",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Keywords", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      const links = row.original.links.find((item) => item.rel == "keywords")
      if (links === undefined) return "No keywords"
      const keywordDescription = keywords.value.find(
        (item) => item.id == links.id,
      )
      if (keywordDescription === undefined) return "No keywords"
      return keywordDescription.name
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return h("div", { class: "flex gap-2" }, [
        h(
          Button,
          {
            variant: "outline",
            asChild: true,
            size: "icon",
          },
          () =>
            h(
              NuxtLink,
              {
                to: `/collections/update/${row.original.id}`,
              },
              () => [h(Pencil, { class: "h-4 w-4" })],
            ),
        ),
        h(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: () => {
              deleteCollection(row.original)
            },
          },
          [h(Trash2, { class: "h-4 w-4" })],
        ),
      ])
    },
  },
]
</script>
