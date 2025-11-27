<template>
  <v-sheet class="d-flex flex-column">
    <!-- Header Section -->
    <div class="pa-4">
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-space-between align-end">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Domains
            </h1>
            <p class="text-body-2 text-grey-darken-1">
              List of data sets domains, which you are allowed to edit.
            </p>
          </div>
          <v-btn
            color="grey-darken-1"
            variant="flat"
            prepend-icon="mdi-plus"
            class="text-white"
            to="/domains/create"
          >
            Add domain
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="flex-grow-1 d-flex flex-column py-4 px-6" style="min-height: 0;">
      <!-- Loading state -->
      <div
        v-if="store.isLoading"
        class="d-flex justify-center align-center"
        style="min-height: 200px;"
      >
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>

      <!-- Error state -->
      <div v-else-if="store.error" class="d-flex justify-center align-center pa-4">
        <v-alert type="error" variant="tonal">
          {{ store.error }}
        </v-alert>
      </div>

      <!-- Data table -->
      <v-data-table
        v-else
        :headers="headers"
        :items="mappedDomains"
        :items-per-page="itemsPerPage"
        :page="1"
        class="elevation-0 flex-grow-1"
        hide-default-footer
        :sort-by="sortByOptions"
        @update:sort-by="handleSortUpdate"
      >
        <!-- Description column with truncation -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.description`]="{ item }">
          <span
            class="text-truncate"
            style="max-width: 300px; display: inline-block;"
            :title="item.description"
          >
            {{ item.description }}
          </span>
        </template>

        <!-- Keywords column -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.keywords`]="{ item }">
          <span>{{ item.keywords || 'No keywords' }}</span>
        </template>

        <!-- Edit column -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.edit`]="{ item }">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-pencil"
            class="text-capitalize"
            @click.stop="handleEdit(item)"
          >
            Edit
          </v-btn>
        </template>

        <!-- Delete column -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.delete`]="{ item }">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-delete"
            class="text-capitalize"
            @click.stop="handleDelete(item)"
          >
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </v-sheet>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useDomainsStore } from '~/stores/domains'
  import { fetchFacilities } from '~/requests/collections'

  // Component name for Vue linting
  defineOptions({
    name: 'DomainsIndexPage'
  })

  // Router
  const router = useRouter()
  const route = useRoute()

  // Store
  const store = useDomainsStore()

  // Facilities for keywords lookup
  const facilities = ref([])

  // Table configuration
  const headers = [
    { title: 'Title', key: 'title', sortable: true },
    { title: 'Description', key: 'description', sortable: true },
    { title: 'Keywords', key: 'keywords', sortable: false },
    { title: '', key: 'edit', sortable: false },
    { title: '', key: 'delete', sortable: false }
  ]

  const sortByOptions = ref([{ key: 'title', order: 'asc' }])
  const itemsPerPage = ref(10)

  // Handle sort updates from Vuetify data table
  function handleSortUpdate(value) {
    if (value && value.length > 0) {
      const firstSort = value[0]
      sortByOptions.value = [{ key: firstSort.key, order: firstSort.order || 'asc' }]
    } else {
      sortByOptions.value = []
    }
  }

  // Map collections to table format
  const mappedDomains = computed(() => {
    return store.collections.map(collection => {
      // Find keywords facility
      const keywordsLink = collection.links?.find(item => item.rel === 'keywords')
      let keywordsName = 'No keywords'
      if (keywordsLink?.id) {
        const facility = facilities.value.find(f => f.id === keywordsLink.id)
        keywordsName = facility?.name || 'No keywords'
      }

      return {
        id: collection.id,
        title: collection.title || collection.id || '—',
        description: collection.description || '—',
        keywords: keywordsName,
        // Keep original collection for edit/delete operations
        _original: collection
      }
    })
  })

  // Computed properties
  const sortedDomains = computed(() => {
    const data = [...mappedDomains.value]
    if (sortByOptions.value.length === 0) {
      return data
    }

    const sortKey = sortByOptions.value[0].key
    const isDesc = sortByOptions.value[0].order === 'desc'

    return data.sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      // String comparison
      aVal = (aVal || '').toString().toLowerCase()
      bVal = (bVal || '').toString().toLowerCase()

      if (aVal < bVal) return isDesc ? 1 : -1
      if (aVal > bVal) return isDesc ? -1 : 1
      return 0
    })
  })

  // Methods
  function handleEdit(item) {
    router.push(`/domains/${item.id}/edit`)
  }

  function handleDelete(item) {
    router.push(`/domains/${item.id}/delete`)
  }

  // Fetch items on mount
  onMounted(async () => {
    await Promise.all([
      store.fetchDomains(),
      fetchFacilities().then(data => {
        facilities.value = data || []
      }).catch(err => {
        console.error('Failed to fetch facilities:', err)
        facilities.value = []
      })
    ])
  })

  // Watch the route path to refresh data
  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (newPath === '/domains' && oldPath && oldPath !== '/domains') {
        store.fetchDomains()
      }
    },
    { immediate: false }
  )
</script>

<style scoped>
  .text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :deep(.v-data-table) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>

