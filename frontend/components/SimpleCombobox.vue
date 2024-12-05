<script setup lang="ts" generic="T extends { id: string }">
import { ref } from "vue"
import { Check, ChevronsUpDown, X } from "lucide-vue-next"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "~/lib/utils"

let props = defineProps<{
  name: string
  items: T[]
  titleProperty: keyof T
  subtitleProperty?: keyof T
  placeholder: string
  trigger: string
  commandEmpty: string
  modelValue?: string[]
}>()

let emit = defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

let value = computed({
  get: () => props.modelValue ?? [],
  set: (newValue) => emit("update:modelValue", newValue),
})

let open = ref(false)

function toggleItem(itemId: string) {
  if (value.value.includes(itemId)) {
    value.value = value.value.filter((id) => id !== itemId)
  } else {
    value.value = [...value.value, itemId]
  }
}

let itemsById = computed(() =>
  props.items.reduce(
    (acc, item) => {
      acc[item.id] = item

      return acc
    },
    {} as Record<string, T>,
  ),
)
</script>

<style lang="css" scoped>
.PopoverContent {
  width: var(--radix-popover-trigger-width);
  max-height: var(--radix-popover-content-available-height);
}
</style>

<template>
  <input
    v-for="val in modelValue"
    type="hidden"
    :name="name"
    :modelValue="val"
  />
  <div class="relative w-full flex flex-col gap-1.5">
    <div class="flex gap-1.5" v-if="value.length">
      <button
        v-for="itemId in value"
        @click="toggleItem(itemId)"
        :key="itemId"
        class="inline-flex items-center bg-gray-200 rounded text-primary-background px-2 py-1 text-xs"
      >
        {{ itemsById?.[itemId]?.[titleProperty] }}
        <X class="size-4 ml-1" />
      </button>
    </div>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="justify-between w-full"
        >
          {{ trigger }}
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0 PopoverContent">
        <Command>
          <CommandInput class="h-9" :placeholder="placeholder" />
          <CommandEmpty>{{ commandEmpty }}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="item in items"
                :key="item.id"
                :value="item.id"
                @select="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      toggleItem(ev.detail.value)
                    }
                    open = false
                  }
                "
              >
                <div class="">
                  <div
                    class="text-[10px] text-muted-foreground"
                    v-if="subtitleProperty"
                  >
                    {{ (item as T)[subtitleProperty] }}
                  </div>
                  {{ (item as T)[titleProperty] }}
                </div>
                <Check
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      value.includes(item.id) ? 'opacity-100' : 'opacity-0',
                    )
                  "
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
