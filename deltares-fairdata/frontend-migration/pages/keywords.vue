<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h1>Keywords Management</h1>
          </v-card-title>
          <v-card-text>
            <p>This page will contain the keywords management interface.</p>
            <p>Only users with 'keyword:all' permission can access this page.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  // This page requires specific permission
  // definePageMeta({
  //   middleware: 'permissions',
  //   permission: 'keyword:all'
  // })
</script>