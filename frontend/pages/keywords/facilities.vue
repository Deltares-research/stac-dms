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
  },
)

let { data: facilities } = await useApi("/facilities")
</script>

<template>
  <div class="mx-auto grid grid-cols-2 gap-12">
    <div>
      <h1 class="text-2xl font-semibold">Facilities</h1>
      <ul class="flex flex-col gap-1.5 bg-gray-100 p-1.5 rounded h-fit">
        <li v-for="facility in facilities" :key="facility.id">
          <NuxtLink
            :to="`/keywords/facilities/${facility.id}`"
            active-class="bg-white shadow-sm "
            class="rounded px-3 py-1.5 text-sm font-medium block"
          >
            {{ facility.name }}
          </NuxtLink>
        </li>
      </ul>

      <hr class="my-12" />

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

    <div>
      <NuxtPage />
    </div>
  </div>
</template>
