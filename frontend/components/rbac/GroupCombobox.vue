<script setup lang="ts">
import SimpleCombobox from "../SimpleCombobox.vue"

let { name, modelValue } = defineProps<{
  name: string
  modelValue?: string[]
}>()

let emit = defineEmits<{
  (event: "update:modelValue", value: string[]): void
}>()

let { data: groups } = await useApi("/groups")
</script>

<template>
  <SimpleCombobox
    :name="name"
    :items="groups ?? []"
    title-property="name"
    subtitle-property="description"
    trigger="Add group"
    command-empty="No groups found"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
