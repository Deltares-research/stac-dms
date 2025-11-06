<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h1>Register New Data</h1>
          </v-card-title>
          <v-card-text>
            <p>This page will contain the form to register new data items.</p>
            <p>Only authenticated users can access this page.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  // This page requires authentication
  // definePageMeta({
  //   middleware: 'auth'
  // })
</script>