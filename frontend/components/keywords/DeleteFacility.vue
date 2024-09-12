<script setup lang="ts">
import { useForm } from "vee-validate"
import { toast } from "../ui/toast"
import { Trash2 } from "lucide-vue-next"

let { facility_id } = defineProps<{
  facility_id: string
}>()

let { $api } = useNuxtApp()

let deleteFacilityForm = useForm()

let deleteFacility = deleteFacilityForm.handleSubmit(async () => {
  await $api(`/facility/{facility_id}`, {
    method: "delete",
    path: {
      facility_id,
    },
  })

  toast({
    title: "Facility deleted",
  })

  await navigateTo("/keywords/facilities")
})
</script>

<template>
  <form @submit="deleteFacility">
    <Button variant="destructive" size="sm" type="submit">
      <Trash2 class="w-4 h-4" />
    </Button>
  </form>
</template>
