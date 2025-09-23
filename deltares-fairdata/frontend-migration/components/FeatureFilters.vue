<template>
  <v-sheet variant="outlined" class="rounded-lg filters-root">
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

      <v-btn
        variant="text"
        density="comfortable"
        @click="clear"
      >
        Clear selections
      </v-btn>

      <v-spacer />

      <!-- Sort (stub) -->
      <v-menu>
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
      <div
        v-show="expanded"
        class="filters-popover elevation-8 rounded-b-lg"
      >
        <v-divider />

        <v-container fluid class="py-4">
          <v-row>
            <!-- Collection -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Collection</div>
              <v-radio-group v-model="local.collection" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio label="Flumes" value="Flumes" />
                <v-radio label="Test" value="Test" />
              </v-radio-group>
            </v-col>

            <!-- Language -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Language</div>
              <v-radio-group v-model="local.language" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio label="English" value="eng" />
                <v-radio label="Dutch" value="dut" />
              </v-radio-group>
            </v-col>

            <!-- Legal restrictions -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">Legal</div>
              <v-radio-group v-model="local.legal" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio label="License" value="license" />
                <v-radio label="Restricted" value="restricted" />
                <v-radio label="IPR" value="intellectualPropertyRights" />
              </v-radio-group>
            </v-col>

            <!-- Spatial reference system -->
            <v-col cols="12" md="3" class="filter-col">
              <div class="text-subtitle-2 mb-2">SRS</div>
              <v-radio-group v-model="local.srs" density="compact">
                <v-radio label="Any" value="any" />
                <v-radio label="EPSG:25831" value="EPSG:25831" />
                <v-radio
                  label="EPSG:28992"
                  value="EPSG:28992 (Amersfoort / RD New)"
                />
                <v-radio label="Not applicable" value="not applicable" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-expand-transition>
  </v-sheet>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

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
})
const emit = defineEmits(['update:modelValue'])

const expanded = ref(false)

const local = reactive({
  collection: props.modelValue.collection ?? 'any',
  language: props.modelValue.language ?? 'any',
  legal: props.modelValue.legal ?? 'any',
  srs: props.modelValue.srs ?? 'any',
})

watch(local, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

watch(() => props.modelValue, (v) => {
  Object.assign(local, v || {})
}, { deep: true })

function clear () {
  Object.assign(local, {
    collection: 'any',
    language: 'any',
    legal: 'any',
    srs: 'any',
  })
}
</script>

<style scoped>
/* The root sheet becomes the positioning context for the floating panel */
.filters-root {
  position: relative;
  z-index: 10;       /* above sibling content */
  overflow: visible; /* let the popover escape the sheet's box */
}

/* The popover floats over the content below, aligned to the sheet's width */
.filters-popover {
  position: absolute;
  top: 100%;   /* start right below the header area */
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--v-theme-outline-variant);
  border-top: none;  /* seamless with the sheet border */
  z-index: 1000;     /* make sure it overlays cards/map */
}

/* Optional: subtle vertical separators on md+ screens */
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
