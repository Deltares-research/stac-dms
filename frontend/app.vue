<script setup lang="ts">
import { ref } from "vue"

const loginDone = ref(false)

function login() {
  loginDone.value = true
}
</script>

<template>
  <div class="grid grid-cols-2 py-2 px-4 border-b border-border">
    <nav class="flex">
      <Button as-child variant="link">
        <NuxtLink to="/">Search</NuxtLink>
      </Button>
      <Button as-child v-if="loginDone" variant="link">
        <NuxtLink to="/items">Register</NuxtLink>
      </Button>
      <Button as-child v-if="loginDone" variant="link">
        <NuxtLink to="/main">Admin</NuxtLink>
      </Button>
      <Button as-child variant="link">
        <NuxtLink to="/main">Storage Finder</NuxtLink>
      </Button>
    </nav>
    <div class="flex justify-end">
      <Button class="align-right" @click="login" variant="link">Login</Button>
    </div>
  </div>
  <NuxtPage />
</template>
