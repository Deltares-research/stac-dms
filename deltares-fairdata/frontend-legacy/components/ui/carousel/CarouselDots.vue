<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue"
import { useCarousel } from "./useCarousel"
import { cn } from "@/lib/utils"
import type { EmblaCarouselType as CarouselApi } from "embla-carousel"

interface CarouselDotsProps {
  class?: string
}

const props = withDefaults(defineProps<CarouselDotsProps>(), {})

const { carouselApi } = useCarousel()

const selectedIndex = ref(0)
const scrollSnaps = ref<number[]>([])

const onSelect = (api: CarouselApi) => {
  selectedIndex.value = api.selectedScrollSnap()
}

const onInit = (api: CarouselApi) => {
  scrollSnaps.value = api.scrollSnapList()
}

const scrollTo = (index: number) => {
  carouselApi.value?.scrollTo(index)
}

watch(
  carouselApi,
  (api) => {
    if (!api) return

    onInit(api)
    onSelect(api)
    api.on("reInit", onInit)
    api.on("reInit", onSelect)
    api.on("select", onSelect)
  },
  { immediate: true },
)
</script>

<template>
  <div :class="cn('flex justify-center gap-2 mt-4', props.class)">
    <button
      v-for="(_, index) in scrollSnaps"
      :key="index"
      :class="
        cn(
          'w-2 h-2 rounded-full transition-all duration-200',
          selectedIndex === index
            ? 'bg-primary scale-125'
            : 'bg-muted-foreground/30 hover:bg-muted-foreground/60',
        )
      "
      @click="scrollTo(index)"
      :aria-label="`Go to slide ${index + 1}`"
    />
  </div>
</template>
