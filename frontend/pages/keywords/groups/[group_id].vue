<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { toast } from "~/components/ui/toast"

let route = useRoute()

let { $api } = useNuxtApp()

let { data, refresh } = await useApi("/keywords", {
  query: {
    keyword_group_id: route.params.group_id as string,
  },
})

let keywordsgroup = computed(() => {
  return data.value?.[0]
})

let createKeywordFormSchema = toTypedSchema(
  z.object({
    nl_keyword: z.string().min(2),
    en_keyword: z.string().min(2),
    external_id: z.string().min(2).optional(),
  }),
)

let createKeywordForm = useForm({
  validationSchema: createKeywordFormSchema,
})

let onSubmitCreateKeywordgoupForm = createKeywordForm.handleSubmit(
  async (values) => {
    await $api("/keyword", {
      method: "post",
      body: {
        ...values,
        group_id: route.params.group_id as string,
      },
    })

    toast({
      title: "Keyword created",
    })

    await refresh()
  },
)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">{{ keywordsgroup?.group_name_nl }}</h1>
    <ul>
      <li v-for="keyword in keywordsgroup?.keywords" :key="keyword.id">
        {{ keyword.nl_keyword }}
      </li>
    </ul>

    <form @submit="onSubmitCreateKeywordgoupForm">
      <FormField v-slot="{ componentField }" name="nl_keyword">
        <FormItem>
          <FormLabel>Keyword NL</FormLabel>
          <FormControl>
            <Input type="text" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="en_keyword">
        <FormItem>
          <FormLabel>Keyword EN</FormLabel>
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
