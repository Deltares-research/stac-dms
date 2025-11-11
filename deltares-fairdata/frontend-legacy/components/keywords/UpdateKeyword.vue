<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import type { Keyword } from "~/lib/types"
import { toast } from "../ui/toast"
import { CheckIcon } from "lucide-vue-next"

let { keyword, onUpdate } = defineProps<{
  keyword: Keyword
  onUpdate?(): void
}>()

let { $api } = useNuxtApp()

let updateSchema = toTypedSchema(
  z.object({
    nl_keyword: z.string().min(2),
  }),
)

let form = useForm({
  validationSchema: updateSchema,
  initialValues: {
    nl_keyword: keyword.nl_keyword ?? undefined,
  },
})

let onSubmit = form.handleSubmit(async (values) => {
  await $api(`/keyword/{keyword_id}`, {
    method: "put",
    body: values,
    path: {
      keyword_id: keyword.id,
    },
  })

  toast({
    title: "Keyword updated",
  })

  onUpdate?.()
})
</script>

<template>
  <form @submit="onSubmit" class="flex items-center gap-1.5 w-full">
    <FormField v-slot="{ componentField }" name="nl_keyword">
      <FormItem class="w-full">
        <Input
          v-bind="componentField"
          class="border-0 -ml-3 h-8 !ring-0 rounded-none outline-none"
        />
      </FormItem>
    </FormField>

    <Button
      v-if="form.isFieldDirty('nl_keyword')"
      type="submit"
      variant="outline"
      size="icon"
      class="flex-shrink-0 w-8 h-8"
    >
      <CheckIcon class="w-4 h-4 text-emerald-500" />
    </Button>
  </form>
</template>
