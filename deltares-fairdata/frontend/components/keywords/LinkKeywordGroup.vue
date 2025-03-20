<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { toast } from "../ui/toast"

let { data: allKeywordGroups } = await useApi("/keywordgroups")

let { facility_id, onLink } = defineProps<{
  facility_id: string
  onLink?(): void
}>()

let { $api } = useNuxtApp()

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
      facility_id,
    },
  })

  toast({
    title: "Keyword group linked",
  })

  onLink?.()
})
</script>

<template>
  <form @submit="onSubmitLinkGroupForm" class="flex items-end gap-1.5 w-full">
    <FormField v-slot="{ componentField }" name="keyword_group_id">
      <FormItem class="w-full">
        <FormLabel>Link keyword group</FormLabel>
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
</template>
