<template>
  <v-form @submit.prevent="handleSubmit">
    <v-btn
      type="submit"
      icon="mdi-delete"
      size="small"
      variant="text"
      color="error"
      :loading="isSubmitting"
    />
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { deleteFacility } from '~/requests/keywords'

  defineOptions({
    name: 'DeleteFacility'
  })

  const props = defineProps({
    facilityId: {
      type: String,
      required: true
    }
  })

  const router = useRouter()
  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  async function handleSubmit() {
    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await deleteFacility(props.facilityId)
      successMessage.value = 'Domain deleted'
      await router.push('/keywords/facilities')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to delete domain'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

