<template>
  <Popover id="language" v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-fit min-w-[200px] justify-between"
      >
        {{
          value
            ? options.find((option) => option.value === value)?.label
            : "Select ..."
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search ..." />
        <CommandEmpty>No items found</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    value = ev.detail.value
                  }
                  open = false
                }
              "
            >
              {{ option.label }}
              <Check
                :class="
                  cn(
                    'ml-auto h-4 w-4',
                    value === option.value ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-vue-next"
import { ref, watch } from "vue"
import type { DropDownOption } from "@/lib/dropDownOption"

interface Props {
  options: DropDownOption[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
})
const emit = defineEmits(["update:modelValue"])
const open = ref(false)
const value = ref(props.modelValue)

watch(value, (newValue) => {
  emit("update:modelValue", newValue)
})
</script>

<style scoped></style>
