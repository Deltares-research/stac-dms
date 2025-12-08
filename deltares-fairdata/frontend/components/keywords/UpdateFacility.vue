<template>
  <v-form class="flex-grow-1" @submit.prevent="handleSubmit">
    <div class="d-flex align-center gap-2">
      <v-text-field
        v-model="formData.name"
        variant="plain"
        density="compact"
        hide-details
        class="flex-grow-1"
        style="min-width: 0; font-size: 1.5rem; font-weight: bold;"
      />
      <v-btn
        v-if="isDirty"
        type="submit"
        icon="mdi-check"
        size="small"
        variant="text"
        color="success"
        :loading="isSubmitting"
        class="flex-shrink-0"
      />
    </div>
  </v-form>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import { updateFacility } from '~/requests/keywords'

  defineOptions({
    name: 'UpdateFacility'
  })

  const props = defineProps({
    facility: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['updated'])

  const formData = ref({
    name: props.facility.name || ''
  })

  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  const isDirty = computed(() => {
    return formData.value.name !== props.facility.name
  })

  watch(
    () => props.facility,
    (newFacility) => {
      formData.value.name = newFacility.name || ''
    },
    { immediate: true }
  )

  async function handleSubmit() {
    if (!isDirty.value) return

    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await updateFacility(props.facility.id, formData.value)
      successMessage.value = 'Domain updated'
      emit('updated')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to update domain'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

