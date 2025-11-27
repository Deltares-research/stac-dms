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
          Create a new group
        </h1>

        <v-card>
          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="formData.name"
                label="Name"
                placeholder="Name of your group"
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

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <div class="d-flex justify-space-between mt-4">
                <v-btn variant="outlined" to="/groups">
                  Cancel
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="!formData.name"
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { createGroup } from '~/requests/groups'

  defineOptions({
    name: 'GroupsCreatePage'
  })

  const router = useRouter()

  // State
  const formData = ref({
    name: '',
    description: ''
  })

  const isSubmitting = ref(false)
  const error = ref(null)

  // Methods
  async function handleSubmit() {
    if (!formData.value.name) {
      return
    }

    isSubmitting.value = true
    error.value = null

    try {
      const result = await createGroup({
        name: formData.value.name,
        description: formData.value.description || ''
      })
      
      // Wait a bit for backend to process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to edit page for the newly created group
      await router.push(`/groups/${result.id}/edit`)
      
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Something went wrong'
      console.error('Error creating group:', err)
    } finally {
      isSubmitting.value = false
    }
  }
</script>

