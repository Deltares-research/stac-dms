<template>
  <v-form @submit.prevent="handleSubmit">
    <v-btn
      type="submit"
      icon="mdi-close"
      size="small"
      variant="text"
      color="error"
      :loading="isSubmitting"
      class="delete-btn"
    />
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { deleteKeyword } from '~/requests/keywords'

  defineOptions({
    name: 'DeleteKeyword'
  })

  const props = defineProps({
    keyword: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['deleted'])

  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  async function handleSubmit() {
    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await deleteKeyword(props.keyword.id)
      successMessage.value = 'Keyword deleted'
      emit('deleted')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to delete keyword'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped>
  .delete-btn {
    opacity: 0;
    transition: opacity 0.2s;
  }
</style>

