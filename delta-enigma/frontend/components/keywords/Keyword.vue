<script setup lang="ts">
import type { Keyword } from "~/lib/types"
import DeleteKeyword from "./DeleteKeyword.vue"
import UpdateKeyword from "./UpdateKeyword.vue"

let { onDelete } = defineProps<{
  keyword: Keyword
  onDelete?(): void
  onUpdate?(): void
}>()
</script>

<template>
  <div class="flex items-center gap-1.5 group">
    <UpdateKeyword :keyword @update="onUpdate" />
    <DeleteKeyword :keyword="keyword" @delete="onDelete" />
  </div>
</template>
