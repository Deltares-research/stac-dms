<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { toast } from "~/components/ui/toast"

let { $api } = useNuxtApp()

let createFacilityFormSchema = toTypedSchema(
  z.object({
    name: z.string().min(2),
  }),
)

let createFacilityForm = useForm({
  validationSchema: createFacilityFormSchema,
})

let onSubmitCreateFacilityForm = createFacilityForm.handleSubmit(
  async (values) => {
    await $api("/facility", {
      method: "post",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      title: "Facility created",
    })

    refresh()
  },
)

let { data: facilities, refresh } = await useApi("/facilities")

onBeforeRouteUpdate((guard) => {
  if (!guard.params.facility_id) {
    refresh()
  }
})
</script>

<template>
  <div class="mx-auto grid grid-cols-2 gap-12">
    <div>
      <div
        class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
      >
        Facilities
      </div>
      <div class="mt-3">
        <Lister>
          <ListerItem
            v-for="facility in facilities"
            :key="facility.id"
            :to="`/keywords/facilities/${facility.id}`"
          >
            {{ facility.name }}
          </ListerItem>
        </Lister>

        <hr class="my-8" />

        <form
          @submit="onSubmitCreateFacilityForm"
          class="flex items-end gap-1.5 w-full"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="w-full">
              <FormLabel>Add facility</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="mt-3">Create</Button>
        </form>
      </div>
    </div>

    <div>
      <NuxtPage />
    </div>
  </div>
</template>
