<template>
  <v-container fluid class="pa-0 ma-0 two-col-page">
    <v-row no-gutters class="two-col-row">
      <!-- LEFT: Results list (its own scroll) -->
      <v-col
        :cols="12"
        :md="6"
        class="left-col"
      >
        <v-sheet class="left-scroll pa-4">
          <!-- Not authenticated state -->
          <div
            v-if="!canAccess && configStore.authEnabled && !authLoading"
            class="d-flex flex-column justify-center align-center text-center"
            style="height: 200px;"
          >
            <v-icon
              size="64"
              color="grey-lighten-1"
              class="mb-4"
            >
              mdi-account-circle
            </v-icon>
            <h3 class="text-h6 mb-2">
              Please log in to search data
            </h3>
            <p class="text-body-2 text-grey">
              Use the login button in the top right to access the FAIR data finder
            </p>
          </div>

          <!-- Authenticated state with features -->
          <div v-else-if="canAccess">
            <feature-filters
              :options="filterOptions"
              class="mb-4"
            />

            <!-- Search input -->
            <v-row class="mb-4">
              <v-col cols="12">
                <form @submit.prevent="applyQuery">
                  <div class="d-flex align-center ga-2">
                    <v-text-field
                      v-model="queryInput"
                      variant="outlined"
                      placeholder="Search title or description"
                      hide-details
                      clearable
                      class="flex-grow-1"
                      @click:clear="queryInput = ''; applyQuery()"
                    />
                    <v-btn type="submit">
                      Search
                    </v-btn>
                  </div>
                </form>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                v-for="f in features"
                :key="f.id"
                cols="12"
              >
                <v-card class="mb-4" variant="elevated">
                  <v-card-title class="text-wrap">
                    {{ f.properties?.title || 'Untitled' }}
                  </v-card-title>

                  <v-card-text>
                    <p class="mb-3 line-clamp-3">
                      {{ f.properties?.description || 'No description.' }}
                    </p>

                    <div class="d-flex align-center mb-3">
                      <v-icon class="mr-2" size="small">
                        mdi-link-variant
                      </v-icon>
                      <span v-if="firstAssetHref(f)">
                        {{ firstAssetHref(f) }}
                      </span>
                      <span v-else>—</span>
                    </div>

                    <div class="mb-3">
                      <v-btn
                        v-if="firstAssetHref(f)"
                        :href="firstAssetHref(f)"
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
                      {{ formatDate(f) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
      <!-- RIGHT: Map (fixed to visible viewport below app bar) -->
      <v-col
        :cols="12"
        :md="6"
        class="right-col"
      >
        <v-sheet class="right-map">
          <search-map-component />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, watch, onMounted, ref } from 'vue'
  import { useSearchPageStore } from '~/stores/searchPage'
  import { useRoute } from 'vue-router'
  import { useAuth } from '~/composables/useAuth'
  import { useConfigStore } from '~/stores/config'
  import FeatureFilters from '@/components/FeatureFilters.vue'
  import { formatDate } from '~/utils/helpers'


  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const configStore = useConfigStore()
  
  // When auth is disabled, allow access without authentication
  const canAccess = computed(() => {
    return !configStore.authEnabled || isAuthenticated.value
  })
  
 
  const store = useSearchPageStore()
  const route = useRoute() 
  
  const q = route.query
  
  store.q = q.q || ''
  store.startDate = q.start || undefined
  store.endDate = q.end || undefined
  store.keywords = toArr(q.keywords)
  store.includeEmptyGeometry = q.includeEmptyGeometry === 'on'

 
  const queryInput = ref(store.q || '')
  function applyQuery() {
    store.q = (queryInput.value || '').trim()
  }
  
  onMounted(async () => {
    await store.fetchCollections()
    const ids = toArr(q.collections)
    if (ids.length > 0) {
      store.collections = store.collections.map(c => ({
        ...c,
        selected: ids.includes(c.id)
      }))
    }
  })
  

  watch(
    () => [store.q, store.startDate, store.endDate, store.keywords, store.collections, store.includeEmptyGeometry, store.bboxFilter, canAccess.value],
    () => {
      if (canAccess.value) {
        store.search()
      }
    },
    { deep: true, immediate: true }
  )


  const features = computed(() => {
    if (!canAccess.value) {
      return []
    }
    const collection = store.featureCollection
    return Array.isArray(collection?.features) ? collection.features : []
  })

  // Helper functions
  function toArr(val) {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }

  function norm(str) {
    return (str || '').toString().trim().toLowerCase()
  }

  function sortAsc(a, b) {
    return norm(a).localeCompare(norm(b))
  }

  function firstAssetHref(feature) {
    const assets = feature?.assets
    if (!assets) return null
    const firstKey = Object.keys(assets)[0]
    return firstKey ? assets[firstKey]?.href : null
  }

  // Filter options
  const filterOptions = computed(() => {
    const col = new Set()
    const kw = new Set()

    features.value.forEach(f => {
      if (f.collection) col.add(f.collection)
      const keywords = f.properties?.keywords || []
      keywords.forEach(k => {
        if (k?.en_keyword) kw.add(k.en_keyword)
      })
    })

    return {
      collection: [...col].sort(sortAsc),
      keyword: [...kw].sort(sortAsc),
    }
  })
</script>

<style scoped>
/* Two-column layout with scrolling */
.two-col-page {
  height: calc(100vh - 64px); /* Adjust based on app bar height */
}

.two-col-row {
  height: 100%;
}

.left-col {
  height: 100%;
  overflow: hidden;
}

.left-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.right-col {
  height: 100%;
}

.right-map {
  height: 100%;
}

/* Clamp long descriptions to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

