<script setup lang="ts">
import { useForm } from "vee-validate"
import { toast } from "../ui/toast"
import { X } from "lucide-vue-next"

let { facility_id, onUnlink, group } = defineProps<{
  facility_id: string
  onUnlink(): void
  group: { id: string; group_name_nl: string }
}>()

let { $api } = useNuxtApp()

let unlinkForm = useForm()

let onSubmitUnLinkGroupForm = unlinkForm.handleSubmit(async (values) => {
  await $api("/facility_keywordgroup_link", {
    method: "delete",
    body: {
      keyword_group_id: group.id,
      facility_id,
    },
  })

  toast({
    title: "Keyword group unlinked",
  })

  onUnlink()
})
</script>

<template>
  <form
    @submit="onSubmitUnLinkGroupForm"
    class="rounded bg-gray-100 flex items-center justify-between gap-3 px-4 py-0.5"
  >
    {{ group.group_name_nl }}
    <Button variant="link" size="sm" type="submit" class="hover:text-red-500">
      <X class="w-4 h-4" />
    </Button>
  </form>
</template>
