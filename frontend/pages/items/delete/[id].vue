<template>
  <Card class="w-9/10 p-10">
    <CardHeader>
      <CardTitle>Are you sure you want to delete this registration?</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="deleteItem">
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label>Title</Label>
            <Label>{{ feature.properties.title }}</Label>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label>Description</Label>
            <Label>{{ feature.properties.description }}</Label>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label>Date</Label>
            <Label>{{ feature.properties.datetime }}</Label>
          </div>
        </div>
      </form>
      <p v-if="errors" class="text-red-500">{{ errors }}</p>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline">
        <NuxtLink to="/items">Cancel</NuxtLink>
      </Button>
      <Button @click="deleteItem">Delete</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { ref } from "vue"

const route = useRoute()

const { $api } = useNuxtApp()
let { data: item } = await useApi("/search?ids=" + route.params.id)
const feature = item.value.features[0]

const errors = ref("")
const title = ref("")
const description = ref("")

async function deleteItem() {
  try {
    errors.value = ""
    const data = await $api("/collections/{collection}/items/{id}", {
      method: "DELETE",
      path: {
        id: route.params.id,
        collection: item.value.features[0].collection,
      },
    })
  } catch (e) {
    errors.value = "It was not possible to delete the collection"
    return
  }
  const router = useRouter()
  router.push("/items")
}
</script>

<style scoped></style>
