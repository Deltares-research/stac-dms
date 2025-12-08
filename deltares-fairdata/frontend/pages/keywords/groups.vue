<template>
  <v-row>
    <v-col cols="12" md="6">
      <div class="text-uppercase text-caption text-grey-darken-1 font-weight-bold mb-3">
        Keyword Groups
      </div>
      
      <v-list class="bg-grey-lighten-4 pa-2 rounded mb-6" density="compact">
        <v-list-item
          v-for="keywordgroup in keywordGroups"
          :key="keywordgroup.id"
          :to="`/keywords/groups/${keywordgroup.id}`"
          :active="$route.params.group_id === keywordgroup.id"
          class="mb-1 rounded"
          active-class="bg-white elevation-1"
        >
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ keywordgroup.group_name_nl }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-8" />

      <h2 class="text-h6 font-weight-medium mb-4">
        Create keyword group
      </h2>
      
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
      
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="formData.group_name_nl"
          label="Group name NL"
          variant="outlined"
          density="compact"
          :rules="[rules.required, rules.minLength]"
          class="mb-3"
        />
        
        <v-text-field
          v-model="formData.group_name_en"
          label="Group name EN"
          variant="outlined"
          density="compact"
          :rules="[rules.required, rules.minLength]"
          class="mb-3"
        />
        
        <v-select
          v-model="formData.facility_type"
          :items="facilityTypeOptions"
          label="Facility Type"
          variant="outlined"
          density="compact"
          :rules="[rules.required]"
          class="mb-3"
        />
        
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!isFormValid"
        >
          Create
        </v-btn>
      </v-form>
    </v-col>
    
    <v-col cols="12" md="6">
      <NuxtPage />
    </v-col>
  </v-row>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchKeywordGroups, createKeywordGroup } from '~/requests/keywords'

  defineOptions({
    name: 'KeywordsGroupsPage'
  })

  const route = useRoute()
  const keywordGroups = ref([])
  const formRef = ref(null)
  const isSubmitting = ref(false)
  const successMessage = ref('')
  const error = ref(null)
  
  const formData = ref({
    group_name_nl: '',
    group_name_en: '',
    facility_type: ''
  })

  const facilityTypeOptions = [
    { title: 'General', value: 'general' },
    { title: 'Experimental Facility', value: 'experimentalFacility' },
    { title: 'Numerical Model', value: 'numericalModel' },
    { title: 'Field', value: 'field' }
  ]

  const rules = {
    required: (v) => !!v || 'This field is required',
    minLength: (v) => (v && v.length >= 2) || 'Must be at least 2 characters'
  }

  const isFormValid = computed(() => {
    return formData.value.group_name_nl.length >= 2 &&
      formData.value.group_name_en.length >= 2 &&
      !!formData.value.facility_type
  })

  async function loadKeywordGroups() {
    try {
      keywordGroups.value = await fetchKeywordGroups() || []
    } catch (err) {
      console.error('Error loading keyword groups:', err)
      keywordGroups.value = []
    }
  }

  async function handleSubmit() {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    isSubmitting.value = true
    successMessage.value = ''
    error.value = null
    
    try {
      await createKeywordGroup(formData.value)
      successMessage.value = 'Keyword group created'
      formData.value = {
        group_name_nl: '',
        group_name_en: '',
        facility_type: ''
      }
      await loadKeywordGroups()
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to create keyword group'
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(async () => {
    await loadKeywordGroups()
  })

  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (newPath === '/keywords/groups' && oldPath && oldPath !== '/keywords/groups') {
        loadKeywordGroups()
      }
    }
  )
</script>

