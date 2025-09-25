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
            <!-- Collection -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Collection</div>
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

            <!-- Language -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Language</div>
              <v-radio-group v-model="local.language" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio
                  v-for="opt in (options.language || [])"
                  :key="`lang-${opt}`"
                  :label="labelFor('language', opt)"
                  :value="opt"
                />
              </v-radio-group>
            </v-col>

            <!-- Legal restrictions -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Legal</div>
              <v-radio-group v-model="local.legal" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio
                  v-for="opt in (options.legal || [])"
                  :key="`legal-${opt}`"
                  :label="labelFor('legal', opt)"
                  :value="opt"
                />
              </v-radio-group>
            </v-col>

            <!-- Spatial reference system -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">SRS</div>
              <v-radio-group v-model="local.srs" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio
                  v-for="opt in (options.srs || [])"
                  :key="`srs-${opt}`"
                  :label="labelFor('srs', opt)"
                  :value="opt"
                />
              </v-radio-group>
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
      language: 'any',
      legal: 'any',
      srs: 'any',
    }),
  },
  options: {
    type: Object,
    default: () => ({
      collection: [],
      language: [],
      legal: [],
      srs: [],
    }),
  },
})
const emit = defineEmits(['update:modelValue'])

const expanded = ref(false)
const rootEl = ref(null)

const local = reactive({
  collection: props.modelValue.collection ?? 'any',
  language: props.modelValue.language ?? 'any',
  legal: props.modelValue.legal ?? 'any',
  srs: props.modelValue.srs ?? 'any',
})

watch(local, (val) => emit('update:modelValue', { ...val }), { deep: true })
watch(() => props.modelValue, (v) => Object.assign(local, v || {}), { deep: true })

function clear () {
  Object.assign(local, { collection: 'any', language: 'any', legal: 'any', srs: 'any' })
}
function clearOne (key) {
  if (key in local) local[key] = 'any'
}

const FIELD_LABEL = { collection: 'Collection', language: 'Language', legal: 'Legal', srs: 'SRS' }
const VALUE_LABEL = {
  language: { eng: 'English', dut: 'Dutch' },
  legal: { license: 'License', restricted: 'Restricted', intellectualPropertyRights: 'IPR' },
}
function labelFor (key, value) { return VALUE_LABEL[key]?.[value] ?? value }

const activeChips = computed(() =>
  Object.entries(local)
    .filter(([, v]) => v && v !== 'any')
    .map(([k, v]) => ({ key: k, label: FIELD_LABEL[k] || k, value: labelFor(k, v) }))
)

/* ---- Click outside to collapse ---- */
function onDocPointerDown (e) {
  if (!expanded.value) return
  const root = rootEl.value?.$el ?? rootEl.value // Vuetify component or native el
  const target = e.target
  // If click is inside the filter, ignore
  if (root && root.contains(target)) return
  // If click is inside teleported menu content, ignore
  if (target?.closest && target.closest('.filters-portal')) return
  expanded.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown, true) // capture phase
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
