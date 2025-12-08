<template>
  <v-form @submit.prevent="handleSubmit">
    <div class="d-flex align-center justify-space-between bg-grey-lighten-4 rounded pa-3">
      <span class="text-body-2">{{ group.group_name_nl }}</span>
      <v-btn
        type="submit"
        icon="mdi-close"
        size="small"
        variant="text"
        color="error"
        :loading="isSubmitting"
      />
    </div>
  </v-form>
</template>

<script setup>
  import { ref } from 'vue'
  import { unlinkKeywordGroupFromFacility } from '~/requests/keywords'

  defineOptions({
    name: 'FacilityGroupLink'
  })

  const props = defineProps({
    group: {
      type: Object,
      required: true
    },
    facilityId: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['unlinked'])

  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  async function handleSubmit() {
    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await unlinkKeywordGroupFromFacility({
        facility_id: props.facilityId,
        keyword_group_id: props.group.id
      })
      successMessage.value = 'Keyword group unlinked'
      emit('unlinked')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to unlink keyword group'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

