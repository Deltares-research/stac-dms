<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import type { Facility, KeywordGroup } from "~/lib/types"
import { toast } from "../ui/toast"
import { CheckIcon } from "lucide-vue-next"

let { group, onUpdate } = defineProps<{
  group: KeywordGroup
  onUpdate?(): void
}>()

let { $api } = useNuxtApp()

let updateSchema = toTypedSchema(
  z.object({
    group_name_nl: z.string().min(2),
    facility_type: z.string().optional(),
  }),
)

let form = useForm({
  validationSchema: updateSchema,
  initialValues: {
    group_name_nl: group.group_name_nl ?? undefined,
    facility_type: group.facility_type ?? undefined,
  },
})

let onSubmit = form.handleSubmit(async (values) => {
  await $api(`/keywordgroup/{keywordgroup_id}`, {
    method: "put",
    body: values,
    path: {
      keywordgroup_id: group.id,
    },
  })

  toast({
    title: "Keyword group updated",
  })

  onUpdate?.()
})
</script>

<template>
  <form @submit="onSubmit" class="flex items-center gap-1.5 w-full">
    <FormField v-slot="{ componentField }" name="group_name_nl">
      <FormItem class="w-full">
        <Input
          v-bind="componentField"
          class="border-0 -ml-3 h-8 !ring-0 rounded-none outline-none text-2xl font-bold"
        />
      </FormItem>
    </FormField>

    <Button
      v-if="form.isFieldDirty('group_name_nl')"
      type="submit"
      variant="outline"
      size="icon"
      class="flex-shrink-0 w-8 h-8"
    >
      <CheckIcon class="w-4 h-4 text-emerald-500" />
    </Button>

    <FormField v-slot="{ componentField }" name="facility_type">
      <FormItem>
        <FormControl>
          <select
            v-model="componentField.modelValue"
            @blur="componentField.onBlur"
            :name="componentField.name"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="general">General</option>
            <option value="experimentalFacility">Experimental Facility</option>
            <option value="numericalModel">Numerical Model</option>
            <option value="field">Field</option>
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
