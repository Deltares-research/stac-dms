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
          {{ collection?.title || 'Edit domain' }}
        </h1>

        <!-- Loading state -->
        <v-card v-if="isLoading" class="mb-4">
          <v-card-text class="d-flex flex-column align-center justify-center py-12">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            />
            <p class="text-body-2 text-grey-darken-1">
              Loading domain...
            </p>
          </v-card-text>
        </v-card>

        <!-- Error state -->
        <v-card v-else-if="error" class="mb-4">
          <v-card-text class="d-flex flex-column align-center justify-center py-12 text-center">
            <v-icon
              size="64"
              color="error"
              class="mb-4"
            >
              mdi-alert-circle
            </v-icon>
            <h3 class="text-h6 mb-2">
              Error loading domain
            </h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              {{ error }}
            </p>
            <v-btn variant="outlined" to="/domains">
              Return to domains
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Edit form -->
        <v-card v-else-if="collection">
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
                v-if="submitError"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ submitError }}
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
                  Update
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
  import { useRoute, useRouter } from 'vue-router'
  import { fetchCollectionById, updateCollection, fetchFacilities } from '~/requests/collections'

  defineOptions({
    name: 'DomainsEditPage'
  })

  const route = useRoute()
  const router = useRouter()
  const domainId = route.params.id

  // State
  const collection = ref(null)
  const formData = ref({
    title: '',
    description: '',
    keywordsFacility: 'No keywords'
  })
  const facilities = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  const isSubmitting = ref(false)
  const submitError = ref(null)

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
    submitError.value = null

    try {
      const collectionData = {
        type: 'Collection',
        stac_version: '1.0.0',
        stac_extensions: [],
        id: domainId,
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

      await updateCollection(domainId, collectionData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Navigate to domains page after successful update
      await router.push('/domains')
    } catch (err) {
      submitError.value = err?.data?.detail || err?.message || 'Something went wrong'
      console.error('Error updating domain:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Fetch domain on mount
  onMounted(async () => {
    isLoading.value = true
    error.value = null

    try {
      const [collectionData, facilitiesData] = await Promise.all([
        fetchCollectionById(domainId),
        fetchFacilities()
      ])

      collection.value = collectionData
      facilities.value = facilitiesData || []

      // Populate form data
      formData.value = {
        title: collectionData.title || collectionData.id || '',
        description: collectionData.description || '',
        keywordsFacility: collectionData.links?.find(item => item.rel === 'keywords')?.id || 'No keywords'
      }
    } catch (err) {
      error.value = err?.message || 'Failed to load domain'
      console.error('Error loading domain:', err)
    } finally {
      isLoading.value = false
    }
  })
</script>

