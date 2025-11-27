<template>
  <div>
    <v-alert
      v-if="successMessage"
      type="success"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>
    
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>
    
    <v-form class="d-flex align-end gap-2" @submit.prevent="handleSubmit">
      <v-select
        v-model="formData.keyword_group_id"
        :items="keywordGroupOptions"
        label="Link keyword group"
        placeholder="Select a keyword group"
        variant="outlined"
        density="compact"
        class="flex-grow-1"
        :rules="[rules.required]"
      />
      <v-btn
        type="submit"
        color="primary"
        :loading="isSubmitting"
        :disabled="!formData.keyword_group_id"
      >
        Link
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { fetchKeywordGroups, linkKeywordGroupToFacility } from '~/requests/keywords'

  defineOptions({
    name: 'LinkKeywordGroup'
  })

  const props = defineProps({
    facilityId: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['linked'])

  const allKeywordGroups = ref([])
  const isSubmitting = ref(false)
  const successMessage = ref('')
  const error = ref(null)
  
  const formData = ref({
    keyword_group_id: null
  })

  const rules = {
    required: (v) => !!v || 'Please select a keyword group'
  }

  const keywordGroupOptions = computed(() => {
    return allKeywordGroups.value.map(group => ({
      title: group.group_name_nl,
      value: group.id
    }))
  })

  async function loadKeywordGroups() {
    try {
      allKeywordGroups.value = await fetchKeywordGroups() || []
    } catch (err) {
      console.error('Error loading keyword groups:', err)
      allKeywordGroups.value = []
    }
  }

  async function handleSubmit() {
    if (!formData.value.keyword_group_id) return

    isSubmitting.value = true
    successMessage.value = ''
    error.value = null
    
    try {
      await linkKeywordGroupToFacility({
        facility_id: props.facilityId,
        keyword_group_id: formData.value.keyword_group_id
      })
      successMessage.value = 'Keyword group linked'
      formData.value.keyword_group_id = null
      emit('linked')
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to link keyword group'
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(async () => {
    await loadKeywordGroups()
  })
</script>

