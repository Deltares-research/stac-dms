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

              <v-autocomplete
                v-model="formData.selectedGroups"
                :items="groupOptions"
                item-title="name"
                item-value="id"
                label="Add groups to this domain (optional)"
                placeholder="Search groups"
                variant="outlined"
                multiple
                chips
                closable-chips
                class="mb-4"
                :loading="isLoadingGroups"
              />

              <!-- Permissions section for selected groups -->
              <div v-if="formData.selectedGroups && formData.selectedGroups.length > 0" class="mb-4">
                <p class="text-body-2 text-grey-darken-1 mb-3">
                  Permissions (optional)
                </p>
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Group
                      </th>
                      <th class="text-center">
                        Data Producer
                      </th>
                      <th class="text-center">
                        Domain Data Steward
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="groupId in formData.selectedGroups" :key="groupId">
                      <td>{{ getGroupName(groupId) }}</td>
                      <td class="text-center">
                        <div class="d-flex justify-center align-center">
                          <v-checkbox
                            :model-value="hasRole(groupId, 'data_producer')"
                            hide-details
                            density="compact"
                            @update:model-value="(v) => toggleRole(groupId, 'data_producer', v)"
                          />
                        </div>
                      </td>
                      <td class="text-center">
                        <div class="d-flex justify-center align-center">
                          <v-checkbox
                            :model-value="hasRole(groupId, 'collection_data_steward')"
                            hide-details
                            density="compact"
                            @update:model-value="(v) => toggleRole(groupId, 'collection_data_steward', v)"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
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
  import { useNuxtApp } from '#app'
  import { createCollection, fetchFacilities } from '~/requests/collections'
  import { fetchGroups } from '~/requests/groups'

  defineOptions({
    name: 'DomainsCreatePage'
  })

  const router = useRouter()
  const { $api } = useNuxtApp()

  // State
  const formData = ref({
    title: '',
    description: '',
    keywordsFacility: 'No keywords',
    selectedGroups: [],
    groupRoles: {} // { groupId: ['role1', 'role2'] }
  })

  const facilities = ref([])
  const groups = ref([])
  const isLoadingGroups = ref(false)
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

  const groupOptions = computed(() => {
    return groups.value.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      ...group
    }))
  })

  // Methods
  function getGroupName(groupId) {
    const group = groups.value.find(g => g.id === groupId)
    return group?.name || groupId
  }

  function hasRole(groupId, role) {
    if (!groupId) return false
    const roles = formData.value.groupRoles[groupId] || []
    return roles.includes(role)
  }

  function toggleRole(groupId, role, checked) {
    if (!formData.value.groupRoles[groupId]) {
      formData.value.groupRoles[groupId] = []
    }
    
    if (checked) {
      if (!formData.value.groupRoles[groupId].includes(role)) {
        formData.value.groupRoles[groupId].push(role)
      }
    } else {
      formData.value.groupRoles[groupId] = formData.value.groupRoles[groupId].filter(r => r !== role)
    }
  }

  async function loadGroups() {
    isLoadingGroups.value = true
    try {
      groups.value = await fetchGroups() || []
    } catch (err) {
      console.error('Error loading groups:', err)
      groups.value = []
    } finally {
      isLoadingGroups.value = false
    }
  }

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

      const result = await createCollection(collectionData)
      const collectionId = result.id || formData.value.title

      // Assign roles to groups if any selected
      if (formData.value.selectedGroups && formData.value.selectedGroups.length > 0) {
        for (const groupId of formData.value.selectedGroups) {
          const roles = formData.value.groupRoles[groupId] || []
          if (roles && roles.length > 0) {
            // Add roles sequentially for this group
            for (const role of roles) {
              try {
                await $api('/group-role/{collection_id}', {
                  method: 'POST',
                  path: { collection_id: collectionId },
                  body: { group_id: groupId, role },
                  credentials: 'include',
                })
              } catch (err) {
                console.error(`Error adding role ${role} to group ${groupId}:`, err)
                // Continue with other roles even if one fails
              }
            }
          }
        }
      }

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
      const [facilitiesData] = await Promise.all([
        fetchFacilities(),
        loadGroups()
      ])
      facilities.value = facilitiesData || []
    } catch (err) {
      console.error('Failed to fetch facilities:', err)
      facilities.value = []
    }
  })
</script>

