<script setup lang="ts">
import Container from "~/components/deltares/Container.vue"
import ItemDetailView from "~/components/items/ItemDetailView.vue"

const route = useRoute()
const id = String(route.params.id) // Convert to string to fix the type error

let { data: items } = await useApi("/search", {
  query: { ids: id },
})

let item = computed(() => {
  let { type, stac_version, stac_extensions, ...rest } =
    items.value?.features?.[0] ?? {}
  return rest
})
</script>

<template>
  <Container class="py-8">
    <ItemDetailView :item="item" />
  </Container>
</template>
