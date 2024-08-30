<template>
  <div class="flex items-center space-x-2">
    <Checkbox
      :id="props.id"
      :checked="checkedFromProps"
      @update:checked="handleChange"
    />
    <label
      :for="props.id"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {{ props.name }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue"

const emit = defineEmits(["update"])

const props = defineProps({
  id: String,
  name: String,
  checked: Boolean,
})

function handleChange(e) {
  checkedFromProps.value = e
  emit("update", { checked: e, id: props.id })
}

const checkedFromProps = toRef(props.checked)
</script>

<style scoped></style>
