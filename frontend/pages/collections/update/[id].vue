<template>
  <div class="justify-end">
    <CollectionCardForm
      card-title="Edit collection"
      button-title="update"
      :errors="errors"
      @update="updateCollection"
      :title="title"
      :description="description"
      :collectionType="selectedCollectionType"
      :keywordFacility="selectedKeywordsFacility"
    />
  </div>
</template>

<script setup lang="ts">
import type { Collection } from "@/lib/collection"
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
import { useNuxtApp, useRoute, useRouter } from "nuxt/app"
import { ref } from "vue"

const { $api } = useNuxtApp()

const errors = ref("")
const title = ref("")
const description = ref("")
const selectedCollectionType = ref("")
const selectedKeywordsFacility = ref("")

const route = useRoute()
const data = await $api("/collections/{collection_id}", {
  path: {
    collection_id: route.params.id,
  },
})
title.value = data.title
description.value = data.description
selectedCollectionType.value = data.keywords[0]
const keywordsLink = data.links.find((item) => item.rel == "keywords")
selectedKeywordsFacility.value =
  keywordsLink !== undefined ? keywordsLink.id : "No keywords"

async function updateCollection(emitedCollection: Collection) {
  const updatedCollection = {
    type: "Collection",
    stac_version: "1.0.0",
    id: data.id,
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
    updatedCollection.links.push({
      rel: "keywords",
      href: "/facilities/" + emitedCollection.keywordsFacility,
      type: "application/json",
      id: emitedCollection.keywordsFacility,
    })
  }
  try {
    errors.value = ""
    const data = await $api("/collections/{id}", {
      method: "PUT",
      path: {
        id: route.params.id,
      },
      body: updatedCollection,
    })
  } catch (e) {
    errors.value = "It was not possible to update the collection"
    return
  }

  const router = useRouter()
  router.push("/collections")
}
</script>

<style scoped></style>
