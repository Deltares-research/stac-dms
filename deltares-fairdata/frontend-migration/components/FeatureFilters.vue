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

            <!-- Start date (button opens date picker) -->
            <v-col cols="12" md="4" class="filter-col">
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
                v-model="dateMenu"
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
                    v-model="tempDate"
                    show-adjacent-months
                    elevation="0"
                  />
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="dateMenu = false">Cancel</v-btn>
                    <v-btn variant="flat" @click="applyDate">Apply</v-btn>
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
      collection: 'any',
      keyword: 'any',
      startDate: '', // ISO 'YYYY-MM-DD' or empty when not set
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
  collection: props.modelValue.collection ?? 'any',
  keyword: props.modelValue.keyword ?? 'any',
  startDate: props.modelValue.startDate ?? '',
})

/* --- Start date menu state --- */
const dateMenu = ref(false)
const tempDate = ref('')

watch(dateMenu, (open) => {
  if (open) tempDate.value = local.startDate || ''
})

function applyDate () {
  local.startDate = tempDate.value || ''
  dateMenu.value = false
}

watch(local, (val) => emit('update:modelValue', { ...val }), { deep: true })
watch(() => props.modelValue, (v) => Object.assign(local, v || {}), { deep: true })

function clear () {
  Object.assign(local, { collection: 'any', keyword: 'any', startDate: '' })
}
function clearOne (key) {
  if (key in local) {
    local[key] = key === 'startDate' ? '' : 'any'
  }
}

const FIELD_LABEL = { collection: 'Domain', keyword: 'Keyword', startDate: 'Start date' }
const humanDateFmt = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
function labelFor (key, value) {
  if (key === 'startDate') {
    if (!value) return ''
    const d = new Date(value)
    return isNaN(d) ? value : humanDateFmt.format(d)
  }
  return value
}

const activeChips = computed(() =>
  Object.entries(local)
    .filter(([k, v]) => (k === 'startDate' ? !!v : v && v !== 'any'))
    .map(([k, v]) => ({
      key: k,
      label: FIELD_LABEL[k] || k,
      value: labelFor(k, v),
    }))
)

/* ---- Click outside to collapse ---- */
function onDocPointerDown (e) {
  if (!expanded.value) return
  const root = rootEl.value?.$el ?? rootEl.value
  const target = e.target
  if (root && root.contains(target)) return
  // Ignore clicks inside teleported menus (sort + date picker)
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
