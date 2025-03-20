<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import type { Facility } from "~/lib/types"
import { toast } from "../ui/toast"
import { CheckIcon } from "lucide-vue-next"

let { facility, onUpdate } = defineProps<{
  facility: Facility
  onUpdate?(): void
}>()

let { $api } = useNuxtApp()

let updateSchema = toTypedSchema(
  z.object({
    name: z.string().min(2),
  }),
)

let form = useForm({
  validationSchema: updateSchema,
  initialValues: {
    name: facility.name ?? undefined,
  },
})

let onSubmit = form.handleSubmit(async (values) => {
  await $api(`/facility/{facility_id}`, {
    method: "put",
    body: values,
    path: {
      // TODO: Fix API spec to make id required
      facility_id: facility.id ?? "",
    },
  })

  toast({
    title: "Facility updated",
  })

  onUpdate?.()
})
</script>

<template>
  <form @submit="onSubmit" class="flex items-center gap-1.5 w-full">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem class="w-full">
        <Input
          v-bind="componentField"
          class="border-0 -ml-3 h-8 !ring-0 rounded-none outline-none text-2xl font-bold"
        />
      </FormItem>
    </FormField>

    <Button
      v-if="form.isFieldDirty('name')"
      type="submit"
      variant="outline"
      size="icon"
      class="flex-shrink-0 w-8 h-8"
    >
      <CheckIcon class="w-4 h-4 text-emerald-500" />
    </Button>
  </form>
</template>
