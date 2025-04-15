<script setup lang="ts">
import type { DateRange } from "radix-vue"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import { DateFormatter, getLocalTimeZone } from "@internationalized/date"
import { CalendarIcon } from "lucide-vue-next"
import { type Ref, ref } from "vue"

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
})

const emit = defineEmits<{
  (event: "update:modelValue", payload: DateRange): void
}>()

const props = defineProps<{
  modelValue?: DateRange
}>()

const value = ref(
  props.modelValue ?? {
    start: undefined,
    end: undefined,
  },
) as Ref<DateRange>

watch(value, (newValue) => {
  if (newValue.start && newValue.end) {
    emit("update:modelValue", newValue)
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] h-9 justify-start text-left font-normal',
            !value && 'text-muted-foreground',
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <template v-if="value.start">
          <template v-if="value.end">
            {{ df.format(value.start.toDate(getLocalTimeZone())) }} -
            {{ df.format(value.end.toDate(getLocalTimeZone())) }}
          </template>

          <template v-else>
            {{ df.format(value.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>
        <template v-else> Pick a date </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="value" initial-focus :number-of-months="2" />
    </PopoverContent>
  </Popover>
</template>
