<template>
  <Card class="w-9/10 p-10">
    <CardHeader>
      <CardTitle>{{ cardTitle }}</CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="emitChange">
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="name">Name</Label>
            <Input
              v-if="readonly"
              id="name"
              v-model="name"
              placeholder="Name of your collection"
              readonly
            />
            <Input
              v-if="!readonly"
              id="name"
              v-model="name"
              placeholder="Name of your collection"
            />
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="description">Description</Label>
            <Textarea
              v-if="readonly"
              id="description"
              v-model="description"
              readonly
            />
            <Textarea v-if="!readonly" id="description" v-model="description" />
            <div class="flex flex-col space-y-1.5">
              <Label for="description">Collection type</Label>
              <CustomDropDownComponent
                id="collectionType"
                :options="collectionType"
                v-model="selectedCollectionType"
              />
            </div>
          </div>
        </div>
      </form>
      <p v-if="errors" class="text-red-500">{{ errors }}</p>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline">
        <NuxtLink to="/collections">Cancel</NuxtLink>
      </Button>
      <Button @click="emitChange">{{ buttonTitle }}</Button>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import type { Collection } from "@/lib/collection"
import { collectionTypes } from "@/lib/collectionTypes"
import { ref } from "vue"

const emit = defineEmits(["update"])

const props = defineProps({
  cardTitle: String,
  title: String,
  description: String,
  collectionType: String,
  buttonTitle: String,
  errors: String,
  readonly: Boolean,
})

const name = ref(props.title ?? "")
const description = ref(props.description ?? "")
const selectedCollectionType = ref(props.collectionType)

const collectionType = collectionTypes

function emitChange() {
  const newCollection: Collection = {
    title: name.value,
    description: description.value,
    collectionType: selectedCollectionType.value,
  }
  emit("update", newCollection)
}
</script>
