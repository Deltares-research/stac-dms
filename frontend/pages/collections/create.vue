<template>
  <div class="justify-end">
    <CollectionCardForm
      button-title="Create"
      card-title="Create a new collection"
      @update="createCollection"
      :errors="errors"
      collectionType="experimentalFacility"
      keywordFacility="No keywords"
    />
  </div>
</template>

<script setup lang="ts">
import type { Collection } from "@/lib/collection"
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
import { useNuxtApp, useRouter } from "nuxt/app"
import { ref } from "vue"

const errors = ref("")
const { $api } = useNuxtApp()
const title = ref("")
const description = ref("")

async function createCollection(emitedCollection: Collection) {
  const newCollection = {
    type: "Collection",
    stac_version: "1.0.0",
    id: emitedCollection.title,
    title: emitedCollection.title,
    description: emitedCollection.description,
    keywords: [emitedCollection.collectionType],
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
  if (emitedCollection.keywordsFacility !== "No keywords") {
    newCollection.links.push({
      rel: "keywords",
      href: "/facilities/" + emitedCollection.keywordsFacility,
      type: "application/json",
      id: emitedCollection.keywordsFacility,
    })
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
