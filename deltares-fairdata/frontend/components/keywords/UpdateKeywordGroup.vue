<template>
  <v-form class="flex-grow-1" @submit.prevent="handleSubmit">
    <div class="d-flex align-center gap-2 flex-wrap">
      <v-text-field
        v-model="formData.group_name_nl"
        variant="plain"
        density="compact"
        hide-details
        class="flex-grow-1"
        style="min-width: 200px; font-size: 1.5rem; font-weight: bold;"
      />
      <v-select
        v-model="formData.facility_type"
        :items="facilityTypeOptions"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 200px;"
        class="flex-shrink-0"
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
  import { updateKeywordGroup } from '~/requests/keywords'

  defineOptions({
    name: 'UpdateKeywordGroup'
  })

  const props = defineProps({
    group: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['updated'])

  const facilityTypeOptions = [
    { title: 'General', value: 'general' },
    { title: 'Experimental Facility', value: 'experimentalFacility' },
    { title: 'Numerical Model', value: 'numericalModel' },
    { title: 'Field', value: 'field' }
  ]

  const formData = ref({
    group_name_nl: props.group.group_name_nl || '',
    facility_type: props.group.facility_type || ''
  })

  const isSubmitting = ref(false)
  const error = ref(null)
  const successMessage = ref('')

  const isDirty = computed(() => {
    return formData.value.group_name_nl !== props.group.group_name_nl ||
      formData.value.facility_type !== props.group.facility_type
  })

  watch(
    () => props.group,
    (newGroup) => {
      formData.value.group_name_nl = newGroup.group_name_nl || ''
      formData.value.facility_type = newGroup.facility_type || ''
    },
    { immediate: true }
  )

  async function handleSubmit() {
    if (!isDirty.value) return

    isSubmitting.value = true
    error.value = null
    successMessage.value = ''
    
    try {
      await updateKeywordGroup(props.group.id, formData.value)
      successMessage.value = 'Keyword group updated'
      emit('updated')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to update keyword group'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

