<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
      >
        <!-- Loading state -->
        <v-card v-if="isLoading" class="mb-4">
          <v-card-text class="d-flex flex-column align-center justify-center py-12">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            />
            <p class="text-body-2 text-grey-darken-1">
              Loading item...
            </p>
          </v-card-text>
        </v-card>

        <!-- Error state -->
        <v-card v-else-if="error" class="mb-4">
          <v-card-text class="d-flex flex-column align-center justify-center py-12 text-center">
            <v-icon
              size="64"
              color="error"
              class="mb-4"
            >
              mdi-alert-circle
            </v-icon>
            <h3 class="text-h6 mb-2">
              Error loading item
            </h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">
              {{ error }}
            </p>
            <v-btn variant="outlined" to="/">
              Return to search
            </v-btn>
          </v-card-text>
        </v-card>

      
        <div v-else-if="item">
          <h1 class="text-h4 font-weight-bold mb-4">
            {{ item.properties?.title || 'Untitled Item' }}
          </h1>

          <div class="d-flex flex-wrap text-body-2 text-grey-darken-1 mb-6" style="gap: 16px;">
            <div class="d-flex align-center">
              <v-icon size="small" class="mr-1">
                mdi-tag
              </v-icon>
              <span>ID: {{ item.id || 'Unknown ID' }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="small" class="mr-1">
                mdi-calendar
              </v-icon>
              <span>{{ formatDate(item.properties?.datetime) || 'Unknown date' }}</span>
            </div>
            <div v-if="item.properties?.updated" class="d-flex align-center">
              <v-icon size="small" class="mr-1">
                mdi-clock
              </v-icon>
              <span>Updated: {{ formatDate(item.properties.updated) }}</span>
            </div>
          </div>

          <!-- Description -->
          <v-card class="mb-4" elevation="0">
            <v-card-text>
              <p class="text-body-1" style="white-space: pre-line;">
                {{ item.properties?.description || 'No description available' }}
              </p>
            </v-card-text>
          </v-card>

          <!-- Map if geometry available -->
          <v-card v-if="item.geometry" class="mb-4">
            <v-card-title class="text-h6">
              Geometry
            </v-card-title>
            <v-card-text style="min-height: 300px;">
              <div class="map-wrapper">
                <item-map-component
                  :draw-mode="false"
                  :center="mapCenter"
                  :layer-options="layerOptions"
                  :zoom-bounds="bounds"
                />
              </div>
            </v-card-text>
          </v-card>

          <!-- Assets Section -->
          <v-card class="mb-4">
            <v-card-title class="text-subtitle-1 d-flex align-center bg-grey-lighten-3">
              <v-icon
                class="mr-2"
                size="small"
                style="opacity: 0.3"
              >
                mdi-file
              </v-icon>
              Assets
              <v-spacer />
              <v-btn
                icon
                variant="text"
                size="small"
                @click="assetsExpanded = !assetsExpanded"
              >
                <v-icon>{{ assetsExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-expand-transition>
              <v-card-text v-show="assetsExpanded">
                <div v-if="!assets || assets.length === 0" class="text-body-2 text-grey-darken-1">
                  No assets available
                </div>
                <div v-else>
                  <div
                    v-for="(assetGroup, role) in groupedAssets"
                    :key="role"
                    class="mb-6"
                  >
                    <h3 class="text-subtitle-1 font-weight-medium mb-3 text-primary">
                      {{ role }}
                    </h3>
                    <div class="d-flex flex-column" style="gap: 16px;">
                      <v-card
                        v-for="asset in assetGroup"
                        :key="asset.key"
                        variant="outlined"
                        class="pa-4"
                      >
                        <div class="d-flex justify-space-between align-center mb-2">
                          <h4 class="text-subtitle-2 font-weight-medium">
                            {{ asset.title }}
                          </h4>
                          <v-chip
                            size="small"
                            color="primary"
                            variant="tonal"
                          >
                            {{ asset.type }}
                          </v-chip>
                        </div>
                        <p v-if="asset.description" class="text-body-2 text-grey-darken-1 mb-2">
                          {{ asset.description }}
                        </p>
                        <div class="text-body-2 text-grey-darken-1 mb-3" style="word-break: break-all;">
                          <v-icon size="small" class="mr-1">
                            mdi-link
                          </v-icon>
                          {{ asset.href }}
                        </div>
                        <div>
                          <v-btn
                            v-if="isUrl(asset.href)"
                            :href="asset.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-open-in-new"
                          >
                            Open
                          </v-btn>
                          <v-btn
                            v-else
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-content-copy"
                            @click="copyToClipboard(asset.href, asset.key)"
                          >
                            {{ copiedAssets[asset.key] ? 'Copied!' : 'Copy' }}
                          </v-btn>
                        </div>
                      </v-card>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-expand-transition>
          </v-card>

          <!-- Properties Section -->
          <v-card class="mb-4">
            <v-card-title class="text-subtitle-1 d-flex align-center bg-grey-lighten-3">
              <v-icon
                class="mr-2"
                size="small"
                style="opacity: 0.3"
              >
                mdi-information
              </v-icon>
              Properties
              <v-spacer />
              <v-btn
                icon
                variant="text"
                size="small"
                @click="propertiesExpanded = !propertiesExpanded"
              >
                <v-icon>{{ propertiesExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-expand-transition>
              <v-card-text v-show="propertiesExpanded">
                <v-table>
                  <tbody>
                    <tr
                      v-for="prop in properties"
                      :key="prop.key"
                    >
                      <td class="text-subtitle-2 font-weight-medium">
                        {{ formatPropertyKey(prop.key) }}
                      </td>
                      <td>
                        <a
                          v-if="isUrl(prop.value)"
                          :href="prop.value"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-primary"
                        >
                          {{ prop.value }}
                          <v-icon size="small" class="ml-1">mdi-open-in-new</v-icon>
                        </a>
                        <span v-else class="text-grey-darken-1">{{ formatValue(prop.key, prop.value) }}</span>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-expand-transition>
          </v-card>

          <!-- Providers Section (if available) -->
          <v-card v-if="providers && providers.length > 0" class="mb-4">
            <v-card-title class="text-subtitle-1 d-flex align-center bg-grey-lighten-3">
              <v-icon
                class="mr-2"
                size="small"
                style="opacity: 0.3"
              >
                mdi-account-group
              </v-icon>
              Providers
              <v-spacer />
              <v-btn
                icon
                variant="text"
                size="small"
                @click="providersExpanded = !providersExpanded"
              >
                <v-icon>{{ providersExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-expand-transition>
              <v-card-text v-show="providersExpanded">
                <div class="d-flex flex-column" style="gap: 16px;">
                  <v-card
                    v-for="(provider, index) in providers"
                    :key="index"
                    variant="outlined"
                    class="pa-4"
                  >
                    <h4 class="text-subtitle-2 font-weight-medium mb-2">
                      {{ provider.name }}
                    </h4>
                    <p v-if="provider.description" class="text-body-2 text-grey-darken-1 mb-2">
                      {{ provider.description }}
                    </p>
                    <div v-if="provider.url" class="mb-2">
                      <a
                        :href="provider.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary text-body-2"
                      >
                        <v-icon size="small" class="mr-1">mdi-link</v-icon>
                        {{ provider.url }}
                      </a>
                    </div>
                    <div
                      v-if="provider.role && provider.role.length > 0"
                      class="d-flex flex-wrap"
                      style="gap: 8px;"
                    >
                      <v-chip
                        v-for="role in provider.role"
                        :key="role"
                        size="small"
                        variant="tonal"
                      >
                        {{ role }}
                      </v-chip>
                    </div>
                  </v-card>
                </div>
              </v-card-text>
            </v-expand-transition>
          </v-card>

          <!-- Back button -->
          <div class="mt-4">
            <v-btn variant="outlined" to="/">
              Back to search
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { center } from '@turf/turf'
  import { fetchItemById } from '~/requests/items'
  import { formatDate } from '~/utils/helpers'
  import buildGeoJsonLayer from '~/utils/build-geojson-layer'

  const route = useRoute()
  const itemId = route.params['id']
 
  const item = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  

  const copiedAssets = ref({})
  const assetsExpanded = ref(true)
  const propertiesExpanded = ref(true)
  const providersExpanded = ref(true)

  // Computed properties
  const assets = computed(() => {
    if (!item.value?.assets) return []
    return Object.entries(item.value.assets).map(([key, asset]) => ({
      key,
      title: asset.title || key,
      href: asset.href || '',
      type: asset.type || 'Unknown type',
      description: asset.description || '',
      roles: asset.roles || [],
    }))
  })

  const groupedAssets = computed(() => {
    const groups = {}
    assets.value.forEach((asset) => {
      if (asset.roles && asset.roles.length > 0) {
        asset.roles.forEach((role) => {
          if (!groups[role]) groups[role] = []
          groups[role].push(asset)
        })
      } else {
        if (!groups['uncategorized']) groups['uncategorized'] = []
        groups['uncategorized'].push(asset)
      }
    })
    return groups
  })

  const properties = computed(() => {
    if (!item.value?.properties) return []
    const excluded = ['title', 'description', 'datetime', 'updated', 'created']
    return Object.entries(item.value.properties)
      .filter(([key]) => !excluded.includes(key))
      .map(([key, value]) => ({ key, value }))
  })

  const providers = computed(() => {
    return item.value?.properties?.providers || []
  })
  
  // Methods
  function formatPropertyKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  function formatValue(key, value) {
    if (key === 'keywords' && Array.isArray(value)) {
      return value.map(k => k.nl_keyword || k.en_keyword || JSON.stringify(k)).join(', ')
    }
    if (key.includes('datetime') || key.includes('date')) {
      return formatDate(value) || String(value)
    }
    if (value === null) return 'None'
    if (value === undefined) return 'Undefined'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  function isUrl(value) {
    if (typeof value !== 'string') return false
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  async function copyToClipboard(text, assetKey) {
    try {
      await navigator.clipboard.writeText(text)
      copiedAssets.value[assetKey] = true
      setTimeout(() => {
        copiedAssets.value[assetKey] = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }
  const bounds = computed(() => {
    if (!item.value || !item.value.geometry || !item.value.bbox) return []
    return Array.isArray(item.value.bbox) ? item.value.bbox : []
  })

  // Build layer options from the item
  const layerOptions = computed(() => {
    if (!item.value || !item.value.geometry) return null
    
    // Convert single item to featureCollection format
    const featureCollection = {
      type: 'FeatureCollection',
      features: [item.value],
    }
    return buildGeoJsonLayer(featureCollection)
  })



  // Fetch item on mount
  onMounted(async () => {
    isLoading.value = true
    error.value = null
    try {
      item.value = await fetchItemById(itemId)
    } catch (err) {
      error.value = err.message || 'Failed to load item'
      console.error('Error loading item:', err)
    } finally {
      isLoading.value = false
    }
  })
</script>

<style scoped>
  .map-wrapper, .map-wrapper .mapboxgl-map {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
</style>
