<script setup lang="ts">
let { data } = await useApi("/auth/me");
</script>

<template>
  <div class="grid grid-cols-2 py-2 px-4 border-b border-border">
    <nav class="flex">
      <Button as-child variant="link">
        <NuxtLink to="/">Search</NuxtLink>
      </Button>
      <Button as-child v-if="data" variant="link">
        <NuxtLink to="/items">Register</NuxtLink>
      </Button>
      <Button as-child v-if="data" variant="link">
        <NuxtLink to="/main">Admin</NuxtLink>
      </Button>
      <Button as-child variant="link">
        <NuxtLink to="/main">Storage Finder</NuxtLink>
      </Button>
    </nav>
    <div class="flex justify-end">
      <Button v-if="!data" as-child variant="link">
        <a href="/api/auth/login">Login</a>
      </Button>
      <Button v-if="data" as-child variant="link">
        <a href="/api/auth/logout">Logout</a>
      </Button>
    </div>
  </div>
  <NuxtPage />

  <Toaster />
</template>
