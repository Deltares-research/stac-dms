<script setup lang="ts">
import SimpleCombobox from "../SimpleCombobox.vue"

let { name, modelValue } = defineProps<{
  name: string
  modelValue?: string[]
}>()

let emit = defineEmits<{
  (event: "update:modelValue", value: string[]): void
}>()

let { data: users } = await useApi("/users")
</script>

<template>
  <SimpleCombobox
    :name="name"
    :items="users ?? []"
    title-property="username"
    subtitle-property="email"
    value-property="username"
    placeholder="Search users"
    trigger="Add user"
    command-empty="No users found"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
