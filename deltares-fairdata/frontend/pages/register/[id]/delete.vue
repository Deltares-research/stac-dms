<template>
  <v-container class="pa-6" fluid>
    <v-row>
      <v-col cols="12">
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
              Loading item...
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
              Error loading item
            </h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              {{ error }}
            </p>
            <v-btn variant="outlined" to="/register">
              Return to register
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Delete confirmation -->
        <v-card v-else-if="item" class="mb-4">
          <v-card-title class="text-h6">
            Are you sure you want to delete this registration?
          </v-card-title>
          <v-card-text>
            <v-row class="mt-2">
              <v-col cols="12">
                <div class="mb-4">
                  <div class="text-subtitle-2 font-weight-medium mb-1">
                    Title
                  </div>
                  <div class="text-body-1">
                    {{ item.properties?.title || '—' }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mb-4">
                  <div class="text-subtitle-2 font-weight-medium mb-1">
                    Description
                  </div>
                  <div class="text-body-1" style="white-space: pre-line;">
                    {{ item.properties?.description || '—' }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="mb-4">
                  <div class="text-subtitle-2 font-weight-medium mb-1">
                    Date
                  </div>
                  <div class="text-body-1">
                    {{ formatDate(item.properties?.datetime) || '—' }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-alert
              v-if="deleteError"
              type="error"
              variant="tonal"
              class="mt-4"
            >
              {{ deleteError }}
            </v-alert>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between px-6 pb-6">
            <v-btn
              variant="outlined"
              :disabled="isDeleting"
              to="/register"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              variant="flat"
              :loading="isDeleting"
              :disabled="isDeleting"
              prepend-icon="mdi-delete"
              @click="handleDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import dateFormat from 'dateformat'
  import { fetchItemById, deleteItem } from '~/requests/items'

  defineOptions({
    name: 'RegisterDeletePage'
  })

  const route = useRoute()
  const router = useRouter()
  const itemId = route.params.id

  const item = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  const isDeleting = ref(false)
  const deleteError = ref(null)

  // Methods
  function formatDate(date) {
    if (!date) return '—'
    try {
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return date
      return dateFormat(dateObj, 'dd-mm-yyyy HH:MM:ss')
    } catch {
      return date
    }
  }

  async function handleDelete() {
    if (!item.value || !item.value.collection) {
      deleteError.value = 'Item information is missing'
      return
    }

    isDeleting.value = true
    deleteError.value = null

    try {
      await deleteItem(item.value.collection, item.value.id)
      
      // Wait a bit for OpenSearch index to update (like legacy frontend does)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to register page after successful deletion
      await router.push('/register')
    } catch (err) {
      deleteError.value = err.message || 'It was not possible to delete the item'
      console.error('Error deleting item:', err)
    } finally {
      isDeleting.value = false
    }
  }

  // Fetch item on mount
  onMounted(async () => {
    isLoading.value = true
    error.value = null
    try {
      item.value = await fetchItemById(itemId)
    } catch (err) {
      error.value = err.message || 'Failed to load item'
      console.error('Error loading item:', err)
    } finally {
      isLoading.value = false
    }
  })
</script>

