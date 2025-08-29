<template>
  <div style="overflow: visible;">
    <div class="d-flex align-center mb-4">
      <h1 class="mr-2 my-0">Deltares Data Storage Finder</h1>
      <v-btn
        icon
        variant="text"
        @click="openInfo"
      >
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </div>

    <div v-if="hasAnswers" class="mb-4">
      <v-btn color="primary" variant="outlined" @click="resetAnswers" class="elevation-2">
        <v-icon start>mdi-reload</v-icon>
        Clear Answers
      </v-btn>
    </div>

    <v-radio-group v-model="app.answers.q1" class="elevation-2" column label="Do you want to store, transfer or archive your data?">
      <v-radio label="Store" value="store" />
      <v-radio label="Transfer" value="transfer" />
      <v-radio label="Archive" value="archive" />
    </v-radio-group>

    <v-radio-group
      v-model="app.answers.q2"
      class="elevation-2"
      :class="{ 'q-disabled': !q2Enabled }"
      column
      :disabled="!q2Enabled"
      label="Do you want to share your data with external parties?"
    >
      <v-radio label="Yes" value="share-yes" />
      <v-radio label="No, internal use" value="share-no" />
    </v-radio-group>

    <v-radio-group
      v-model="app.answers.q3"
      class="elevation-2"
      :class="{ 'q-disabled': !q3Enabled }"
      column
      :disabled="!q3Enabled"
      label="Do you want to collaborate/co-create on your data?"
    >
      <v-radio label="No" value="collaborate-no" />
      <v-radio label="Yes, internally" value="collaborate-internal" />
      <v-radio label="Yes, externally" value="collaborate-external" />
    </v-radio-group>

    <v-radio-group v-model="app.answers.q4" class="elevation-2" column label="Will the total amount of data exceed 5TB?">
      <v-radio label="No, less than 5TB" value="size-no" />
      <v-radio label="Yes, 5TB or more" value="size-yes" />
    </v-radio-group>

    <v-radio-group v-model="app.answers.q5" class="elevation-2" column label="Do you have additional requirements around data confidentiality?">
      <v-radio label="Yes" value="confidentiality-yes" />
      <v-radio label="No" value="confidentiality-no" />
    </v-radio-group>

    <v-radio-group v-model="app.answers.q6" class="elevation-2" column label="From where do you want to access your data?">
      <v-radio label="Not applicable" value="access-na" />
      <v-radio label="H7" value="access-h7" />
      <v-radio label="External compute facilities" value="access-external" />
    </v-radio-group>

    <div class="elevation-2 qgroup">
      <div class="qgroup__label v-label">How do you want to interface with your data?</div>
      <v-checkbox v-model="app.answers.q7" label="HTTP(s) / API" value="interface-http" />
      <v-checkbox v-model="app.answers.q7" label="Network share" value="interface-network" />
      <v-checkbox v-model="app.answers.q7" label="Web visualization" value="interface-web" />
      <v-checkbox v-model="app.answers.q7" label="Jupyter Notebooks" value="interface-jupyter" style="margin-bottom: -15px;" />
    </div>

    <v-dialog v-model="infoDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>Deltares Data Storage Finder</span>
          <v-spacer />
          <v-btn icon variant="text" @click="infoDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div v-if="loadingInfo" class="py-6">
            <v-progress-linear indeterminate />
          </div>
          <div v-else class="pl-5">
            <MarkdownView :source="infoMd" />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>

  import { computed, ref, watch } from 'vue'
  import MarkdownView from '@/components/MarkdownView.vue'
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()

  const infoDialog = ref(false)
  const infoMd = ref('')
  const loadingInfo = ref(false)

  async function openInfo () {
    infoDialog.value = true
    loadingInfo.value = true
    infoMd.value = ''

    try {
      const mod = await import('@/content/info.md?raw')
      infoMd.value = typeof mod === 'string' ? mod : (mod.default ?? '')
      if (!infoMd.value) throw new Error('Empty markdown')
    } catch {
      infoMd.value = '_No information available yet._'
    } finally {
      loadingInfo.value = false
    }
  }

  const rules = {
    q2: a => a.q1 === 'store',
    q3: a => a.q1 === 'store',
  }

  function isEnabled (key) {
    const rule = rules[key]
    return rule ? !!rule(app.answers) : true
  }

  const q2Enabled = computed(() => isEnabled('q2'))
  const q3Enabled = computed(() => isEnabled('q3'))

  /** Auto-clear answers when their question becomes disabled */
  watch(q2Enabled, enabled => {
    if (!enabled && app.answers.q2) app.answers.q2 = ''
  })
  watch(q3Enabled, enabled => {
    if (!enabled && app.answers.q3) app.answers.q3 = ''
  })

  const hasAnswers = computed(() =>
    Object.values(app.answers).some(v =>
      Array.isArray(v) ? v.length > 0 : v !== ''
    )
  )

  function resetAnswers() {
    app.answers.q1 = ''
    app.answers.q2 = ''
    app.answers.q3 = ''
    app.answers.q4 = ''
    app.answers.q5 = ''
    app.answers.q6 = ''
    app.answers.q7 = []
  }

</script>

<style scoped>

:deep(.v-radio .v-label) {
  font-size: 0.85rem;
}

:deep(.v-radio) {
  margin-bottom: -0.5rem;
}

:deep(.v-radio-group) {
  margin-bottom: 1.4rem;
  margin-right: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 12px 20px 0px 12px;
}

:deep(.v-radio-group .v-label) {
  white-space: normal;
  line-height: 1.25;
}

.q-disabled {
  opacity: 0.4;
  filter: grayscale(1);
}

.qgroup {
  margin-bottom: 1.4rem;
  margin-right: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 12px 20px 4px 12px;
}

.qgroup__label {
  margin-inline-start: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  white-space: normal;
  line-height: 1.25;
}

:deep(.v-checkbox .v-label) {
  white-space: normal;
  line-height: 1.25;
  font-size: 0.85rem;
}

:deep(.v-checkbox) {
  margin-bottom: -2.7rem;
  margin-left: 0.5rem;
}

</style>
