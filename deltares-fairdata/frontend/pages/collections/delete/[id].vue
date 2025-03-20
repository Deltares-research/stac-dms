<template>
  <CollectionCardForm
    buttonTitle="Delete"
    card-title="Are you sure you want to delete this collection?"
    :error="errors"
    :title="title"
    :description="description"
    :collectionType="selectedCollectionType"
    :keywordFacility="selectedKeywordsFacility"
    readonly="true"
    @update="updateCollection"
  />
</template>

<script setup lang="ts">
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
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
  keywordsLink !== undefined ? keywordsLink.id : "No Keywords"

async function updateCollection() {
  try {
    errors.value = ""
    const data = await $api("/collections/{id}", {
      method: "DELETE",
      path: {
        id: route.params.id,
      },
    })
  } catch (e) {
    errors.value = "It was not possible to delete the collection"
    return
  }

  const router = useRouter()
  router.push("/collections")
}
</script>

<style scoped></style>
