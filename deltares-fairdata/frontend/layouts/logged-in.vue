<template>
  <v-app>
    <v-app-bar>
      <v-tabs
        align-tabs="start"
      >
        <v-tab
          to="/"
        >
          Search
        </v-tab>
        <v-tab
          v-if="configStore.authEnabled && effectiveIsAuthenticated"
          to="/register"
        >
          Register
        </v-tab>
        <v-tab
          v-if="configStore.authEnabled && hasPermission('collection:create')"
          to="/domains"
        >
          Domains
        </v-tab>
        <v-tab 
          v-if="configStore.authEnabled && hasPermission('keyword:all')"
          to="/keywords"
        >
          Keywords
        </v-tab>
        <v-tab
          v-if="configStore.authEnabled && hasPermission('group:read')"
          to="/groups"
        >
          Groups
        </v-tab>
        <v-tab
          v-if="configStore.aboutTabEnabled"
          to="/about"
        >
          About
        </v-tab>
      </v-tabs>
      
     
      <v-spacer />
      <!-- Only show auth UI if auth is enabled -->
      <div v-if="configStore.authEnabled">
        <div v-if="effectiveIsAuthenticated" class="d-flex align-center">
          <span class="text-subtitle2 me-3">{{ displayName }}</span>
          <v-btn
            :loading="isLoading"
            color="error"
            size="small"
            variant="text"
            @click="handleLogout"
          >
            <v-icon class="me-2">
              mdi-logout
            </v-icon>
            Logout
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            :loading="isLoading"
            color="primary"
            variant="text"
            @click="handleLogin"
          >
            <v-icon class="me-2">
              mdi-account
            </v-icon>
            Login
          </v-btn>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
  import { useAuth } from '~/composables/useAuth'
  import { useConfigStore } from '~/stores/config'
  import { computed } from 'vue'

  const { 
    isAuthenticated, 
    hasPermission, 
    displayName, 
    login, 
    logout, 
    isLoading,
  } = useAuth()
  
  const configStore = useConfigStore()
  
  // When auth is disabled, treat as always authenticated for UI purposes
  const effectiveIsAuthenticated = computed(() => {
    return !configStore.authEnabled || isAuthenticated.value
  })

  const handleLogin = () => {
    login()
  }

  const handleLogout = () => {
    logout()
  }
</script>