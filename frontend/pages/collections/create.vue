<template>
  <div class="justify-end">
    <CollectionCard
      button-title="Create"
      card-title="Create a new collection"
      @update="createCollection"
      :errors="errors"
    />
  </div>
</template>

<script setup lang="ts">
import CollectionCard from "@/components/collections/CollectionCard.vue"
import type { Collection } from "@/lib/collection"

const errors = ref("")
const { $api } = useNuxtApp()
const title = ref("")
const description = ref("")

async function createCollection(emitedCollection: Collection) {
  console.log(emitedCollection)
  const newCollection = {
    type: "Collection",
    stac_version: "1.0.0",
    id: emitedCollection.title,
    title: emitedCollection.title,
    description: emitedCollection.description,
    license: "proprietary",
    extent: {
      spatial: {
        bbox: [[-180, -56, 180, 83]],
      },
      temporal: {
        interval: [[]],
      },
    },
    links: [],
  }
  try {
    errors.value = ""
    const data = await $api("/collections", {
      method: "POST",
      body: newCollection,
    })
  } catch (e) {
    errors.value = "It was not possible to create the collection"
    return
  }

  const router = useRouter()
  router.push("/collections")
}
</script>

<style scoped></style>