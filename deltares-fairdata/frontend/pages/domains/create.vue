<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
      >
        <h1 class="text-h4 font-weight-bold mb-4">
          Create a new domain
        </h1>

        <v-card>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="formData.title"
                label="Name"
                placeholder="Name of your domain"
                variant="outlined"
                required
                class="mb-4"
              />

              <v-textarea
                v-model="formData.description"
                label="Description"
                variant="outlined"
                rows="3"
                class="mb-4"
              />

              <v-select
                v-model="formData.keywordsFacility"
                :items="facilityOptions"
                label="Keyword domains"
                variant="outlined"
                class="mb-4"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <div class="d-flex justify-space-between mt-4">
                <v-btn variant="outlined" to="/domains">
                  Cancel
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="!formData.title"
                >
                  Create
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { createCollection, fetchFacilities } from '~/requests/collections'

  defineOptions({
    name: 'DomainsCreatePage'
  })

  const router = useRouter()

  // State
  const formData = ref({
    title: '',
    description: '',
    keywordsFacility: 'No keywords'
  })

  const facilities = ref([])
  const isSubmitting = ref(false)
  const error = ref(null)

  // Computed
  const facilityOptions = computed(() => {
    const options = facilities.value
      .filter(item => !!item.id)
      .map(item => ({
        value: item.id,
        title: item.name
      }))
    return [{ value: 'No keywords', title: 'No keywords' }, ...options]
  })

  // Methods
  async function handleSubmit() {
    if (!formData.value.title) {
      return
    }

    isSubmitting.value = true
    error.value = null

    try {
      const collectionData = {
        type: 'Collection',
        stac_version: '1.0.0',
        stac_extensions: [],
        id: formData.value.title,
        title: formData.value.title,
        description: formData.value.description || '',
        keywords: [],
        license: 'proprietary',
        extent: {
          spatial: {
            bbox: [[-180, -56, 180, 83]],
          },
          temporal: {
            interval: [[]],
          },
        },
        links: formData.value.keywordsFacility !== 'No keywords'
          ? [
            {
              rel: 'keywords',
              href: '/facilities/' + formData.value.keywordsFacility,
              type: 'application/json',
              id: formData.value.keywordsFacility,
            },
          ]
          : [],
      }

      await createCollection(collectionData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await router.push('/domains')
      
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Something went wrong'
      console.error('Error creating domain:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Initialize
  onMounted(async () => {
    try {
      facilities.value = await fetchFacilities()
    } catch (err) {
      console.error('Failed to fetch facilities:', err)
      facilities.value = []
    }
  })
</script>

