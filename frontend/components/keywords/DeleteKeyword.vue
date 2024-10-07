<script setup lang="ts">
import { X } from "lucide-vue-next"
import { useForm } from "vee-validate"
import type { Keyword } from "~/lib/types"
import { toast } from "../ui/toast"

let { keyword, onDelete } = defineProps<{
  keyword: Keyword
  onDelete?(): void
}>()

let { $api } = useNuxtApp()

let deleteForm = useForm()

let onSubmit = deleteForm.handleSubmit(async () => {
  await $api("/keyword/{keyword_id}", {
    method: "delete",
    path: {
      keyword_id: keyword.id,
    },
  })

  toast({
    title: "Keyword deleted",
  })

  onDelete?.()
})
</script>

<template>
  <form @submit="onSubmit" class="opacity-0 group-hover:opacity-100">
    <Button variant="destructive" size="icon" type="submit" class="w-8 h-8">
      <X class="w-4 h-4" />
    </Button>
  </form>
</template>
