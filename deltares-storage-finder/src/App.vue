<template>
  <v-app>
    <v-main class="app-background">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

</script>

<style>
.app-background {
  position: relative;
  min-height: 100vh;
  background-color: #f0fcfa;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .app-background::before {
    background-image: linear-gradient(
      330deg,
      hsla(0, 0%, 100%, 0.8) 60%,
      hsla(0, 0%, 100%, 0) 85%
    );
    clip-path: circle(50% at 50% 50%);
    content: "";
    padding-top: 80%;
    position: fixed;
    transform: translate3d(10%, 11%, 0);
    width: 80%;
    z-index: -1;
  }
}

.v-application,
.v-main {
  position: relative;
  z-index: 1;
}
</style>
