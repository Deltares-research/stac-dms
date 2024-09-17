<script setup lang="ts">
import { useForm } from "vee-validate"
import { toast } from "../ui/toast"
import { Trash2 } from "lucide-vue-next"

let { keywordgroup_id } = defineProps<{
  keywordgroup_id: string
}>()

let { $api } = useNuxtApp()

let deleteForm = useForm()

let onSubmit = deleteForm.handleSubmit(async () => {
  await $api(`/keywordgroup/{keywordgroup_id}`, {
    method: "delete",
    path: {
      keywordgroup_id,
    },
  })

  toast({
    title: "Keywordgroup deleted",
  })

  await navigateTo("/keywords/groups")
})
</script>

<template>
  <form @submit="onSubmit">
    <Button variant="outline" size="icon" type="submit" class="w-8 h-8">
      <Trash2 class="w-4 h-4" />
    </Button>
  </form>
</template>
