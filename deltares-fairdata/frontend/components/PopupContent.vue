<template>
  <v-card style="min-width: 300px; max-width: 420px; box-shadow: none;">
    <v-card-title class="text-h6 text-wrap">
      {{ feature.properties?.title || feature.id }}
    </v-card-title>
    <v-card-text>
      <p class="text-body-2 mb-3">
        {{ feature.properties?.description || 'No description.' }}
      </p>
      
      <div class="d-flex align-center mb-3">
        <v-icon class="mr-2" size="small">
          mdi-link-variant
        </v-icon>
        <span v-if="firstAssetHref(feature)">
          {{ firstAssetHref(feature) }}
        </span>
        <span v-else>—</span>
      </div>
      
      <div class="mb-3">
        <v-btn
          v-if="firstAssetHref(feature)"
          :href="firstAssetHref(feature)"
          target="_blank"
          rel="noopener noreferrer"
          variant="tonal"
          density="comfortable"
          prepend-icon="mdi-open-in-new"
        >
          View details
        </v-btn>
      </div>
      
      <div class="text-body-2">
        {{ formatDate(feature) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
  import { formatDate, firstAssetHref } from '~/utils/helpers'

  defineProps({
    feature: {
      type: Object,
      required: true,
    },
  })
</script>
