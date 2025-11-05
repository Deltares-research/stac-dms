<template>
  <v-container fluid class="pa-0 ma-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col
        :cols="12"
        :md="6"
        class="fill-height"
      >
        <v-sheet
          height="100%"
          class="pa-4"
          style="overflow:auto"
        >
          <!-- Not authenticated state -->
          <div
            v-if="!isAuthenticated && !authLoading"
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
          <div v-else-if="isAuthenticated">
            <feature-filters
              v-model="filters"
              :options="filterOptions"
              class="mb-4"
            />

            <v-row>
              <v-col
                v-for="f in filteredFeatures"
                :key="f.id"
                cols="12"
              >
                <v-card class="mb-4" variant="elevated">
                  <v-card-title class="text-wrap">
                    {{ f.properties?.title || 'Untitled' }}
                  </v-card-title>

                  <v-card-subtitle class="d-flex align-center flex-wrap gap-2">
                    <v-chip size="small" variant="flat">
                      {{ formatDate(f.properties?.datetime) }}
                    </v-chip>
                  </v-card-subtitle>

                  <v-card-text>
                    <p class="mb-3 line-clamp-3">
                      {{ f.properties?.description || 'No description.' }}
                    </p>

                    <div class="d-flex align-center">
                      <v-icon class="mr-2" size="small">
                        mdi-link-variant
                      </v-icon>
                      <a
                        v-if="firstAssetHref(f)"
                        :href="firstAssetHref(f)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ firstAssetHref(f) }}
                      </a>
                      <span v-else>—</span>
                    </div>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      v-if="firstAssetHref(f)"
                      :href="firstAssetHref(f)"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="tonal"
                      density="comfortable"
                      prepend-icon="mdi-open-in-new"
                    >
                      Open asset
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-sheet>
      </v-col>
      <v-col
        :cols="12"
        :md="6"
        class="fill-height"
      >
        <v-sheet height="100%">
          <map-component />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { computed, watch, ref } from 'vue'
  import { useSearchPageStore } from '~/stores/searchPage'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuth } from '~/composables/useAuth'
  import FeatureFilters from '@/components/FeatureFilters.vue'

  // Authentication
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Search functionality
  const store = useSearchPageStore()
  const route = useRoute() 
  
  const q = route.query
  
  store.q = q.q || ''
  store.startDate = q.start || undefined
  store.endDate = q.end || undefined
  store.keywords = toArr(q.keywords)
  store.collections = toArr(q.collections)
  store.includeEmptyGeometry = q.includeEmptyGeometry === 'on'
  
  // Only search if user is authenticated
  watch(
    () => [store.q, store.startDate, store.endDate, store.keywords, store.collections, store.includeEmptyGeometry, store.bboxFilter, isAuthenticated.value],
    () => {
      if (isAuthenticated.value) {
        store.search()
      }
    },
    { deep: true, immediate: true }
  )


  const features = computed(() => {
    if (!isAuthenticated.value) {
      return []
    }
    const collection = store.featureCollection
    return Array.isArray(collection?.features) ? collection.features : []
  })

  // Filter state
  const filters = ref({
    query: '',
    startDate: '',
    endDate: '',
    collection: 'any',
    keyword: 'any',
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

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return '—'
    }
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

  /* Filter the list of features by current selections (incl. Start/End date + free search) */
  const filteredFeatures = computed(() => {
    const sel = filters.value

    // Free-text search
    const q = (sel.query || '').trim().toLowerCase()

    // Start boundary
    const selStartMs = sel.startDate ? Date.parse(sel.startDate) : NaN

    // End boundary: whole day inclusive
    const selEndBoundMs = sel.endDate
      ? (() => { const d = new Date(sel.endDate); if (isNaN(d)) return NaN; d.setHours(23,59,59,999); return d.getTime() })()
      : NaN

    return features.value.filter((f) => {
      const p = f.properties || {}

      const passCollection = sel.collection === 'any' || norm(f.collection) === sel.collection

      const enKeywords = (Array.isArray(p.keywords) ? p.keywords : [])
        .map(k => norm(k?.en_keyword))
        .filter(Boolean)
      const passKeyword = sel.keyword === 'any' || enKeywords.includes(sel.keyword)

      // Free-search against title + description
      const hayTitle = (p.title || '').toString()
      const hayDesc = (p.description || '').toString()
      const passQuery = q === '' || (hayTitle + ' ' + hayDesc).toLowerCase().includes(q)

      // Date boundaries
      const featMs = p.datetime ? Date.parse(p.datetime) : NaN

      let passStart = true
      if (sel.startDate) {
        passStart = Number.isFinite(featMs) && Number.isFinite(selStartMs) && (featMs >= selStartMs)
      }

      let passEnd = true
      if (sel.endDate) {
        passEnd = Number.isFinite(featMs) && Number.isFinite(selEndBoundMs) && (featMs <= selEndBoundMs)
      }

      return passCollection && passKeyword && passQuery && passStart && passEnd
    })
  })

  /* ---- Only the Polygon features (for the map) ---- */
  const polygonFeatures = computed(() =>
    filteredFeatures.value.filter(f => f?.geometry?.type === 'Polygon')
  )
</script>

<style>
/* Clamp long descriptions to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

