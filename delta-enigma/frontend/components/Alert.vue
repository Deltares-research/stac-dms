<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next"

interface Props {
  message?: string
}

defineProps<Props>()
</script>

<template>
  <p
    v-if="message"
    class="text-red-500 border-red-200 border bg-red-50 rounded px-3 py-3 flex gap-3 text-sm mb-3"
  >
    <AlertTriangle class="size-4 flex-shrink-0 mt-0.5" />
    {{ message }}
  </p>
</template>
