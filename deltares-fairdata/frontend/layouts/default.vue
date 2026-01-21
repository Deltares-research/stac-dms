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
          v-if="configStore.aboutTabEnabled"
          to="/about"
        >
          About
        </v-tab>
      </v-tabs>
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
      <slot /> 
    </v-main>
  </v-app>
</template>

<script setup>

  import { useAuth } from '~/composables/useAuth'
  import { useConfigStore } from '~/stores/config'

  const { login, isLoading } = useAuth()
  const configStore = useConfigStore()

  const handleLogin = () => {
    login()
  }
</script>
