<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-2">
      Keyword management
    </h1>
    <p class="text-body-2 text-grey-darken-1 mb-6">
      Keywords exist in a 3-tier hierarchy: domains contain keyword groups.
      Keyword groups contain keywords.
    </p>
    
    <v-divider class="mb-6" />
    
    <v-row>
      <v-col cols="12" md="3">
        <div class="text-uppercase text-caption text-grey-darken-1 font-weight-bold mb-3">
          Section
        </div>
        <v-list class="bg-grey-lighten-4 pa-2 rounded" density="compact">
          <v-list-item
            :to="'/keywords/facilities'"
            :active="$route.path.startsWith('/keywords/facilities')"
            class="mb-1 rounded"
            active-class="bg-white elevation-1"
          >
            <v-list-item-title class="text-body-2 font-weight-medium">
              Domains
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="'/keywords/groups'"
            :active="$route.path.startsWith('/keywords/groups')"
            class="mb-1 rounded"
            active-class="bg-white elevation-1"
          >
            <v-list-item-title class="text-body-2 font-weight-medium">
              Keyword groups
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      
      <v-col cols="12" md="9">
        <NuxtPage />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { usePermissionsStore } from '~/stores/permissions'

  defineOptions({
    name: 'KeywordsPage'
  })

  const router = useRouter()
  const route = useRoute()
  const permissionsStore = usePermissionsStore()

  // Check permissions - only fetch if not already loaded
  async function checkPermissions() {
    // Only fetch if permissions haven't been loaded yet
    if (permissionsStore.permissions.length === 0 && !permissionsStore.isLoading) {
      try {
        await permissionsStore.fetchPermissions()
      } catch (error) {
        console.error('Error fetching permissions:', error)
        // Don't redirect on error, just log it
        return
      }
    }
    
    // Check permission and redirect if needed
    if (!permissionsStore.hasPermission('keyword:all')) {
      // Use replace to avoid adding to history
      router.replace('/')
    }
  }

  // Check on mount
  onMounted(() => {
    checkPermissions()
  })

  // Watch for route changes to avoid loops
  watch(
    () => route.path,
    (newPath) => {
      // Only check if we're still on a keywords page
      if (newPath.startsWith('/keywords')) {
        checkPermissions()
      }
    }
  )
</script>