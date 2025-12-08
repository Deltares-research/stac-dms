<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
      >
        <!-- Loading state -->
        <div v-if="isLoading" class="d-flex flex-column align-center justify-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          />
          <p class="text-body-2 text-grey-darken-1">
            Loading group...
          </p>
        </div>

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
              Error loading group
            </h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              {{ error }}
            </p>
            <v-btn variant="outlined" to="/groups">
              Return to groups
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Edit form -->
        <div v-else-if="group">
          <h3 class="text-h4 font-weight-bold mb-2">
            {{ group.name }}
          </h3>
          <p class="text-body-2 text-grey-darken-1 mb-6">
            Manage users and roles in
            <code class="text-black">{{ group.name }}</code>
          </p>

          <v-tabs v-model="activeTab" class="mb-4">
            <v-tab value="members">
              Members
            </v-tab>
            <v-tab value="roles">
              Roles
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Members Tab -->
            <v-window-item value="members">
              <v-card>
                <v-card-text>
                  <v-form
                    class="mb-6"
                    @submit.prevent="handleAddUsers"
                  >
                    <v-autocomplete
                      v-model="selectedUserEmails"
                      :items="userOptions"
                      item-title="username"
                      item-value="email"
                      label="Add users to this group"
                      placeholder="Search users"
                      variant="outlined"
                      multiple
                      chips
                      closable-chips
                      class="mb-4"
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

                    <v-btn
                      type="submit"
                      color="primary"
                      :loading="isAddingUsers"
                      :disabled="!selectedUserEmails || selectedUserEmails.length === 0"
                    >
                      Add
                    </v-btn>
                  </v-form>

                  <v-alert
                    v-if="addUsersError"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                  >
                    {{ addUsersError }}
                  </v-alert>

                  <v-alert
                    v-if="addUsersSuccess"
                    type="success"
                    variant="tonal"
                    class="mb-4"
                  >
                    {{ addUsersSuccess }}
                  </v-alert>

                  <div v-if="users && users.length > 0">
                    <v-data-table
                      :headers="userTableHeaders"
                      :items="users"
                      class="elevation-0"
                    >
                      <template #[`item.remove`]="{ item }">
                        <v-btn
                          variant="text"
                          size="small"
                          prepend-icon="mdi-delete"
                          color="error"
                          :loading="removingUser === item.email"
                          @click="handleRemoveUser(item)"
                        >
                          Remove
                        </v-btn>
                      </template>
                    </v-data-table>
                  </div>
                  <v-alert
                    v-else
                    type="info"
                    variant="tonal"
                  >
                    No users in this group
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Roles Tab -->
            <v-window-item value="roles">
              <v-card>
                <v-card-text>
                  <div class="d-flex flex-column gap-3">
                    <v-checkbox
                      v-model="roleCheckboxes.admin"
                      :disabled="pendingRoleChanges.includes('admin')"
                      label="Admin"
                      @update:model-value="(v) => toggleRole('admin', v)"
                    />

                    <v-checkbox
                      v-model="roleCheckboxes.keyword_editor"
                      :disabled="pendingRoleChanges.includes('keyword_editor')"
                      label="Keyword Editor"
                      @update:model-value="(v) => toggleRole('keyword_editor', v)"
                    />

                    <v-checkbox
                      v-model="roleCheckboxes.application_data_steward"
                      :disabled="pendingRoleChanges.includes('application_data_steward')"
                      label="Application Data Steward"
                      @update:model-value="(v) => toggleRole('application_data_steward', v)"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { 
    fetchGroupById, 
    addUsersToGroup, 
    removeUserFromGroup,
    addRoleToGroup,
    removeRoleFromGroup,
    fetchUsers
  } from '~/requests/groups'

  defineOptions({
    name: 'GroupsEditPage'
  })

  const route = useRoute()
  const groupId = route.params.id

  // State
  const group = ref(null)
  const users = ref([])
  const allUsers = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  const activeTab = ref('members')
  const selectedUserEmails = ref([])
  const isAddingUsers = ref(false)
  const addUsersError = ref(null)
  const addUsersSuccess = ref(null)
  const removingUser = ref(null)
  const pendingRoleChanges = ref([])

  // Roles
  const roleCheckboxes = ref({
    admin: false,
    keyword_editor: false,
    application_data_steward: false
  })

  // Computed
  const userOptions = computed(() => {
    return allUsers.value.map(user => ({
      username: user.username || user.email,
      email: user.email,
      ...user
    }))
  })

  const roles = computed(() => {
    return group.value?.roles?.map(r => r.role) ?? []
  })

  function hasRole(role) {
    return roles.value?.includes(role)
  }

  // Table headers
  const userTableHeaders = [
    { title: 'Name', key: 'username', sortable: true },
    { title: 'Email', key: 'email', sortable: true },
    { title: '', key: 'remove', sortable: false }
  ]

  // Methods
  async function handleAddUsers() {
    if (!selectedUserEmails.value || selectedUserEmails.value.length === 0) {
      return
    }

    isAddingUsers.value = true
    addUsersError.value = null
    addUsersSuccess.value = null

    try {
      await addUsersToGroup(groupId, selectedUserEmails.value)
      addUsersSuccess.value = `${selectedUserEmails.value.length} user(s) added to group`
      selectedUserEmails.value = []
      await loadGroup()
    } catch (err) {
      addUsersError.value = err?.data?.detail || err?.message || 'Failed to add users'
      console.error('Error adding users:', err)
    } finally {
      isAddingUsers.value = false
    }
  }

  async function handleRemoveUser(user) {
    if (!user.email) return

    removingUser.value = user.email

    try {
      await removeUserFromGroup(groupId, user.email)
      await loadGroup()
    } catch (err) {
      console.error('Error removing user:', err)
      alert(err?.data?.detail || err?.message || 'Failed to remove user')
    } finally {
      removingUser.value = null
    }
  }

  async function toggleRole(role, checked) {
    pendingRoleChanges.value.push(role)

    try {
      if (checked) {
        await addRoleToGroup(groupId, role)
      } else {
        await removeRoleFromGroup(groupId, role)
      }
      await loadGroup()
    } catch (err) {
      console.error('Error toggling role:', err)
      alert(err?.data?.detail || err?.message || 'Failed to update role')
      // Revert checkbox state on error
      roleCheckboxes.value[role] = !checked
    } finally {
      pendingRoleChanges.value = pendingRoleChanges.value.filter(r => r !== role)
    }
  }

  async function loadGroup() {
    try {
      const groupData = await fetchGroupById(groupId)
      group.value = groupData
      users.value = groupData?.users ?? []

      // Update role checkboxes
      roleCheckboxes.value = {
        admin: hasRole('admin'),
        keyword_editor: hasRole('keyword_editor'),
        application_data_steward: hasRole('application_data_steward')
      }
    } catch (err) {
      error.value = err?.message || 'Failed to load group'
      console.error('Error loading group:', err)
    }
  }

  // Load data on mount
  onMounted(async () => {
    isLoading.value = true
    error.value = null

    try {
      // Load group and users in parallel
      const [groupData, usersData] = await Promise.all([
        fetchGroupById(groupId),
        fetchUsers()
      ])

      group.value = groupData
      users.value = groupData?.users ?? []
      allUsers.value = usersData || []

      // Update role checkboxes
      roleCheckboxes.value = {
        admin: hasRole('admin'),
        keyword_editor: hasRole('keyword_editor'),
        application_data_steward: hasRole('application_data_steward')
      }
    } catch (err) {
      error.value = err?.message || 'Failed to load group'
      console.error('Error loading group:', err)
    } finally {
      isLoading.value = false
    }
  })
</script>
