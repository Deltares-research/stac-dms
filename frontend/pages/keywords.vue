<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { toast } from "~/components/ui/toast"

let { $api } = useNuxtApp()

// === Facilities ===
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

// === Keywordgroups
let createKeywordgroupFormSchema = toTypedSchema(
  z.object({
    group_name_nl: z.string().min(2),
    group_name_en: z.string().min(2),
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
  },
)

let { data: keywordgroups } = await useApi("/keywordgroups")
</script>

<template>
  <div class="my-8 container mx-auto">
    <h1>Facilities</h1>
    <ul>
      <li v-for="facility in facilities" :key="facility.id">
        {{ facility.name }}
      </li>
    </ul>
    <form @submit="onSubmitCreateFacilityForm">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Facility name</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit">Create</Button>
    </form>

    <hr class="my-12" />

    <h1>Keyword groups</h1>
    <ul>
      <li v-for="keywordgroup in keywordgroups" :key="keywordgroup.id">
        {{ keywordgroup.group_name_nl }}
      </li>
    </ul>
    <form @submit="onSubmitCreateKeywordgoupForm">
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

      <Button type="submit">Create</Button>
    </form>
  </div>
</template>
