<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import DeleteKeywordGroup from "~/components/keywords/DeleteKeywordGroup.vue"
import Keyword from "~/components/keywords/Keyword.vue"
import UpdateKeywordGroup from "~/components/keywords/UpdateKeywordGroup.vue"
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

let nlInputRef = ref()

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

    refresh()

    createKeywordForm.resetForm()

    await nextTick()

    nlInputRef?.value?.domRef?.focus()
  },
)
</script>

<template>
  <div v-if="keywordsgroup">
    <div
      class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
    >
      Keyword Group
    </div>
    <div class="mt-3 flex items-center justify-between mb-4 gap-1.5">
      <UpdateKeywordGroup :group="keywordsgroup" />
      <DeleteKeywordGroup :keywordgroup_id="keywordsgroup.id" />
    </div>
    <ul class="flex flex-col">
      <li
        v-for="keyword in keywordsgroup?.keywords"
        :key="keyword.id"
        class="border-b last:border-0 py-1.5"
      >
        <Keyword :keyword="keyword" @delete="refresh" @update="refresh" />
      </li>
    </ul>

    <hr class="my-8" />

    <h2 class="font-medium mb-4">Create keyword</h2>

    <form @submit="onSubmitCreateKeywordgoupForm">
      <FormField v-slot="{ componentField }" name="nl_keyword">
        <FormItem>
          <FormLabel>Keyword NL</FormLabel>
          <FormControl>
            <Input ref="nlInputRef" type="text" v-bind="componentField" />
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

      <Button type="submit" class="mt-5">Create</Button>
    </form>
  </div>
</template>
