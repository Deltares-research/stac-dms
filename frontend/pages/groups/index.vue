<script setup lang="ts">
import { PlusIcon, ArrowUpDown, Pencil } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog"
import DataTable from "@/components/table/DataTable.vue"
import type { components } from "#open-fetch-schemas/api"
import Container from "~/components/deltares/Container.vue"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { useForm } from "vee-validate"
import { toast } from "~/components/ui/toast"
import Input from "~/components/ui/input/Input.vue"

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

let { $api } = useNuxtApp()

let createGroupSchema = toTypedSchema(
  z.object({
    name: z.string(),
    description: z.string(),
  }),
)

let createGroupForm = useForm({
  validationSchema: createGroupSchema,
})

watchEffect(() => {
  console.log(createGroupForm.errors.value)
})

let onSubmitCreateGroupForm = createGroupForm.handleSubmit(async (values) => {
  console.log("slert")
  let result = await $api("/groups", {
    method: "post",
    body: values,
  })

  toast({
    title: `Group "${values.name}" created`,
  })

  navigateTo(`/groups/${result.id}`)
})
</script>

<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      Permissions
    </h3>
    <p class="text-sm text-muted-foreground">Manage groups and permissions</p>
    <div class="flex justify-end">
      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <PlusIcon class="w-4 h-4 mr-2" />
            Add new group
          </Button>
        </DialogTrigger>
        <DialogContent as-child>
          <form @submit="onSubmitCreateGroupForm">
            <DialogHeader>
              <DialogTitle>Create group</DialogTitle>
            </DialogHeader>
            <FormField v-slot="{ componentField }" name="name">
              <FormItem class="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="description">
              <FormItem class="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogFooter>
              <Button type="submit">Create group</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
