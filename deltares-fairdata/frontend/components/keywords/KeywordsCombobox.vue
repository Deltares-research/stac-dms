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

let { name, closeOnSelect = true } = defineProps<{
  name: string
  closeOnSelect?: boolean
}>()

let value = defineModel<string[]>({
  default: [],
})

defineEmits<{
  (event: "update:modelValue", payload: string[]): void
}>()

let open = ref(false)

function toggleKeyword(keyword: string) {
  if (value.value.includes(keyword)) {
    value.value = value.value.filter((k) => k !== keyword)
  } else {
    value.value = [...value.value, keyword]
  }
}

let { data: keywordGroups } = await useApi("/keywords")

let keywordsById = computed(() =>
  keywordGroups.value?.reduce(
    (acc, group) => {
      group.keywords.forEach((keyword) => {
        acc[keyword.id] = keyword
      })
      return acc
    },
    {} as Record<string, any>,
  ),
)

function filterFunction(vals: string[], term: string) {
  console.log(vals, term)
  return vals.filter((id) => {
    const kw = keywordsById.value?.[id]
    return (
      kw?.en_keyword?.toLowerCase().includes(term.toLowerCase()) ||
      kw?.nl_keyword?.toLowerCase().includes(term.toLowerCase())
    )
  })
}
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
        v-for="keyword in value"
        @click="toggleKeyword(keyword)"
        :key="keyword"
        class="inline-flex items-center bg-gray-200 rounded text-primary-background px-2 py-1 text-xs"
      >
        {{ keywordsById?.[keyword]?.nl_keyword }}
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
          Add keyword
          <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0 PopoverContent" align="start">
        <Command :filter-function="filterFunction">
          <CommandInput class="h-9" placeholder="Search keyword..." />
          <CommandEmpty>No keywords found.</CommandEmpty>
          <CommandList>
            <CommandGroup v-for="group in keywordGroups">
              <CommandItem
                v-for="keyword in group.keywords"
                :key="keyword.id"
                :value="keyword.id"
                @select="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      toggleKeyword(ev.detail.value)
                    }
                    if (closeOnSelect) {
                      open = false
                    }
                  }
                "
              >
                <div class="">
                  <div class="text-[10px] text-muted-foreground">
                    {{ group.group_name_nl }}
                  </div>
                  {{ keyword.nl_keyword }}
                </div>
                <Check
                  :class="
                    cn(
                      'ml-auto h-4 w-4',
                      value.includes(keyword.id) ? 'opacity-100' : 'opacity-0',
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
