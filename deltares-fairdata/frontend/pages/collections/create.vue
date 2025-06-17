<script setup lang="ts">
import CollectionCardForm from "@/components/collections/CollectionCardForm.vue"
import { useRouter } from "nuxt/app"
import { ref } from "vue"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { toast } from "~/components/ui/toast"
import { usePermissions } from "@/composables/permissions"
import Alert from "~/components/Alert.vue"
import { collectionFormSchema } from "~/schemas/collection"
import { Loader2Icon } from "lucide-vue-next"

const { hasPermission } = await usePermissions()

const errors = ref("")

let createCollectionFormSchema = toTypedSchema(collectionFormSchema)

let createCollectionForm = useForm({
  validationSchema: createCollectionFormSchema,
})

let onSubmitCreateCollectionForm = createCollectionForm.handleSubmit(
  async (values) => {
    const { error } = await useApi("/collections", {
      method: "POST",
      body: {
        type: "Collection",
        stac_version: "1.0.0",
        stac_extensions: [],
        id: values.title,
        title: values.title,
        description: values.description,
        keywords: [values.collectionType],
        license: "proprietary",
        extent: {
          spatial: {
            bbox: [[-180, -56, 180, 83]],
          },
          temporal: {
            interval: [[]],
          },
        },
        links:
          values.keywordsFacility !== "No keywords"
            ? [
                {
                  rel: "keywords",
                  href: "/facilities/" + values.keywordsFacility,
                  type: "application/json",
                  id: values.keywordsFacility,
                },
              ]
            : [],
      },
    })

    if (error.value) {
      errors.value =
        (error.value?.data?.detail as unknown as string) ??
        "Something went wrong"
      return
    }

    toast({
      title: "Collection created",
    })

    const router = useRouter()
    router.push("/collections")
  },
)

const isSubmitting = computed(() => createCollectionForm.isSubmitting.value)
</script>

<template>
  <div class="py-8 container mx-auto">
    <div class="max-w-[700px] mx-auto">
      <div v-if="!hasPermission('collection:create')">
        <Alert message="You do not have permission to create collections" />
      </div>

      <form v-else @submit="onSubmitCreateCollectionForm">
        <h1 class="text-2xl font-semibold mb-4">Create a new collection</h1>
        <Alert :message="errors" />

        <CollectionCardForm />

        <Button
          type="submit"
          class="mt-5 min-w-[120px]"
          :disabled="isSubmitting"
        >
          <Loader2Icon v-if="isSubmitting" class="animate-spin size-4 mr-1.5" />
          Create
        </Button>
      </form>
    </div>
  </div>
</template>
