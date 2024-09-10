<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { toast } from "~/components/ui/toast"

let { $api } = useNuxtApp()

let { data: keywordgroups, refresh } = await useApi("/keywordgroups")

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

    refresh()
  },
)
</script>

<template>
  <div class="grid grid-cols-2">
    <div class="">
      <h1>Keyword groups</h1>
      <ul>
        <li v-for="keywordgroup in keywordgroups" :key="keywordgroup.id">
          <NuxtLink
            :to="`/keywords/groups/${keywordgroup.id}`"
            class="text-blue-400 underline"
          >
            {{ keywordgroup.group_name_nl }}
          </NuxtLink>
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

    <div>
      <NuxtPage />
    </div>
  </div>
</template>
