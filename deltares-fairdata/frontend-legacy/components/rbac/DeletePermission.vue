<script setup lang="ts">
import { useForm } from "vee-validate"
import { toast } from "../ui/toast"
import { Trash2 } from "lucide-vue-next"

let { group_id, object, role_name, onDeleted } = defineProps<{
  group_id: string
  object: string
  role_name: string
  onDeleted: () => void
}>()

let { $api } = useNuxtApp()

let deleteForm = useForm()

let onSubmit = deleteForm.handleSubmit(async (values) => {
  await $api(`/permissions`, {
    method: "delete",
    body: {
      group_id,
      object,
      role_name,
    },
  })

  toast({
    title: "Permission deleted",
  })

  onDeleted()
})
</script>

<template>
  <form @submit="onSubmit">
    <Button variant="destructive" size="icon" type="submit" class="w-8 h-8">
      <Trash2 class="w-4 h-4" />
    </Button>
  </form>
</template>
