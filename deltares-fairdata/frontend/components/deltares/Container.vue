<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div :class="cn('max-w-screen-lg w-full mx-auto px-8', props.class)">
    <slot />
  </div>
</template>
