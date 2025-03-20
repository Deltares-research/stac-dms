<script setup lang="ts">
import { type Ref, ref, watch } from "vue"

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  XIcon,
} from "lucide-vue-next"
import {
  CalendarDate,
  type DateValue,
  isEqualMonth,
  today,
  getLocalTimeZone,
} from "@internationalized/date"

import { type DateRange, RangeCalendarRoot, useDateFormatter } from "radix-vue"
import { type Grid, createMonth, toDate } from "radix-vue/date"
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
} from "@/components/ui/range-calendar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "~/lib/utils"

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
  emit("update:modelValue", newValue)
})

const locale = ref("en-US")
const formatter = useDateFormatter(locale.value)

const placeholder = ref(today(getLocalTimeZone())) as Ref<DateValue>
const secondMonthPlaceholder = ref(
  today(getLocalTimeZone()).add({ months: 1 }),
) as Ref<DateValue>

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>
const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  }),
) as Ref<Grid<DateValue>>

function updateMonth(reference: "first" | "second", months: number) {
  if (reference === "first") {
    placeholder.value = placeholder.value.add({ months })
  } else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    })
  }
}

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    })
  }
})

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  })
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 })
})
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <div class="relative">
        <Button
          size="sm"
          variant="outline"
          :class="
            cn(
              'justify-start text-left font-normal pr-8',
              !value && 'text-muted-foreground',
            )
          "
        >
          <CalendarIcon class="mr-2 size-3.5" />
          <template v-if="value.start">
            <template v-if="value.end">
              {{
                formatter.custom(toDate(value.start), {
                  dateStyle: "medium",
                })
              }}
              -
              {{
                formatter.custom(toDate(value.end), {
                  dateStyle: "medium",
                })
              }}
            </template>

            <template v-else>
              {{
                formatter.custom(toDate(value.start), {
                  dateStyle: "medium",
                })
              }}
            </template>
          </template>
          <template v-else> Pick a date </template>
        </Button>
        <button
          @click="value = { start: undefined, end: undefined }"
          class="absolute right-0 top-0 h-full flex items-center justify-center w-8 hover:bg-gray-100 px-1 rounded"
        >
          <XIcon class="size-3.5" />
        </button>
      </div>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <RangeCalendarRoot
        v-slot="{ weekDays }"
        v-model="value"
        v-model:placeholder="placeholder"
        class="p-3"
      >
        <div
          class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('first', -1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div :class="cn('text-sm font-medium')">
                {{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
              </div>
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('first', 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-full"
                  >
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(weekDates, index) in firstMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger
                      :day="weekDate"
                      :month="firstMonth.value"
                    />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('second', -1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>
              <div :class="cn('text-sm font-medium')">
                {{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
              </div>

              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                  )
                "
                @click="updateMonth('second', 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-full"
                  >
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(weekDates, index) in secondMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger
                      :day="weekDate"
                      :month="secondMonth.value"
                    />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
        </div>
      </RangeCalendarRoot>
    </PopoverContent>
  </Popover>
</template>
