<template>
    <div class="justify-end">
        <CollectionCard card-title="Edit collection" button-title="update" :errors="errors" @update="updateCollection" :title="title" :description="description"/>
    </div>
</template>


<script setup lang="ts">

import CollectionCard from "@/components/collections/CollectionCard.vue";
import type {Collection} from "@/lib/collection";

const {$api} = useNuxtApp()

const errors = ref("")
const title = ref("");
const description = ref("")

const route = useRoute()
const data = await $api('/collections/{collection_id}', {
    path: {
        collection_id: route.params.id
    }
})
title.value = data.title
description.value = data.description

async function updateCollection(emitedCollection: Collection) {
    const updatedCollection = {
        "type": "Collection",
        "stac_version": "1.0.0",
        "id": data.id,
        "title": emitedCollection.title,
        "description": emitedCollection.description,
        "license": "proprietary",
        "extent": {
            "spatial": {
                "bbox": [
                    [
                        -180,
                        -56,
                        180,
                        83
                    ]
                ]
            },
            "temporal": {
                "interval": [
                    []
                ]
            }
        },
        "links": []
    }
    try {
        errors.value = ""
        const data = await $api('/collections/{id}', {
            method: "PUT",
            path: {
                id: route.params.id
            },
            body: updatedCollection
        })
    } catch (e) {
        errors.value = "It was not possible to update the collection"
        return
    }

    const router = useRouter()
    router.push("/collections")

}
</script>

<style scoped>

</style>