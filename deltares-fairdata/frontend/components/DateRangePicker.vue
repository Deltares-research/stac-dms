<script setup lang="ts">
import type { DateRange } from "radix-vue"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import { CalendarIcon, XIcon } from "lucide-vue-next"
import { type Ref, ref, watch, computed, nextTick } from "vue"
import { CalendarDate, type DateValue } from "@internationalized/date"

const emit = defineEmits<{
  (event: "update:modelValue", payload: DateRange): void
}>()

const props = defineProps<{
  modelValue?: DateRange
  onClear?: () => void
}>()

const value = ref(
  props.modelValue ?? {
    start: undefined,
    end: undefined,
  },
) as Ref<DateRange>

// For typed inputs
const startDateInput = ref("")
const endDateInput = ref("")

// Input element references for focus management
const startInputRef = ref<HTMLInputElement | null>(null)
const endInputRef = ref<HTMLInputElement | null>(null)

// Format in dd/mm/yyyy
const formatDate = (date: DateValue | undefined): string => {
  if (!date) return ""
  const day = date.day.toString().padStart(2, "0")
  const month = date.month.toString().padStart(2, "0")
  const year = date.year.toString()
  return `${day}/${month}/${year}`
}

// Parse dd/mm/yyyy format
const parseInputDate = (input: string): CalendarDate | undefined => {
  if (!input || input.length !== 10) return undefined

  const parts = input.split("/")
  if (parts.length !== 3) return undefined

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return undefined
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000)
    return undefined

  try {
    return new CalendarDate(year, month, day)
  } catch (e) {
    return undefined
  }
}

// Initialize inputs with current value
watch(
  () => value.value,
  (newValue) => {
    if (newValue.start) {
      startDateInput.value = formatDate(newValue.start)
    }
    if (newValue.end) {
      endDateInput.value = formatDate(newValue.end)
    }
  },
  { immediate: true },
)

// Update value when inputs change
const updateFromInputs = () => {
  const start = parseInputDate(startDateInput.value)
  const end = parseInputDate(endDateInput.value)

  value.value = { start, end }

  console.log("updateFromInputs", { start, end })
  emit("update:modelValue", { start, end })
}

watch(startDateInput, updateFromInputs)
watch(endDateInput, updateFromInputs)

// Watch for a complete start date to auto-focus end date
watch(startDateInput, (newValue) => {
  // Check if the start date is completely entered (10 characters for dd/mm/yyyy)
  if (newValue.length === 10 && endInputRef.value) {
    // Focus the end date input after the next DOM update
    nextTick(() => {
      endInputRef.value?.focus()
    })
  }
})

// Create visual overlays for the inputs that show placeholder characters
const startDatePlaceholderHTML = computed(() => {
  if (!startDateInput.value) return "DD/MM/YYYY"

  const template = "DD/MM/YYYY"
  let result = ""

  for (let i = 0; i < template.length; i++) {
    if (i < startDateInput.value.length) {
      // Use the same character but with a class to make it transparent
      result += `<span class="invisible">${startDateInput.value[i]}</span>`
    } else {
      result += template[i]
    }
  }

  return result
})

const endDatePlaceholderHTML = computed(() => {
  if (!endDateInput.value) return "DD/MM/YYYY"

  const template = "DD/MM/YYYY"
  let result = ""

  for (let i = 0; i < template.length; i++) {
    if (i < endDateInput.value.length) {
      // Use the same character but with a class to make it transparent
      result += `<span class="invisible">${endDateInput.value[i]}</span>`
    } else {
      result += template[i]
    }
  }

  return result
})

// Automatically format input as user types
const processDateInput = (event: Event, inputType: "start" | "end") => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, "") // Keep only digits

  if (!value) {
    if (inputType === "start") {
      startDateInput.value = ""
    } else {
      endDateInput.value = ""
    }
    return
  }

  let result = ""

  if (value.length <= 2) {
    // Handle day part
    result = value

    // Auto-advance to month if day is 3-9
    if (value.length === 1 && parseInt(value, 10) > 3) {
      result = value.padStart(2, "0") + "/"
    }
  } else if (value.length <= 4) {
    // Handle day + month
    const day = value.substring(0, 2)
    const month = value.substring(2)

    result = day + "/" + month

    // Auto-advance to year if month is > 1
    if (month.length === 1 && parseInt(month, 10) > 1) {
      result = day + "/" + month.padStart(2, "0") + "/"
    }
  } else {
    // Handle full date
    const day = value.substring(0, 2)
    const month = value.substring(2, 4)
    const year = value.substring(4, 8)

    result = day + "/" + month + "/" + year
  }

  if (inputType === "start") {
    startDateInput.value = result
  } else {
    endDateInput.value = result
  }
}

// When calendar selection changes, update the input fields
watch(value, (newValue) => {
  if (newValue.start) {
    startDateInput.value = formatDate(newValue.start)
  }
  if (newValue.end) {
    endDateInput.value = formatDate(newValue.end)
  }
})
</script>

<template>
  <div class="date-range-picker flex items-center relative font-mono">
    <!-- Main container with inputs -->
    <div
      class="relative px-3 flex-1 flex items-center border rounded overflow-hidden pr-12"
    >
      <!-- Start date input -->
      <div class="relative w-24">
        <input
          ref="startInputRef"
          type="text"
          v-model="startDateInput"
          @input="(e) => processDateInput(e, 'start')"
          class="w-full py-2 text-sm focus:outline-none focus:ring-0 border-0 relative z-10"
          maxlength="10"
        />
        <div
          class="absolute inset-0 flex items-center pointer-events-none py-2 text-sm text-gray-400"
          v-html="startDatePlaceholderHTML"
        ></div>
      </div>

      <!-- Separator -->
      <div class="flex items-center pl-1 pr-4 text-gray-500">
        <span>-</span>
      </div>

      <!-- End date input -->
      <div class="relative w-24">
        <input
          ref="endInputRef"
          type="text"
          v-model="endDateInput"
          @input="(e) => processDateInput(e, 'end')"
          class="w-full py-2 text-sm focus:outline-none focus:ring-0 border-0 relative z-10"
          maxlength="10"
        />
        <div
          class="absolute inset-0 flex items-center pointer-events-none py-2 text-sm text-gray-400"
          v-html="endDatePlaceholderHTML"
        ></div>
      </div>

      <!-- Calendar picker as add-on -->
      <Popover>
        <PopoverTrigger as-child>
          <button class="h-full py-2 px-3 bg-gray-50 absolute right-0">
            <CalendarIcon class="size-4 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <RangeCalendar v-model="value" initial-focus :number-of-months="2" />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        @click="onClear"
        v-if="onClear"
        class="-mr-4"
      >
        <XIcon class="size-4" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.date-range-picker {
  height: 36px; /* Consistent height across the component */
}

.date-range-picker:focus-within .flex-1 {
  border-color: hsl(var(--primary));
  outline: 2px solid hsla(var(--primary), 0.2);
  outline-offset: 0;
}

input {
  background: transparent;
  color: inherit;
}

.invisible {
  color: transparent;
}

.absolute {
  text-wrap: none;
  white-space: pre;
}
</style>
