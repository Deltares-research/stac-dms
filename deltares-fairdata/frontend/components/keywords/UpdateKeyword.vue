<template>
  <v-form class="flex-grow-1" @submit.prevent="handleSubmit">
    <div class="d-flex align-center gap-2">
      <v-text-field
        v-model="formData.nl_keyword"
        variant="plain"
        density="compact"
        hide-details
        class="flex-grow-1"
        style="min-width: 0;"
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
  import { updateKeyword } from '~/requests/keywords'

  defineOptions({
    name: 'UpdateKeyword'
  })

  const props = defineProps({
    keyword: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['updated'])

  const formData = ref({
    nl_keyword: props.keyword.nl_keyword || ''
  })

  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  const isDirty = computed(() => {
    return formData.value.nl_keyword !== props.keyword.nl_keyword
  })

  watch(
    () => props.keyword,
    (newKeyword) => {
      formData.value.nl_keyword = newKeyword.nl_keyword || ''
    },
    { immediate: true }
  )

  async function handleSubmit() {
    if (!isDirty.value) return

    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await updateKeyword(props.keyword.id, {
        nl_keyword: formData.value.nl_keyword
      })
      successMessage.value = 'Keyword updated'
      emit('updated')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to update keyword'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

