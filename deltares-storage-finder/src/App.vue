<template>
  <v-app>
    <v-main
      :style="bgStyle"
    >
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

  import bg from '@/assets/background.png'
  const bgStyle = {
    background: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.3)), url(${bg}) center center / cover no-repeat !important`,
    minHeight: '100vh',
  }

</script>

<style>
.v-application,
.v-main {
  background: transparent !important;
}
</style>
