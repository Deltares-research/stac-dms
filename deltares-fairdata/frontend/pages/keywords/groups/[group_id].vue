<template>
  <div v-if="keywordGroup">
    <div class="text-uppercase text-caption text-grey-darken-1 font-weight-bold mb-3">
      Keyword Group
    </div>
    
    <div class="d-flex align-center justify-space-between mb-4 gap-2">
      <UpdateKeywordGroup
        :group="keywordGroup"
        @updated="handleUpdate"
      />
      <DeleteKeywordGroup
        :group-id="keywordGroup.id"
      />
    </div>
    
    <v-list class="mb-6" density="compact">
      <v-list-item
        v-for="keyword in keywordGroup.keywords"
        :key="keyword.id"
        class="border-b"
      >
        <Keyword
          :keyword="keyword"
          @deleted="handleDelete"
          @updated="handleUpdate"
        />
      </v-list-item>
    </v-list>

    <v-divider class="my-8" />

    <h2 class="text-h6 font-weight-medium mb-4">
      Create keyword
    </h2>
    
    <v-alert
      v-if="successMessage"
      type="success"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="successMessage = ''"
    >
      {{ successMessage }}
    </v-alert>
    
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = null"
    >
      {{ error }}
    </v-alert>
    
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-text-field
        ref="nlInputRef"
        v-model="formData.nl_keyword"
        label="Keyword NL"
        variant="outlined"
        density="compact"
        :rules="[rules.required, rules.minLength]"
        class="mb-3"
        autofocus
      />
      
      <v-text-field
        v-model="formData.en_keyword"
        label="Keyword EN"
        variant="outlined"
        density="compact"
        :rules="[rules.required, rules.minLength]"
        class="mb-3"
      />
      
      <v-text-field
        v-model="formData.external_id"
        label="External ID (optional)"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      
      <v-btn
        type="submit"
        color="primary"
        :loading="isSubmitting"
        :disabled="!isFormValid"
      >
        Create
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchKeywordsByGroupId, createKeyword } from '~/requests/keywords'
  import UpdateKeywordGroup from '~/components/keywords/UpdateKeywordGroup.vue'
  import DeleteKeywordGroup from '~/components/keywords/DeleteKeywordGroup.vue'
  import Keyword from '~/components/keywords/Keyword.vue'

  defineOptions({
    name: 'KeywordsGroupDetailPage'
  })

  const route = useRoute()
  const groupId = route.params.group_id
  const keywordGroup = ref(null)
  const formRef = ref(null)
  const nlInputRef = ref(null)
  const isSubmitting = ref(false)
  const successMessage = ref('')
  const error = ref(null)
  
  const formData = ref({
    nl_keyword: '',
    en_keyword: '',
    external_id: ''
  })

  const rules = {
    required: (v) => !!v || 'This field is required',
    minLength: (v) => (v && v.length >= 2) || 'Must be at least 2 characters'
  }

  const isFormValid = computed(() => {
    return formData.value.nl_keyword.length >= 2 &&
      formData.value.en_keyword.length >= 2
  })

  async function loadKeywordGroup() {
    try {
      const data = await fetchKeywordsByGroupId(groupId)
      keywordGroup.value = data?.[0] || null
    } catch (err) {
      console.error('Error loading keyword group:', err)
      keywordGroup.value = null
    }
  }

  async function handleSubmit() {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    isSubmitting.value = true
    successMessage.value = ''
    error.value = null
    
    try {
      await createKeyword({
        ...formData.value,
        group_id: groupId
      })
      successMessage.value = 'Keyword created'
      formData.value = {
        nl_keyword: '',
        en_keyword: '',
        external_id: ''
      }
      await loadKeywordGroup()
      await nextTick()
      nlInputRef.value?.$el?.querySelector('input')?.focus()
    } catch (err) {
      error.value = err?.data?.detail || err?.message || 'Failed to create keyword'
    } finally {
      isSubmitting.value = false
    }
  }

  function handleUpdate() {
    loadKeywordGroup()
  }

  function handleDelete() {
    loadKeywordGroup()
  }

  onMounted(async () => {
    await loadKeywordGroup()
  })

  watch(
    () => route.params.group_id,
    async (newId) => {
      if (newId) {
        await loadKeywordGroup()
      }
    }
  )
</script>

<style scoped>
  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
  
  .border-b:last-child {
    border-bottom: none;
  }
</style>

