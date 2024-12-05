<script setup lang="ts">
import { PlusIcon, ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/table/DataTable.vue"
import type { components } from "#open-fetch-schemas/api"
import Container from "~/components/deltares/Container.vue"
import UserCombobox from "~/components/rbac/UserCombobox.vue"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { Form, useForm } from "vee-validate"
import { toast } from "~/components/ui/toast"

let route = useRoute()
let group_id = route.params.id as string

let { data: group, refresh } = await useApi("/groups/{group_id}", {
  path: { group_id },
})

let { data: users, refresh: refreshUsers } = await useApi(
  "/groups_users/{group_id}",
  {
    path: { group_id },
    method: "post",
  },
)

const columns: ColumnDef<components["schemas"]["User"]>[] = [
  {
    accessorKey: "username",
    id: "username",
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
    id: "email",
    accessorKey: "email",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          class: "px-0",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
  {
    id: "remove",
    cell: ({ row }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: async () => {
            if (!row.original.id) return

            await $api("/groups_users_unlink", {
              method: "delete",
              body: {
                user_ids: [row.original.id],
                group_id,
              },
            })

            toast({
              title: `${row.original.username} removed from group`,
            })

            refreshUsers()
          },
        },
        () => ["Remove", h(Trash2, { class: "ml-2 h-4 w-4" })],
      )
    },
  },
]

let { $api } = useNuxtApp()

let addUsersToGroupSchema = toTypedSchema(
  z.object({
    user_ids: z.array(z.string()),
  }),
)

let addUsersToGroupForm = useForm({
  validationSchema: addUsersToGroupSchema,
})

let onSubmitAddUsersToGroupForm = addUsersToGroupForm.handleSubmit(
  async (values) => {
    await $api("/groups_users_link", {
      method: "post",
      body: {
        ...values,
        group_id,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      title: `${values.user_ids.length} users added to group`,
    })

    addUsersToGroupForm.resetForm()

    refresh()
    refreshUsers()
  },
)
</script>

<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      {{ group?.name }}
    </h3>
    <p class="text-sm text-muted-foreground">
      Manage users in {{ group?.name }}
    </p>

    <div class="mt-8">
      <DataTable v-if="users" :columns="columns" :data="users" />
    </div>

    <form
      @submit="onSubmitAddUsersToGroupForm"
      class="mt-12 flex items-end gap-1.5 w-full"
    >
      <FormField v-slot="{ componentField }" name="user_ids">
        <FormItem class="w-full">
          <FormLabel>Add users to this group</FormLabel>
          <FormControl>
            <UserCombobox v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="mt-3">Add</Button>
    </form>
  </Container>
</template>
