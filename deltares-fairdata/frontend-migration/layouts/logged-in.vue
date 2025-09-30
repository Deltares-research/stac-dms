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
          v-if="isAuthenticated"
          to="/register"
        >
          Register
        </v-tab>
        <v-tab
          v-if="hasPermission('collection:create')"
          to="/domains"
        >
          Domains
        </v-tab>
        <v-tab 
          v-if="hasPermission('keyword:all')"
          to="/keywords"
        >
          Keywords
        </v-tab>
        <v-tab
          v-if="hasPermission('group:read')"
          to="/groups"
        >
          Groups
        </v-tab>
      </v-tabs>
      
      <!-- User info and logout button positioned at the right -->
      <v-spacer />
      <div v-if="isAuthenticated" class="d-flex align-center">
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
    </v-app-bar>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
  import { useAuth } from '~/composables/useAuth'

  const { 
    isAuthenticated, 
    hasPermission, 
    displayName, 
    login, 
    logout, 
    isLoading,
  } = useAuth()

  console.log('isAuthenticated:', isAuthenticated.value)
  console.log('hasPermission collection:create:', hasPermission('collection:create'))
  console.log('hasPermission keyword:all:', hasPermission('keyword:all'))
  console.log('hasPermission group:read:', hasPermission('group:read'))

  const handleLogin = () => {
    login()
  }

  const handleLogout = () => {
    logout()
  }
</script>