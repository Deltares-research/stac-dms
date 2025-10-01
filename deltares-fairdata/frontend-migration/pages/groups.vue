<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h1>Groups Management</h1>
          </v-card-title>
          <v-card-text>
            <p>This page will contain the groups management interface.</p>
            <p>Only users with 'group:read' permission can access this page.</p>
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
  //   permission: 'group:read'
  // })
</script>