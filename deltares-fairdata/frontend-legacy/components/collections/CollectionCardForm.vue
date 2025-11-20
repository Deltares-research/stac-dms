<template>
  <div class="grid items-center w-full gap-4">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input placeholder="Name of your domain" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="keywordsFacility">
      <FormItem>
        <FormLabel>Keyword domains</FormLabel>
        <FormControl>
          <CustomDropDownComponent
            :options="keywordsFacilities"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { collectionTypes } from "@/lib/collectionTypes"

let { data: keywords } = await useApi("/facilities")
let keywordsFacilities =
  keywords.value
    ?.filter((item) => !!item.id)
    .map((item) => {
      return { value: item.id!, label: item.name }
    }) ?? []
keywordsFacilities.unshift({ value: "No keywords", label: "No keywords" })
</script>
