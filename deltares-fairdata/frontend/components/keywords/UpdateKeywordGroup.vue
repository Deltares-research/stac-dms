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
  }),
)

let form = useForm({
  validationSchema: updateSchema,
  initialValues: {
    group_name_nl: group.group_name_nl ?? undefined,
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
  </form>
</template>
