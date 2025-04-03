<script setup lang="ts">
import { ArrowUpDown, Trash2 } from "lucide-vue-next"
import type { ColumnDef } from "@tanstack/vue-table"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/table/DataTable.vue"
import type { components } from "#open-fetch-schemas/api"
import Container from "~/components/deltares/Container.vue"
import UserCombobox from "~/components/rbac/UserCombobox.vue"
import { toTypedSchema } from "@vee-validate/zod"
import { z } from "zod"
import { useForm } from "vee-validate"
import { toast } from "~/components/ui/toast"

let route = useRoute()
let group_id = route.params.id as string

let { data: group, refresh } = await useApi("/groups/{group_id}", {
  path: { group_id },
})

let users = computed(() => {
  return group.value?.users ?? []
})

let roles = computed(() => {
  return group.value?.roles.map((r) => r.role) ?? []
})

function hasRole(role: (typeof allRoles)[number]) {
  return roles.value?.includes(role)
}

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
            if (!row.original.email) return

            await $api("/groups/{group_id}/members", {
              method: "delete",
              path: { group_id },
              query: {
                user_email: row.original.email,
              },
            })

            toast({
              title: `${row.original.username} removed from group`,
            })

            refresh()
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
    emails: z.array(z.string()),
  }),
)

let addUsersToGroupForm = useForm({
  validationSchema: addUsersToGroupSchema,
})

let onSubmitAddUsersToGroupForm = addUsersToGroupForm.handleSubmit(
  async (values) => {
    await $api("/groups/{group_id}/members", {
      method: "post",
      path: { group_id },
      body: values.emails,
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      title: `${values.emails.length} users added to group`,
    })

    addUsersToGroupForm.resetForm()

    refresh()
  },
)

let allRoles = ["admin", "keyword_editor", "application_data_steward"] as const

let pendingRoleChanges = ref<(typeof allRoles)[number][]>([])

async function toggleRole(role: (typeof allRoles)[number], checked: boolean) {
  pendingRoleChanges.value.push(role)

  if (checked) {
    await $api("/group-role", {
      method: "post",
      body: {
        group_id: group_id,
        role: role,
      },
    })
  } else {
    await $api("/group-role", {
      method: "delete",
      query: { group_id: group_id, role: role },
    })
  }

  await refresh()

  pendingRoleChanges.value = pendingRoleChanges.value.filter((r) => r !== role)
}
</script>

<template>
  <Container>
    <h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
      {{ group?.name }}
    </h3>
    <p class="text-sm text-muted-foreground">
      Manage users and roles in
      <code class="text-black">{{ group?.name }}</code>
    </p>

    <Tabs defaultValue="members" class="mt-8">
      <TabsList>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <form
          @submit="onSubmitAddUsersToGroupForm"
          class="mt-8 flex items-end gap-1.5 w-full"
        >
          <FormField v-slot="{ componentField }" name="emails">
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

        <div class="mt-8">
          <DataTable v-if="users" :columns="columns" :data="users" />
        </div>
      </TabsContent>

      <TabsContent value="roles">
        <div class="mt-8 flex flex-col gap-3">
          <Label class="flex items-center gap-2">
            <Checkbox
              @update:checked="(v) => toggleRole('admin', v)"
              :checked="hasRole('admin')"
              :disabled="pendingRoleChanges.includes('admin')"
            />
            Admin
          </Label>

          <Label class="flex items-center gap-2">
            <Checkbox
              @update:checked="(v) => toggleRole('keyword_editor', v)"
              :checked="hasRole('keyword_editor')"
              :disabled="pendingRoleChanges.includes('keyword_editor')"
            />
            Keyword Editor
          </Label>

          <Label class="flex items-center gap-2 disabled:opacity-50">
            <Checkbox
              @update:checked="(v) => toggleRole('application_data_steward', v)"
              :checked="hasRole('application_data_steward')"
              :disabled="
                pendingRoleChanges.includes('application_data_steward')
              "
            />
            Application Data Steward
          </Label>
        </div>
      </TabsContent>
    </Tabs>
  </Container>
</template>
