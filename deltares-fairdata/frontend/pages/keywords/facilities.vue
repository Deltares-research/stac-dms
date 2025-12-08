<template>
  <v-row>
    <v-col cols="12" md="6">
      <div class="text-uppercase text-caption text-grey-darken-1 font-weight-bold mb-3">
        Domains
      </div>
      
      <v-list class="bg-grey-lighten-4 pa-2 rounded mb-6" density="compact">
        <v-list-item
          v-for="facility in facilities"
          :key="facility.id"
          :to="`/keywords/facilities/${facility.id}`"
          :active="$route.params.facility_id === facility.id"
          class="mb-1 rounded"
          active-class="bg-white elevation-1"
        >
          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ facility.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-8" />

      <h2 class="text-h6 font-weight-medium mb-4">
        Create domain
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
          v-model="formData.name"
          label="Add domain"
          variant="outlined"
          density="compact"
          :rules="[rules.required, rules.minLength]"
          class="mb-3"
        />
        
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!formData.name || formData.name.length < 2"
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
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchFacilities, createFacility } from '~/requests/keywords'

  defineOptions({
    name: 'KeywordsFacilitiesPage'
  })

  const route = useRoute()
  const facilities = ref([])
  const formRef = ref(null)
  const isSubmitting = ref(false)
  const successMessage = ref('')
  const error = ref(null)
  
  const formData = ref({
    name: ''
  })

  const rules = {
    required: (v) => !!v || 'Name is required',
    minLength: (v) => (v && v.length >= 2) || 'Name must be at least 2 characters'
  }

  async function loadFacilities() {
    try {
      facilities.value = await fetchFacilities() || []
    } catch (err) {
      console.error('Error loading facilities:', err)
      facilities.value = []
    }
  }

  async function handleSubmit() {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    isSubmitting.value = true
    successMessage.value = ''
    error.value = null
    
    try {
      await createFacility({ name: formData.value.name })
      successMessage.value = 'Domain created'
      formData.value.name = ''
      await loadFacilities()
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to create domain'
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(async () => {
    await loadFacilities()
  })

  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (newPath === '/keywords/facilities' && oldPath && oldPath !== '/keywords/facilities') {
        loadFacilities()
      }
    }
  )
</script>

