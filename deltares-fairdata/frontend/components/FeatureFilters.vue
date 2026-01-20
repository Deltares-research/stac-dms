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
      <div
        v-if="activeChips.length"
        class="active-chips-container"
      >
        <v-chip
          v-for="chip in activeChips"
          :key="chip.key"
          size="x-small"
          variant="flat"
          closable
          class="mb-1 filter-chip"
          @click:close="clearOne(chip.key)"
        >
          <span class="filter-chip-text">{{ chip.label }}: {{ chip.value }}</span>
        </v-chip>
      </div>
    </v-toolbar>

    <!-- Expanded content (pushes content down) -->
    <v-expand-transition>
      <div v-show="expanded" class="filters-expanded rounded-b-lg">
        <v-divider />

        <v-container fluid class="py-4">
          <v-row class="filter-row">
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
                item-value="id"
                return-object
                multiple
                chips
                prepend-inner-icon="mdi-magnify"
                placeholder="Search domain..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
                class="filter-autocomplete"
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
                    <!-- Remove the v-list-item-title since item-title="title" already handles it -->
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
                item-title="name"
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
                class="filter-autocomplete"
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
                :items="store.keywords"
                item-title="nl_keyword"
                item-value="id"
                return-object
                multiple
                chips
                prepend-inner-icon="mdi-magnify"
                placeholder="Search keyword..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
                class="filter-autocomplete"
                @update:model-value="handleKeywordChange"
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
                    <!-- Remove the v-list-item-title since item-title="nl_keyword" already handles it -->
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  {{ item.raw.nl_keyword || item.raw.en_keyword || item.raw.id }}
                </template>
              </v-autocomplete>
            </v-col>

            <!-- Start & End date (buttons open date pickers) -->
            <v-col
              cols="12"
              md="12"
              class="filter-col"
            >
              <v-row>
                <!-- Start date -->
                <v-col cols="6">
                  <div class="text-subtitle-2 mb-2">
                    Start date
                  </div>

                  <v-menu
                    v-model="startMenu"
                    :close-on-content-click="false"
                    content-class="filters-portal"
                    location="bottom start"
                    :offset="8"
                  >
                    <template #activator="{ props }">
                      <div class="d-flex align-center ga-2">
                        <v-btn
                          v-bind="props"
                          variant="outlined"
                          block
                          class="flex-grow-1"
                        >
                          <v-icon start>
                            mdi-calendar
                          </v-icon>
                          <span class="filter-date-text">{{ store.startDate ? labelFor('startDate', store.startDate) : 'Pick a date' }}</span>
                        </v-btn>
                        <v-btn
                          v-if="store.startDate"
                          size="x-small"
                          variant="text"
                          icon
                          @click="store.startDate = undefined"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
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
                </v-col>

                <!-- End date -->
                <v-col cols="6">
                  <div class="text-subtitle-2 mb-2">
                    End date
                  </div>

                  <v-menu
                    v-model="endMenu"
                    :close-on-content-click="false"
                    content-class="filters-portal"
                    location="bottom start"
                    :offset="8"
                  >
                    <template #activator="{ props }">
                      <div class="d-flex align-center ga-2">
                        <v-btn
                          v-bind="props"
                          variant="outlined"
                          block
                          class="flex-grow-1"
                        >
                          <v-icon start>
                            mdi-calendar
                          </v-icon>
                          <span class="filter-date-text">{{ store.endDate ? labelFor('endDate', store.endDate) : 'Pick a date' }}</span>
                        </v-btn>
                        <v-btn
                          v-if="store.endDate"
                          size="x-small"
                          variant="text"
                          icon
                          @click="store.endDate = undefined"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </div>
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
            </v-col>
          </v-row>

          <!-- Include Empty Geometry Checkbox -->
          <v-row>
            <v-col
              cols="12"
              class="filter-col"
            >
              <!--  <v-checkbox
                v-model="store.includeEmptyGeometry"
                label="Include items without geometry"
                hide-details
                density="compact"
              /> -->
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script setup>
  import { ref, watch, computed} from 'vue'
  import { useSearchPageStore } from '~/stores/searchPage'



  const store = useSearchPageStore()
  const expanded = ref(false)
  const rootEl = ref(null)
  

  /* --- Convert store arrays to single values for display --- */
  const selectedCollection = computed({
    get: () => {
      const selected = store.collections.filter(c => c.selected)
      return selected
    },
    set: (value) => {
      if (!value || value.length === 0) {
        store.collections = store.collections.map(c => ({ ...c, selected: false }))
      } else {
        const selectedIds = value.map(v => v.id)
        store.collections = store.collections.map(c => ({
          ...c,
          selected: selectedIds.includes(c.id)
        }))
      }
    },
  })

  function handleCollectionChange(value) {
    if (!value || value.length === 0) {
      store.collections = store.collections.map(c => ({ ...c, selected: false }))
    } else {
      const selectedIds = value.map(v => v.id)
      store.collections = store.collections.map(c => ({
        ...c,
        selected: selectedIds.includes(c.id)
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
    get: () => {
      const selected = store.keywords.filter(k => k.selected)
      return selected
    },
    set: (value) => {
      if (!value || value.length === 0) {
        store.keywords = store.keywords.map(k => ({ ...k, selected: false }))
      } else {
        const selectedIds = value.map(v => v.id)
        store.keywords = store.keywords.map(k => ({
          ...k,
          selected: selectedIds.includes(k.id)
        }))
      }
    },
  })

  function handleKeywordChange(value) {
    if (!value || value.length === 0) {
      store.keywords = store.keywords.map(k => ({ ...k, selected: false }))
    } else {
      const selectedIds = value.map(v => v.id)
      store.keywords = store.keywords.map(k => ({
        ...k,
        selected: selectedIds.includes(k.id)
      }))
    }
  }

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

  function clear () {
    store.q = ''
    store.collections = store.collections.map(c => ({ ...c, selected: false }))
    store.keywords = store.keywords.map(k => ({ ...k, selected: false }))
    store.startDate = undefined
    store.endDate = undefined
    store.includeEmptyGeometry = false
    store.topics = store.topics.map(t => ({ ...t, selected: false }))
    store.bboxFilter = [180, 90, -180, -90]
  }
  function clearOne (key) {
    if (key === 'startDate') {
      store.startDate = undefined
    } else if (key === 'endDate') {
      store.endDate = undefined
    } else if (key === 'query') {
      store.q = ''
    } else if (key.startsWith('collection-')) {
      const collectionId = key.replace('collection-', '')
      store.collections = store.collections.map(c => 
        c.id === collectionId ? { ...c, selected: false } : c
      )
    } else if (key.startsWith('keyword-')) {
      const keywordId = key.replace('keyword-', '')
      store.keywords = store.keywords.map(k => 
        k.id === keywordId ? { ...k, selected: false } : k
      )
    } else if (key === 'includeEmptyGeometry') {
      store.includeEmptyGeometry = false
    } else if (key.startsWith('topic-')) {
      const topicId = key.replace('topic-', '')
      store.topics = store.topics.map(t => 
        t.id === topicId ? { ...t, selected: false } : t
      )
    } else if (key === 'area') {
      // Clear area filter by resetting bbox to default
      store.bboxFilter = [180, 90, -180, -90]
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
      const selected = store.collections.filter(c => c.selected)
      selected.forEach(collection => {
        chips.push({ key: `collection-${collection.id}`, label: FIELD_LABEL.collection, value: collection.title })
      })
    }
    
    if (store.keywords && store.keywords.length > 0) {
      const selectedKeywords = store.keywords.filter(k => k.selected)
      selectedKeywords.forEach(keyword => {
        chips.push({ 
          key: `keyword-${keyword.id}`, 
          label: FIELD_LABEL.keyword, 
          value: keyword.nl_keyword || keyword.en_keyword || keyword.id 
        })
      })
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
    
    // Show area chip if bbox filter is active (not default)
    const defaultBbox = [180, 90, -180, -90]
    if (store.bboxFilter &&
      (store.bboxFilter[0] !== defaultBbox[0] ||
        store.bboxFilter[1] !== defaultBbox[1] ||
        store.bboxFilter[2] !== defaultBbox[2] ||
        store.bboxFilter[3] !== defaultBbox[3])) {
      chips.push({ key: 'area', label: FIELD_LABEL.area, value: 'Selected' })
    }
    
    return chips
  })

</script>

<style scoped>
.filters-root {
  position: relative;
  border: 1px solid var(--v-theme-outline-variant);
}
.filters-expanded {
  background: #fff;
  border: 1px solid var(--v-theme-outline-variant);
  border-top: none;
}

/* Ensure toolbar handles overflow properly */
.filters-root :deep(.v-toolbar) {
  overflow: visible;
  flex-wrap: wrap;
  min-height: auto;
}

.filters-root :deep(.v-toolbar__content) {
  overflow: visible;
  min-width: 0;
  max-width: 100%;
  padding-top: 12px;
  padding-bottom: 12px;
}

.filters-root :deep(.v-spacer) {
  flex: 1 1 auto;
  min-width: 0;
}

/* Simple styling for all autocomplete fields - keep them consistent */
.filter-autocomplete {
  width: 100%;
}

.filter-selection-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 100%;
}

/* Date button text overflow */
.filter-date-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  flex: 1;
  min-width: 0;
}

/* Ensure date buttons handle text overflow properly */
.filters-expanded :deep(.v-btn) {
  min-width: 0;
}

.filters-expanded :deep(.v-btn__content) {
  overflow: hidden;
  width: 100%;
  min-width: 0;
  justify-content: flex-start;
}

/* Fix text overflow in active filter chips - flexible sizing */
.active-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-right: 8px;
  min-width: 0;
  flex: 1 1 0;
  overflow: hidden;
}

.filter-chip {
  flex: 1 1 0;
  min-width: 55px;
  max-width: 100%;
}

.filter-chip :deep(.v-chip__content) {
  overflow: hidden;
  min-width: 0;
  flex: 1;
  max-width: 100%;
}

.filter-chip-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 100%;
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
