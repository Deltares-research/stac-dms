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
  import { deleteKeywordGroup } from '~/requests/keywords'

  defineOptions({
    name: 'DeleteKeywordGroup'
  })

  const props = defineProps({
    groupId: {
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
      await deleteKeywordGroup(props.groupId)
      successMessage.value = 'Keyword group deleted'
      await router.push('/keywords/groups')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to delete keyword group'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

