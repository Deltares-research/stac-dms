<template>
  <v-sheet class="d-flex flex-column">
    <!-- Header Section -->
    <div class="pa-4">
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-space-between align-end">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Registered data
            </h1>
            <p class="text-body-2 text-grey-darken-1">
              List of datasets registrations, which you are allowed to edit.
            </p>
          </div>
          <v-btn
            color="grey-darken-1"
            variant="flat"
            prepend-icon="mdi-plus"
            class="text-white"
            to="/register/create"
          >
            Register new dataset
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
        :items="paginatedDatasets"
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

        <!-- Storage location column -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.storageLocation`]="{ item }">
          <span>{{ item.storageLocation || '—' }}</span>
        </template>

        <!-- Date column -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #[`item.date`]="{ item }">
          <span>{{ formatDate(item.date) }}</span>
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

      <!-- Pagination -->
      <div v-if="!store.isLoading && !store.error" class="d-flex justify-end align-center mt-4">
        <v-btn
          :disabled="!store.hasPreviousPage"
          variant="outlined"
          class="mr-2"
          @click="previousPage"
        >
          Previous
        </v-btn>
        <v-btn
          :disabled="!store.hasNextPage"
          variant="outlined"
          @click="nextPage"
        >
          Next
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import dateFormat from 'dateformat'
  import { useRegisterStore } from '~/stores/register'

  // Component name for Vue linting
  defineOptions({
    name: 'RegisterIndexPage'
  })

  // Store
  const store = useRegisterStore()

  // Table configuration
  const headers = [
    { title: 'Title', key: 'title', sortable: true },
    { title: 'Description', key: 'description', sortable: true },
    { title: 'Domain', key: 'domain', sortable: true },
    { title: 'Storage location', key: 'storageLocation', sortable: true },
    { title: 'Date', key: 'date', sortable: true },
    { title: '', key: 'edit', sortable: false },
    { title: '', key: 'delete', sortable: false }
  ]

  const sortByOptions = ref([{ key: 'date', order: 'desc' }])

  // Handle sort updates from Vuetify data table
  function handleSortUpdate(value) {
    if (value && value.length > 0) {
      const firstSort = value[0]
      sortByOptions.value = [{ key: firstSort.key, order: firstSort.order || 'asc' }]
    } else {
      sortByOptions.value = []
    }
  }

  // Map STAC items to table format
  const mappedDatasets = computed(() => {
    return store.items.map(item => ({
      id: item.id,
      title: item.properties?.title || '—',
      description: item.properties?.description || '—',
      domain: item.collection || '—',
      storageLocation: item.properties?.storagelocation || '—',
      date: item.properties?.datetime ? new Date(item.properties.datetime) : null,
      // Keep original item for edit/delete operations
      _original: item
    }))
  })

  // Computed properties
  const sortedDatasets = computed(() => {
    const data = [...mappedDatasets.value]
    if (sortByOptions.value.length === 0) {
      return data
    }

    const sortKey = sortByOptions.value[0].key
    const isDesc = sortByOptions.value[0].order === 'desc'

    return data.sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      // Handle date comparison
      if (sortKey === 'date') {
        aVal = aVal ? aVal.getTime() : 0
        bVal = bVal ? bVal.getTime() : 0
      } else {
        // String comparison
        aVal = (aVal || '').toString().toLowerCase()
        bVal = (bVal || '').toString().toLowerCase()
      }

      if (aVal < bVal) return isDesc ? 1 : -1
      if (aVal > bVal) return isDesc ? -1 : 1
      return 0
    })
  })

  const itemsPerPage = computed(() => store.itemsPerPage)

  const paginatedDatasets = computed(() => {
    // Since we're using API pagination, we show all items from current page
    // The API already returns paginated results
    return sortedDatasets.value
  })

  // Methods
  function formatDate(date) {
    if (!date) return '—'
    return dateFormat(date, 'dd-mm-yyyy HH:MM:ss')
  }

  async function previousPage() {
    await store.previousPage()
  }

  async function nextPage() {
    await store.nextPage()
  }

  function handleEdit(item) {
    console.log('Edit item:', item)
    // TODO: Navigate to edit page using item.id or item._original
  }

  function handleDelete(item) {
    console.log('Delete item:', item)
    // TODO: Implement delete functionality using item.id or item._original
  }

  // Fetch items on mount
  onMounted(async () => {
    await store.fetchItems()
  })
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
