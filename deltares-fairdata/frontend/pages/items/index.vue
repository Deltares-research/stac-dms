<script setup lang="ts">
import { PlusIcon, ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import type { components } from "#open-fetch-schemas/api"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/table/DataTable.vue"
import dateFormat from "dateformat"

let { data: items, refresh } = await useApi("/search?limit=1000")

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 1000))
  await refresh()
})
const router = useRouter()
const collectionColumns: ColumnDef<
  components["schemas"]["stac_pydantic__api__item_collection__ItemCollection"]
>[] = [
  {
    accessorKey: "properties.title",
    id: "properties.title",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => {
            column.toggleSorting(column.getIsSorted() === "asc")
          },
        },
        () => ["Title", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      return (
        h("div", { class: "lowercase" }, row.original.properties.title) ?? ""
      )
    },
  },
  {
    accessorKey: "properties.description",
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
        { class: "lowercase" },
        row.original.properties.description ?? "",
      )
    },
  },
  {
    accessorKey: "collection",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Collection", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      return h("div", { class: "lowercase" }, row.original.collection)
    },
  },
  {
    accessorKey: "properties.storagelocation",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Storage location", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      return h(
        "div",
        { class: "lowercase" },
        row.original.properties.storagelocation,
      )
    },
  },
  {
    accessorKey: "properties.datetime",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
    cell: ({ row }) => {
      const date = dateFormat(
        row.original.properties.datetime,
        "dd-mm-yyyy hh:MM:ss",
      )
      return h("div", { class: "lowercase" }, date)
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
            router.push("/items/" + row.original.id + "/edit")
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
            router.push("/items/" + row.original.id + "/delete")
          },
        },
        () => ["Delete", h(Trash2, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
]
</script>

<template>
  <Card class="mt-5">
    <CardHeader>
      <CardTitle>Registered data</CardTitle>
      <CardDescription
        >List of data sets registrations, which you are allowed to edit
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex justify-end">
        <Button as-child>
          <NuxtLink to="/items/create/edit" class="flex items-center gap-1">
            <PlusIcon class="w-4 h-4 mr-2" />
            Register new dataset
          </NuxtLink>
        </Button>
      </div>
      <div class="flex justify-end"></div>
      <DataTable
        v-if="items?.features"
        :columns="collectionColumns"
        :data="items.features"
        filterId="properties.title"
      />
    </CardContent>
  </Card>
</template>
