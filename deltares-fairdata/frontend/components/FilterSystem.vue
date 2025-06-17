<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { X, ChevronsUpDown, Filter } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import DateRangePicker from "~/components/DateRangePicker.vue"
import KeywordsCombobox from "~/components/keywords/KeywordsCombobox.vue"
import CollectionCombobox from "~/components/collections/CollectionCombobox.vue"
import { Checkbox } from "@/components/ui/checkbox"
import type { DateRange } from "radix-vue"
import dateFormat from "dateformat"

type FilterId = "date" | "keywords" | "collections" | "includeEmptyGeometry"

const availableFilters = [
  { id: "date" as FilterId, label: "Date Range" },
  { id: "keywords" as FilterId, label: "Keywords" },
  { id: "collections" as FilterId, label: "Collections" },
  { id: "includeEmptyGeometry" as FilterId, label: "Include Empty Geometries" },
]

// Props
const props = defineProps<{
  modelValue: {
    date?: DateRange
    keywords?: string[]
    collections?: string[]
    includeEmptyGeometry?: boolean
    q?: string
  }
}>()

// Emits
const emit = defineEmits(["update:modelValue"])

// Local state
const activeFilters = ref<Set<FilterId>>(new Set())
const dropdownOpen = ref(false)
const filterPopovers = ref({
  date: false,
  keywords: false,
  collections: false,
  includeEmptyGeometry: false,
})

// Initialize active filters based on provided values
function initActiveFilters() {
  activeFilters.value.clear()

  if (props.modelValue.date?.start || props.modelValue.date?.end) {
    activeFilters.value.add("date")
  }

  if (props.modelValue.keywords && props.modelValue.keywords.length > 0) {
    activeFilters.value.add("keywords")
  }

  if (props.modelValue.collections && props.modelValue.collections.length > 0) {
    activeFilters.value.add("collections")
  }

  if (props.modelValue.includeEmptyGeometry) {
    activeFilters.value.add("includeEmptyGeometry")
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, initActiveFilters, {
  immediate: true,
  deep: true,
})

const keywordsCount = computed(() => props.modelValue.keywords?.length || 0)

const collectionsCount = computed(
  () => props.modelValue.collections?.length || 0,
)

// Methods
function addFilter(filterId: FilterId) {
  activeFilters.value.add(filterId)
  dropdownOpen.value = false

  // Open the popover for the newly added filter
  filterPopovers.value[filterId] = true

  if (filterId === "includeEmptyGeometry") {
    // Automatically set includeEmptyGeometry to true when the filter is added
    toggleEmptyGeometry(true)
  }
}

function removeFilter(filterId: FilterId) {
  activeFilters.value.delete(filterId)

  // Clear the filter value
  const newValue = { ...props.modelValue }

  if (filterId === "date") {
    newValue.date = undefined
  } else if (filterId === "keywords") {
    newValue.keywords = []
  } else if (filterId === "collections") {
    newValue.collections = []
  } else if (filterId === "includeEmptyGeometry") {
    newValue.includeEmptyGeometry = false
  }

  emit("update:modelValue", newValue)
}

function updateDateRange(range: DateRange) {
  emit("update:modelValue", {
    ...props.modelValue,
    date: range,
  })
}

function updateKeywords(keywords: string[]) {
  emit("update:modelValue", {
    ...props.modelValue,
    keywords,
  })
}

function updateCollections(collections: string[]) {
  emit("update:modelValue", {
    ...props.modelValue,
    collections,
  })
}

function toggleEmptyGeometry(checked: boolean) {
  emit("update:modelValue", {
    ...props.modelValue,
    includeEmptyGeometry: checked,
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-2 items-end">
    <!-- Active Filter Badges -->
    <template v-for="filterId in activeFilters" :key="filterId">
      <KeywordsCombobox
        v-if="filterId === 'keywords'"
        name="keywords"
        placeholder="Keywords"
        :model-value="props.modelValue.keywords"
        @update:model-value="updateKeywords"
        :close-on-select="false"
      />

      <CollectionCombobox
        v-if="filterId === 'collections'"
        name="collections"
        placeholder="Collections"
        :model-value="props.modelValue.collections"
        @update:model-value="updateCollections"
      />

      <DateRangePicker
        v-if="filterId === 'date'"
        :model-value="props.modelValue.date"
        @update:model-value="updateDateRange"
      />

      <!-- Include Empty Geometries Filter -->
      <Button
        v-if="filterId === 'includeEmptyGeometry'"
        size="sm"
        @click.prevent
        variant="outline"
      >
        <span class="flex items-center gap-2">
          <Checkbox
            id="includeEmptyGeometry"
            :checked="props.modelValue.includeEmptyGeometry"
            @update:checked="toggleEmptyGeometry"
          />
          <label for="includeEmptyGeometry">Include empty geometries</label>
        </span>
      </Button>
    </template>

    <!-- Add Filter Dropdown -->
    <DropdownMenu v-model:open="dropdownOpen">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter class="h-3.5 w-3.5 mr-2" />
          Add Filter
          <ChevronsUpDown class="h-3.5 w-3.5 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          v-for="filter in availableFilters.filter(
            (f) => !activeFilters.has(f.id),
          )"
          :key="filter.id"
          @click="addFilter(filter.id)"
        >
          {{ filter.label }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
