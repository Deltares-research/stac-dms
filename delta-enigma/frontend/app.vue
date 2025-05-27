<script setup lang="ts">
import { User } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/composables/permissions"

const { hasPermission } = await usePermissions()

const {
  data,
  error: notAuthenticated,
  refresh,
} = await useApi("/auth/me", { credentials: "include" })

async function logout() {
  await $fetch("/api/auth/logout")
  await refresh()
}
</script>

<template>
  <div class="grid grid-cols-2 py-2 px-4 border-b border-border">
    <nav class="flex">
      <Button as-child variant="link">
        <NuxtLink to="/">Search</NuxtLink>
      </Button>
      <Button as-child v-if="!notAuthenticated" variant="link">
        <NuxtLink to="/items">Register</NuxtLink>
      </Button>
      <Button as-child v-if="hasPermission('collection:create')" variant="link">
        <NuxtLink to="/collections">Collections</NuxtLink>
      </Button>
      <Button as-child v-if="hasPermission('keyword:all')" variant="link">
        <NuxtLink to="/keywords">Keywords</NuxtLink>
      </Button>
      <Button as-child v-if="hasPermission('group:read')" variant="link">
        <NuxtLink to="/groups">Groups</NuxtLink>
      </Button>
    </nav>
    <div class="flex justify-end">
      <nav class="flex">
        <Button v-if="notAuthenticated" variant="link">
          <a href="/api/auth/login"> Login</a>
        </Button>
        <Button v-if="data" variant="ghost" @click="logout">
          <User class="w-4 h-4 mr-2" />
          {{ data.display_name }} Logout
        </Button>
      </nav>
    </div>
  </div>

  <NuxtPage />

  <Toaster />
</template>
