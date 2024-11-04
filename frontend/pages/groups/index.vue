<script setup lang="ts">
import { PlusIcon, ArrowUpDown, Pencil } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/table/DataTable.vue"
import type { components } from "#open-fetch-schemas/api"
import Container from "~/components/deltares/Container.vue"

let { data: groups, refresh } = await useApi("/groups")

const router = useRouter()
const columns: ColumnDef<components["schemas"]["Group"]>[] = [
  {
    accessorKey: "name",
    id: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          class: "px-0",
          onClick: () => {
            column.toggleSorting(column.getIsSorted() === "asc")
          },
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          class: "px-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
  {
    id: "edit",
    cell: ({ row }) => {
      return h(
        resolveComponent("NuxtLink"),
        { to: `/groups/${row.original.id}`, class: "flex items-center gap-2" },
        () => ["Edit", h(Pencil, { class: "size-4" })],
      )
    },
  },
]
</script>

<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      Permissions
    </h3>
    <p class="text-sm text-muted-foreground">Manage groups and permissions</p>
    <div class="flex justify-end">
      <Button as-child>
        <NuxtLink to="/items/create" class="flex items-center gap-1">
          <PlusIcon class="w-4 h-4 mr-2" />
          Add new group
        </NuxtLink>
      </Button>
    </div>
    <div class="flex justify-end"></div>
    <DataTable
      v-if="groups"
      :columns="columns"
      :data="groups"
      filterId="name"
    />
  </Container>
</template>
