<script setup lang="ts">
import { ref } from "vue"

const loginDone = ref(false)

function login() {
  loginDone.value = true
}
</script>

<template>
  <div class="grid grid-cols-2 justify-center p-5 size-full...">
    <div class="flex justify-start p-5 ...">
      <Button @click="navigateTo('/')" variant="ghost">Search</Button>
      <Button v-if="loginDone" @click="navigateTo('/items')" variant="ghost"
        >Register</Button
      >
      <Button v-if="loginDone" @click="navigateTo('/main')" variant="ghost"
        >Admin</Button
      >
      <Button @click="navigateTo('/main')" variant="ghost"
        >Storage finder</Button
      >
    </div>
    <div class="flex justify-end p-5 ...">
      <Button class="align-right" @click="login" variant="ghost">Login</Button>
    </div>
  </div>
  <NuxtPage />
</template>
