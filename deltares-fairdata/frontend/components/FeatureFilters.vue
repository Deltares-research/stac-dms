<template>
  <v-sheet
    ref="rootEl"
    variant="outlined"
    class="rounded-lg filters-root"
  >
    <!-- Header -->
    <v-toolbar flat density="comfortable">
      <v-btn
        icon
        class="ml-1"
        :aria-label="expanded ? 'Collapse filters' : 'Expand filters'"
        @click="expanded = !expanded"
      >
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <v-icon start class="mr-2">
        mdi-filter
      </v-icon>
      <span class="text-subtitle-1 font-weight-medium">Filter</span>

      <v-divider vertical class="mx-3" />

      <v-btn
        variant="text"
        density="comfortable"
        @click="clear"
      >
        Clear filters
      </v-btn>

      <v-spacer />

      <!-- Active selection chips -->
      <div v-if="activeChips.length" class="d-flex flex-wrap ga-2 mr-2">
        <v-chip
          v-for="chip in activeChips"
          :key="chip.key"
          size="small"
          variant="flat"
          closable
          class="mb-1"
          @click:close="clearOne(chip.key)"
        >
          {{ chip.label }}: {{ chip.value }}
        </v-chip>
      </div>
    </v-toolbar>

    <!-- Floating expanded content (overlays the rest) -->
    <v-expand-transition>
      <div v-show="expanded" class="filters-popover elevation-8 rounded-b-lg">
        <v-divider />

        <v-container fluid class="py-4">
          <v-row>
            <!-- Domain (collection) -->
            
            <v-col
              cols="12"
              md="4"
              class="filter-col"
            >
              <div class="text-subtitle-2 mb-2">
                Domain
              </div>
              <v-autocomplete
                v-model="selectedCollection"
                :items="store.collections"
                item-title="title"
                item-value="id"
                return-object
                prepend-inner-icon="mdi-magnify"
                placeholder="Search domain..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
                @update:model-value="handleCollectionChange"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-list-item-action>
                        <v-icon v-if="item.raw.selected" color="primary">
                          mdi-check
                        </v-icon>
                      </v-list-item-action>
                    </template>
                    <v-list-item-title>
                      <div class="d-flex flex-column">
                        <div class="text-caption text-grey-darken-1">
                          {{ item.raw.description || '' }}
                        </div>
                        <div class="text-body-2 font-weight-medium">
                          {{ item.raw.title }}
                        </div>
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  {{ item.raw.title }}
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Topic -->

            <v-col
              cols="12"
              md="4"
              class="filter-col"
            >
              <div class="text-subtitle-2 mb-2">
                Topic
              </div>
              <v-autocomplete
                v-model="selectedTopic"
                :items="store.topics"
                item-title="id"
                item-value="id"
                return-object
                multiple
                chips
                prepend-inner-icon="mdi-magnify"
                placeholder="Search topic..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
                @update:model-value="handleTopicChange"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-list-item-action>
                        <v-icon v-if="item.raw.selected" color="primary">
                          mdi-check
                        </v-icon>
                      </v-list-item-action>
                    </template>
                    <v-list-item-title>
                      <div class="d-flex justify-space-between align-center">
                        <div class="text-caption text-grey-darken-1">
                          {{ item.raw.count }} items
                        </div>
                      </div>
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  {{ item.raw.id }}
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Keyword -->
            <v-col
              cols="12"
              md="4"
              class="filter-col"
            >
              <div class="text-subtitle-2 mb-2">
                Keyword
              </div>
              <v-autocomplete
                v-model="selectedKeyword"
                :items="[]"
                prepend-inner-icon="mdi-magnify"
                placeholder="Search keyword..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>

            <!-- Start & End date (buttons open date pickers) -->
            <v-col
              cols="12"
              md="4"
              class="filter-col"
            >
              <!-- Start date -->
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-2">
                  Start date
                </div>
                <v-btn
                  v-if="store.startDate"
                  size="x-small"
                  variant="text"
                  @click="store.startDate = undefined"
                >
                  Clear
                </v-btn>
              </div>

              <v-menu
                v-model="startMenu"
                :close-on-content-click="false"
                content-class="filters-portal"
                location="bottom start"
                :offset="8"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="outlined"
                    block
                  >
                    <v-icon start>
                      mdi-calendar
                    </v-icon>
                    {{ store.startDate ? labelFor('startDate', store.startDate) : 'Pick a date' }}
                  </v-btn>
                </template>

                <v-card>
                  <v-date-picker
                    v-model="tempStart"
                    show-adjacent-months
                    elevation="0"
                  />
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="startMenu = false">
                      Cancel
                    </v-btn>
                    <v-btn variant="flat" @click="applyStart">
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>

              <!-- End date -->
              <div class="d-flex align-center justify-space-between mt-6 mb-2">
                <div class="text-subtitle-2">
                  End date
                </div>
                <v-btn
                  v-if="store.endDate"
                  size="x-small"
                  variant="text"
                  @click="store.endDate = undefined"
                >
                  Clear
                </v-btn>
              </div>

              <v-menu
                v-model="endMenu"
                :close-on-content-click="false"
                content-class="filters-portal"
                location="bottom start"
                :offset="8"
              >
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    variant="outlined"
                    block
                  >
                    <v-icon start>
                      mdi-calendar
                    </v-icon>
                    {{ store.endDate ? labelFor('endDate', store.endDate) : 'Pick a date' }}
                  </v-btn>
                </template>

                <v-card>
                  <v-date-picker
                    v-model="tempEnd"
                    show-adjacent-months
                    elevation="0"
                  />
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="endMenu = false">
                      Cancel
                    </v-btn>
                    <v-btn variant="flat" @click="applyEnd">
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>

          <!-- Area Filter -->
          <v-row>
            <v-col
              cols="12"
              md="4"
              class="filter-col"
            >
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-2">
                  Area
                </div>
                <v-btn
                  v-if="hasActiveAreaFilter"
                  size="x-small"
                  variant="text"
                  @click="clearAreaFilter"
                >
                  Clear
                </v-btn>
              </div>
              <v-btn
                variant="outlined"
                block
                :color="store.areaDrawMode ? 'primary' : undefined"
                @click="toggleAreaDraw"
              >
                <v-icon start>
                  mdi-selection-drag
                </v-icon>
                {{ store.areaDrawMode ? 'Drawing...' : 'Draw area on map' }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- Include Empty Geometry Checkbox -->
          <v-row>
            <v-col
              cols="12"
              class="filter-col"
            >
              <v-checkbox
                v-model="store.includeEmptyGeometry"
                label="Include items without geometry"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script setup>
  import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useSearchPageStore } from '~/stores/searchPage'

  // const props = defineProps({
  //   options: {
  //     type: Object,
  //     default: () => ({
  //       collection: [],
  //       keyword: [],
  //     }),
  //   },
  // })

  const store = useSearchPageStore()
  const expanded = ref(false)
  const rootEl = ref(null)
  
  // Check if area filter is active (bbox is not default)
  const defaultBbox = [180, 90, -180, -90]
  const hasActiveAreaFilter = computed(() => {
    if (!store.bboxFilter) return false
    return store.bboxFilter[0] !== defaultBbox[0] || 
      store.bboxFilter[1] !== defaultBbox[1] || 
      store.bboxFilter[2] !== defaultBbox[2] || 
      store.bboxFilter[3] !== defaultBbox[3]
  })

  /* --- Convert store arrays to single values for display --- */
  const selectedCollection = computed({
    get: () => {
      const selected = store.collections.find(c => c.selected)
      return selected || null
    },
    set: (value) => {
      if (!value || value === 'any') {
        store.collections = store.collections.map(c => ({ ...c, selected: false }))
      } else {
        store.collections = store.collections.map(c => ({
          ...c,
          selected: c.id === value.id
        }))
      }
    },
  })

  function handleCollectionChange(value) {
    if (!value || value === 'any') {
      store.collections = store.collections.map(c => ({ ...c, selected: false }))
    } else {
      store.collections = store.collections.map(c => ({
        ...c,
        selected: c.id === value.id
      }))
    }
  }

  const selectedTopic = computed({
    get: () => {
      const selected = store.topics.filter(t => t.selected)
      return selected
    },
    set: (value) => {
      if (!value || value.length === 0) {
        store.topics = store.topics.map(t => ({ ...t, selected: false }))
      } else {
        const selectedIds = value.map(v => v.id)
        store.topics = store.topics.map(t => ({
          ...t,
          selected: selectedIds.includes(t.id)
        }))
      }
    },
  })

  function handleTopicChange(value) {
    if (!value || value.length === 0) {
      store.topics = store.topics.map(t => ({ ...t, selected: false }))
    } else {
      const selectedIds = value.map(v => v.id)
      store.topics = store.topics.map(t => ({
        ...t,
        selected: selectedIds.includes(t.id)
      }))
    }
  }

  const selectedKeyword = computed({
    get: () => store.keywords?.length ? store.keywords[0] : null,
    set: (value) => {
      if (!value || value === 'any') {
        store.keywords = []
      } else {
        store.keywords = [value]
      }
    },
  })

  /* --- Date menus state --- */
  const startMenu = ref(false)
  const endMenu = ref(false)
  const tempStart = ref('')
  const tempEnd = ref('')

  watch(startMenu, (open) => { if (open) tempStart.value = store.startDate || '' })
  watch(endMenu,   (open) => { if (open) tempEnd.value   = store.endDate   || '' })

  function applyStart () {
    store.startDate = tempStart.value || undefined
    startMenu.value = false
  }
  function applyEnd () {
    store.endDate = tempEnd.value || undefined
    endMenu.value = false
  }

  function toggleAreaDraw() {
    store.areaDrawMode = !store.areaDrawMode
  }
  
  function clearAreaFilter() {
    store.areaDrawMode = false
    // Reset bbox filter to default (whole world)
    // This will be handled by the watcher in MapComponent, but we set it here too for consistency
    store.bboxFilter = [180, 90, -180, -90]
  }
  
  function clear () {
    store.q = ''
    store.collections = store.collections.map(c => ({ ...c, selected: false }))
    store.keywords = []
    store.startDate = undefined
    store.endDate = undefined
    store.includeEmptyGeometry = false
    store.topics = store.topics.map(t => ({ ...t, selected: false }))
    store.areaDrawMode = false
    store.bboxFilter = [180, 90, -180, -90]
  }
  function clearOne (key) {
    if (key === 'startDate') {
      store.startDate = undefined
    } else if (key === 'endDate') {
      store.endDate = undefined
    } else if (key === 'query') {
      store.q = ''
    } else if (key === 'collection') {
      store.collections = store.collections.map(c => ({ ...c, selected: false }))
    } else if (key === 'keyword') {
      store.keywords = []
    } else if (key === 'includeEmptyGeometry') {
      store.includeEmptyGeometry = false
    } else if (key.startsWith('topic-')) {
      const topicId = key.replace('topic-', '')
      store.topics = store.topics.map(t => 
        t.id === topicId ? { ...t, selected: false } : t
      )
    } else if (key === 'area') {
      clearAreaFilter()
    }
  }

  const FIELD_LABEL = {
    query: 'Search',
    collection: 'Domain',
    topic: 'Topic',
    keyword: 'Keyword',
    startDate: 'Start date',
    endDate: 'End date',
    includeEmptyGeometry: 'Include empty geometry',
    area: 'Area',
  }
  const humanDateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  function labelFor (key, value) {
    if (key === 'startDate' || key === 'endDate') {
      if (!value) return ''
      const d = new Date(value)
      return isNaN(d) ? value : humanDateFmt.format(d)
    }
    if (key === 'collection') {
      return value?.title || value
    }
    return value
  }

  const activeChips = computed(() => {
    const chips = []
    
    if (store.q && store.q.trim() !== '') {
      chips.push({ key: 'query', label: FIELD_LABEL.query, value: store.q })
    }
    
    if (store.startDate) {
      chips.push({ key: 'startDate', label: FIELD_LABEL.startDate, value: labelFor('startDate', store.startDate) })
    }
    
    if (store.endDate) {
      chips.push({ key: 'endDate', label: FIELD_LABEL.endDate, value: labelFor('endDate', store.endDate) })
    }
    
    if (store.collections && store.collections.length > 0) {
      const selected = store.collections.find(c => c.selected)
      if (selected) {
        chips.push({ key: 'collection', label: FIELD_LABEL.collection, value: selected.title })
      }
    }
    
    if (store.keywords && store.keywords.length > 0) {
      chips.push({ key: 'keyword', label: FIELD_LABEL.keyword, value: store.keywords[0] })
    }

    if (store.topics && store.topics.length > 0) {
      const selectedTopics = store.topics.filter(t => t.selected)
      selectedTopics.forEach(topic => {
        chips.push({ key: `topic-${topic.id}`, label: FIELD_LABEL.topic, value: topic.id })
      })
    } 
    
    if (store.includeEmptyGeometry) {
      chips.push({ key: 'includeEmptyGeometry', label: FIELD_LABEL.includeEmptyGeometry, value: 'Yes' })
    }
    
    // Show area chip if bbox filter is active
    if (hasActiveAreaFilter.value) {
      chips.push({ key: 'area', label: FIELD_LABEL.area, value: 'Selected' })
    }
    
    return chips
  })

  /* ---- Click outside to collapse ---- */
  function onDocPointerDown (e) {
    if (!expanded.value) return
    const root = rootEl.value?.$el ?? rootEl.value
    const target = e.target
    if (root && root.contains(target)) return
    // Ignore clicks inside teleported menus (sort + date pickers)
    if (target?.closest && target.closest('.filters-portal')) return
    expanded.value = false
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onDocPointerDown, true)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocPointerDown, true)
  })
</script>

<style scoped>
.filters-root {
  position: relative;
  z-index: 10;
  overflow: visible;
}
.filters-popover {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--v-theme-outline-variant);
  border-top: none;
  z-index: 1000;
}
@media (min-width: 960px) {
  .filter-col {
    position: relative;
    padding-left: 16px;
  }
  .filter-col + .filter-col::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: -8px;
    width: 1px;
    background: var(--v-theme-outline-variant);
    opacity: 0.6;
  }
}
</style>
