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

              <v-autocomplete
                v-model="formData.selectedUsers"
                :items="userOptions"
                item-title="username"
                item-value="email"
                label="Add users to this group (optional)"
                placeholder="Search users"
                variant="outlined"
                multiple
                chips
                closable-chips
                class="mb-4"
                :loading="isLoadingUsers"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-list-item-title>
                        {{ item.raw.username }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.raw.email }}
                      </v-list-item-subtitle>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>

              <div class="mb-4">
                <p class="text-body-2 text-grey-darken-1 mb-2">
                  Roles (optional)
                </p>
                <div class="d-flex flex-column gap-2">
                  <v-checkbox
                    v-model="formData.selectedRoles"
                    value="admin"
                    label="Admin"
                    hide-details
                  />
                  <v-checkbox
                    v-model="formData.selectedRoles"
                    value="keyword_editor"
                    label="Keyword Editor"
                    hide-details
                  />
                  <v-checkbox
                    v-model="formData.selectedRoles"
                    value="application_data_steward"
                    label="Application Data Steward"
                    hide-details
                  />
                </div>
              </div>

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
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { 
    createGroup, 
    addUsersToGroup, 
    addRoleToGroup,
    fetchUsers
  } from '~/requests/groups'

  defineOptions({
    name: 'GroupsCreatePage'
  })

  const router = useRouter()

  // State
  const formData = ref({
    name: '',
    description: '',
    selectedUsers: [],
    selectedRoles: []
  })

  const allUsers = ref([])
  const isLoadingUsers = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)

  // Computed
  const userOptions = computed(() => {
    return allUsers.value.map(user => ({
      username: user.username || user.email,
      email: user.email,
      ...user
    }))
  })

  // Methods
  async function loadUsers() {
    isLoadingUsers.value = true
    try {
      allUsers.value = await fetchUsers() || []
    } catch (err) {
      console.error('Error loading users:', err)
      // Don't show error to user, just log it
    } finally {
      isLoadingUsers.value = false
    }
  }

  async function handleSubmit() {
    if (!formData.value.name) {
      return
    }

    isSubmitting.value = true
    error.value = null

    try {
      // Step 1: Create the group
      const result = await createGroup({
        name: formData.value.name,
        description: formData.value.description || ''
      })

      const groupId = result.id

      // Step 2: Add users if any selected
      if (formData.value.selectedUsers && formData.value.selectedUsers.length > 0) {
        try {
          await addUsersToGroup(groupId, formData.value.selectedUsers)
        } catch (err) {
          console.error('Error adding users:', err)
          // Continue even if adding users fails
        }
      }

      // Step 3: Add roles if any selected
      if (formData.value.selectedRoles && formData.value.selectedRoles.length > 0) {
        // Add roles sequentially
        for (const role of formData.value.selectedRoles) {
          try {
            await addRoleToGroup(groupId, role)
          } catch (err) {
            console.error(`Error adding role ${role}:`, err)
            // Continue with other roles even if one fails
          }
        }
      }
      
      // Navigate to edit page for the newly created group
      await router.push(`/groups/${groupId}/edit`)
      
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Something went wrong'
      console.error('Error creating group:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Load users on mount
  onMounted(async () => {
    await loadUsers()
  })
</script>

