<template>
  <div class="grid-wrap">
    <v-container fluid>
      <v-row>
        <v-col
          v-for="card in app.cards"
          :key="card.id"
          class="d-flex"
          cols="12"
          sm="4"
        >
          <v-card
            class="pb-5 px-4 w-100 storage-card"
            :class="{ 'card-disabled': isGreyed(card) }"
            outlined
            role="button"
            tabindex="0"
            @click="open(card)"
            @keyup.enter.prevent="open(card)"
            @keyup.space.prevent="open(card)"
          >
            <div v-if="isMaybe(card)" class="maybe-badge">
              <v-tooltip text="Contact Data Platform Team" location="top">
                <template #activator="{ props }">
                  <v-icon v-bind="props" icon size="22" class="ma-0 pa-0">
                    mdi-help-circle-outline
                  </v-icon>
                </template>
              </v-tooltip>
            </div>
            <v-card-title>
              {{ card.title }}
            </v-card-title>
            <v-card-subtitle>
              {{ card.subtitle }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div v-if="noMatches" class="no-matches-overlay">
      <div class="no-matches-content">
        <div class="no-matches-message">
          No options available for these filters
        </div>
        <v-btn class="mt-4 elevation-2" variant="outlined" color="primary" @click="openInfo">
          <v-icon start>mdi-email-outline</v-icon>
          Contact your data steward
        </v-btn>
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>{{ dialogTitle }}</span>
          <v-spacer />
          <v-btn icon variant="text" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-subtitle v-if="dialogSubtitle">
          {{ dialogSubtitle }}
        </v-card-subtitle>

        <v-divider />

        <v-card-text>
          <div v-if="loading" class="py-6">
            <v-progress-linear indeterminate />
          </div>
          <div v-else>
            <MarkdownView :source="mdSource" />
          </div>
        </v-card-text>

      </v-card>
    </v-dialog>

    <v-dialog v-model="infoDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <span>Deltares Data Storage Finder</span>
          <v-spacer />
          <v-btn icon variant="text" @click="infoDialog = false" aria-label="Close">
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
  import { computed, ref } from 'vue'
  import { useAppStore } from '@/stores/app'

  const app = useAppStore()

  const dialog = ref(false)
  const selectedCard = ref(null)
  const mdSource = ref('')
  const loading = ref(false)

  function isGreyed(card) {
    const a = app.answers

    const mismatch = (ans, allowList) => {
      if (!ans || (Array.isArray(ans) && ans.length === 0)) return false
      if (!Array.isArray(allowList)) return true

      if (Array.isArray(ans)) {
        return !ans.every(v => allowList.includes(v))
      } else {
        return !allowList.includes(ans)
      }
    }

    const checks = [
      mismatch(a.q1, card.allow.q1),
      mismatch(a.q2, card.allow.q2),
      mismatch(a.q3, card.allow.q3),
      mismatch(a.q4, card.allow.q4),
      mismatch(a.q5, card.allow.q5),
      mismatch(a.q6, card.allow.q6),
      mismatch(a.q7, card.allow.q7),
    ]
    return checks.some(Boolean)
  }

  const noMatches = computed(() => !app.cards.some(card => !isGreyed(card)))

  async function open (card) {
    selectedCard.value = card
    dialog.value = true
    loading.value = true
    mdSource.value = ''

    // Lazy-load md file by card id from src/content/<id>.md
    try {
      const mod = await import(`@/content/${card.id}.md?raw`)
      mdSource.value = typeof mod === 'string' ? mod : (mod.default ?? '')
      if (!mdSource.value) throw new Error('Empty markdown')
    } catch {
      mdSource.value = '_No content available yet for this option._'
    } finally {
      loading.value = false
    }
  }

  const dialogTitle = computed(() => selectedCard.value?.title ?? '')
  const dialogSubtitle = computed(() => selectedCard.value?.subtitle ?? '')

  const infoDialog = ref(false)
  const infoMd = ref('')
  const loadingInfo = ref(false)

  async function openInfo() {
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

  function isMaybe(card) {
    if (isGreyed(card)) return false
    const a = app.answers
    const co = card.contactOn || {}
    const entries = Object.entries(co)
    if (entries.length === 0) return false

    return entries.some(([q, list]) => {
      const ans = a[q]
      if (!ans || !Array.isArray(list) || list.length === 0) return false
      return Array.isArray(ans)
        ? ans.some(v => list.includes(v))
        : list.includes(ans)
    })
  }

</script>

<style scoped>

.grid-wrap {
  position: relative;
  min-height: calc(100vh - 32px);
}

.storage-card {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
}

.card-disabled {
  opacity: 0.4;
  filter: grayscale(1);
}

.no-matches-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.no-matches-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-matches-message {
  color: #000;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.maybe-badge {
  position: absolute;
  top: 8px;
  right: 20px;
  z-index: 1;
}

</style>
