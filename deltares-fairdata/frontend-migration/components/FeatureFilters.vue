<template>
  <v-sheet variant="outlined" class="rounded-lg filters-root" ref="rootEl">
    <!-- Header -->
    <v-toolbar flat density="comfortable">
      <v-btn
        icon
        class="ml-1"
        @click="expanded = !expanded"
        :aria-label="expanded ? 'Collapse filters' : 'Expand filters'"
      >
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>

      <v-icon start class="mr-2">mdi-filter</v-icon>
      <span class="text-subtitle-1 font-weight-medium">Filter</span>

      <v-divider vertical class="mx-3" />

      <v-btn variant="text" density="comfortable" @click="clear">
        Clear selections
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
          @click:close="clearOne(chip.key)"
          class="mb-1"
        >
          {{ chip.label }}: {{ chip.value }}
        </v-chip>
      </div>

      <v-spacer />

      <!-- Sort (stub) -->
      <v-menu content-class="filters-portal">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            density="comfortable"
            append-icon="mdi-menu-down"
          >
            Sort by
          </v-btn>
        </template>
        <v-list>
          <v-list-item value="title-asc">Title (A–Z)</v-list-item>
          <v-list-item value="date-desc">Date (newest)</v-list-item>
          <v-list-item value="date-asc">Date (oldest)</v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- Floating expanded content (overlays the rest) -->
    <v-expand-transition>
      <div v-show="expanded" class="filters-popover elevation-8 rounded-b-lg">
        <v-divider />

        <v-container fluid class="py-4">
          <!-- Free search (above the other filters) -->
          <v-row class="mb-4">
            <v-col cols="12">
              <form @submit.prevent="applyQuery">
                <div class="d-flex align-center ga-2">
                  <v-text-field
                    v-model="tempQuery"
                    variant="outlined"
                    placeholder="Search title or description"
                    hide-details
                    clearable
                    class="flex-grow-1"
                    @click:clear="tempQuery = ''; applyQuery()"
                  />
                  <v-btn type="submit">
                    Search
                  </v-btn>
                </div>
              </form>
            </v-col>
          </v-row>

          <v-row>
            <!-- Domain (collection) -->
            <v-col cols="12" md="4" class="filter-col">
              <div class="text-subtitle-2 mb-2">Domain</div>
              <v-radio-group v-model="local.collection" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio
                  v-for="opt in (options.collection || [])"
                  :key="`col-${opt}`"
                  :label="labelFor('collection', opt)"
                  :value="opt"
                />
              </v-radio-group>
            </v-col>

            <!-- Keyword -->
            <v-col cols="12" md="4" class="filter-col">
              <div class="text-subtitle-2 mb-2">Keyword</div>
              <v-radio-group v-model="local.keyword" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio
                  v-for="opt in (options.keyword || [])"
                  :key="`kw-${opt}`"
                  :label="labelFor('keyword', opt)"
                  :value="opt"
                />
              </v-radio-group>
            </v-col>

            <!-- Start & End date (buttons open date pickers) -->
            <v-col cols="12" md="4" class="filter-col">
              <!-- Start date -->
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="text-subtitle-2">Start date</div>
                <v-btn
                  v-if="local.startDate"
                  size="x-small"
                  variant="text"
                  @click="local.startDate = ''"
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
                    <v-icon start>mdi-calendar</v-icon>
                    {{ local.startDate ? labelFor('startDate', local.startDate) : 'Pick a date' }}
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
                    <v-btn variant="text" @click="startMenu = false">Cancel</v-btn>
                    <v-btn variant="flat" @click="applyStart">Apply</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>

              <!-- End date -->
              <div class="d-flex align-center justify-space-between mt-6 mb-2">
                <div class="text-subtitle-2">End date</div>
                <v-btn
                  v-if="local.endDate"
                  size="x-small"
                  variant="text"
                  @click="local.endDate = ''"
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
                    <v-icon start>mdi-calendar</v-icon>
                    {{ local.endDate ? labelFor('endDate', local.endDate) : 'Pick a date' }}
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
                    <v-btn variant="text" @click="endMenu = false">Cancel</v-btn>
                    <v-btn variant="flat" @click="applyEnd">Apply</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script setup>
import { reactive, ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      query: '',        // <— NEW free-search text
      collection: 'any',
      keyword: 'any',
      startDate: '',    // ISO 'YYYY-MM-DD'
      endDate: '',      // ISO 'YYYY-MM-DD'
    }),
  },
  options: {
    type: Object,
    default: () => ({
      collection: [],
      keyword: [],
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const expanded = ref(false)
const rootEl = ref(null)

const local = reactive({
  query: props.modelValue.query ?? '',
  collection: props.modelValue.collection ?? 'any',
  keyword: props.modelValue.keyword ?? 'any',
  startDate: props.modelValue.startDate ?? '',
  endDate: props.modelValue.endDate ?? '',
})

/* --- Free search (apply on button / enter) --- */
const tempQuery = ref(local.query || '')
watch(() => local.query, (v) => { if (v !== tempQuery.value) tempQuery.value = v })
function applyQuery () {
  local.query = (tempQuery.value || '').trim()
}

/* --- Date menus state --- */
const startMenu = ref(false)
const endMenu = ref(false)
const tempStart = ref('')
const tempEnd = ref('')

watch(startMenu, (open) => { if (open) tempStart.value = local.startDate || '' })
watch(endMenu,   (open) => { if (open) tempEnd.value   = local.endDate   || '' })

function applyStart () {
  local.startDate = tempStart.value || ''
  startMenu.value = false
}
function applyEnd () {
  local.endDate = tempEnd.value || ''
  endMenu.value = false
}

watch(local, (val) => emit('update:modelValue', { ...val }), { deep: true })
watch(() => props.modelValue, (v) => Object.assign(local, v || {}), { deep: true })

function clear () {
  Object.assign(local, { query: '', collection: 'any', keyword: 'any', startDate: '', endDate: '' })
  tempQuery.value = ''
}
function clearOne (key) {
  if (!(key in local)) return
  if (key === 'startDate' || key === 'endDate') local[key] = ''
  else if (key === 'query') { local.query = ''; tempQuery.value = '' }
  else local[key] = 'any'
}

const FIELD_LABEL = {
  query: 'Search',
  collection: 'Domain',
  keyword: 'Keyword',
  startDate: 'Start date',
  endDate: 'End date',
}
const humanDateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
function labelFor (key, value) {
  if (key === 'startDate' || key === 'endDate') {
    if (!value) return ''
    const d = new Date(value)
    return isNaN(d) ? value : humanDateFmt.format(d)
  }
  return value
}

const activeChips = computed(() =>
  Object.entries(local)
    .filter(([k, v]) =>
      (k === 'startDate' || k === 'endDate') ? !!v :
      (k === 'query' ? (v && v.trim() !== '') : v && v !== 'any')
    )
    .map(([k, v]) => ({
      key: k,
      label: FIELD_LABEL[k] || k,
      value: k === 'query' ? v : labelFor(k, v),
    }))
)

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
