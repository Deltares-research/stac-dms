<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import Lister from "~/components/lister/Lister.vue"
import { Button } from "~/components/ui/button"
import { toast } from "~/components/ui/toast"

let { $api } = useNuxtApp()

let { data: keywordgroups, refresh } = await useApi("/keywordgroups")

let createKeywordgroupFormSchema = toTypedSchema(
  z.object({
    group_name_nl: z.string().min(2),
    group_name_en: z.string().min(2),
    facility_type: z.string().min(2),
  }),
)

let createKeywordgroupForm = useForm({
  validationSchema: createKeywordgroupFormSchema,
})

let onSubmitCreateKeywordgoupForm = createKeywordgroupForm.handleSubmit(
  async (values) => {
    await $api("/keywordgroup", {
      method: "post",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    })

    toast({
      title: "Keyword group created",
    })

    refresh()

    createKeywordgroupForm.resetForm()
  },
)

onBeforeRouteUpdate((guard) => {
  if (!guard.params.group_id) {
    refresh()
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <div>
      <div
        class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
      >
        Keyword Groups
      </div>
      <div class="mt-3">
        <Lister>
          <ListerItem
            v-for="keywordgroup in keywordgroups"
            :key="keywordgroup.id"
            :to="`/keywords/groups/${keywordgroup.id}`"
          >
            {{ keywordgroup.group_name_nl }}
          </ListerItem>
        </Lister>

        <hr class="my-8" />

        <h2 class="text font-medium">Create keyword group</h2>
        <form @submit="onSubmitCreateKeywordgoupForm" class="mt-3">
          <FormField v-slot="{ componentField }" name="group_name_nl">
            <FormItem>
              <FormLabel>Group name NL</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="group_name_en">
            <FormItem>
              <FormLabel>Group name EN</FormLabel>
              <FormControl>
                <Input type="text" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="facility_type">
            <FormItem>
              <FormLabel>Facility Type</FormLabel>
              <FormControl>
                <select v-bind="componentField" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a facility type</option>
                  <option value="general">General</option>
                  <option value="experimentalFacility">Experimental Facility</option>
                  <option value="numericalModel">Numerical Model</option>
                  <option value="field">Field</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <Button type="submit" class="mt-5">Create</Button>
        </form>
      </div>
    </div>

    <div>
      <NuxtPage />
    </div>
  </div>
</template>
