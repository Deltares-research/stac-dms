<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { Select } from "~/components/ui/select"
import { toast } from "~/components/ui/toast"

let route = useRoute()

let { $api } = useNuxtApp()

let { data: allKeywordGroups } = await useApi("/keywordgroups")

let { data: facility } = await useApi(`/facility/{facility_id}`, {
  path: {
    facility_id: route.params.facility_id as string,
  },
})

let { data: keywordgroups, refresh } = await useApi("/keywords", {
  query: {
    facility_id: route.params.facility_id as string,
  },
})

let linkGroupSchema = toTypedSchema(
  z.object({
    keyword_group_id: z.string(),
  }),
)

let linkGroupForm = useForm({
  validationSchema: linkGroupSchema,
})

let onSubmitLinkGroupForm = linkGroupForm.handleSubmit(async (values) => {
  await $api("/facility_keywordgroup_link", {
    method: "post",
    body: {
      ...values,
      facility_id: route.params.facility_id as string,
    },
  })

  toast({
    title: "Keyword group linked",
  })

  await refresh()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">{{ facility?.name }}</h1>
    <ul>
      <li v-for="group in keywordgroups" :key="group.id">
        {{ group.group_name_nl }}
      </li>
    </ul>

    <form @submit="onSubmitLinkGroupForm">
      <FormField v-slot="{ componentField }" name="keyword_group_id">
        <FormItem>
          <FormLabel>Keyword group</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a keyword group" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="group in allKeywordGroups"
                  :key="group.id"
                  :value="group.id"
                >
                  {{ group.group_name_nl }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">Link</Button>
    </form>
  </div>
</template>
