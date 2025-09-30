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
      </v-tabs>
      
      <!-- Login button positioned at the right -->
      <v-spacer />
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
    </v-app-bar>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>

  import { useAuth } from '~/composables/useAuth'

  const { login, isLoading } = useAuth()

  const handleLogin = () => {
    login()
  }
</script>
