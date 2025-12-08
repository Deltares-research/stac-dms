<script setup lang="ts">
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

let { name } = defineProps<{
  name: string
}>()

let value = defineModel<string[]>({
  default: [],
})

defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

let open = ref(false)

function toggleCollection(keyword: string) {
  if (value.value.includes(keyword)) {
    value.value = value.value.filter((k) => k !== keyword)
  } else {
    value.value = [...value.value, keyword]
  }
}

let { data: collections } = await useApi("/collections")

let collectionsById = computed(() =>
  collections.value?.collections.reduce(
    (acc, collection) => {
      acc[collection.id] = collection

      return acc
    },
    {} as Record<string, (typeof collections.value.collections)[number]>,
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
  <input v-for="val in value" type="hidden" :name="name" :value="val" />
  <div class="relative w-fit flex flex-col gap-1.5">
    <div class="flex gap-1.5" v-if="value.length">
      <button
        v-for="collectionId in value"
        @click="toggleCollection(collectionId)"
        :key="collectionId"
        class="inline-flex items-center bg-gray-200 rounded text-primary-background px-2 py-1 text-xs"
      >
        {{ collectionsById?.[collectionId]?.title }}
        <X class="size-4 ml-1" />
      </button>
    </div>
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          :aria-expanded="open"
          class="justify-between w-full"
        >
          Add domain
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0 PopoverContent">
        <Command>
          <CommandInput class="h-9" placeholder="Search domain..." />
          <CommandEmpty>No domains found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandItem
                v-for="collection in collections?.collections"
                :key="collection.id"
                :value="collection.id"
                @select="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      toggleCollection(ev.detail.value)
                    }
                    open = false
                  }
                "
              >
                <div class="">
                  <div class="text-[10px] text-muted-foreground">
                    {{ collection.description }}
                  </div>
                  {{ collection.title }}
                </div>
                <Check
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      value.includes(collection.id)
                        ? 'opacity-100'
                        : 'opacity-0',
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
