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
          >
            Register new dataset
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <div class="flex-grow-1 d-flex flex-column py-4 px-6" style="min-height: 0;">
      <v-data-table
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
      <div class="d-flex justify-end align-center mt-4">
        <v-btn
          :disabled="currentPage === 1"
          variant="outlined"
          class="mr-2"
          @click="previousPage"
        >
          Previous
        </v-btn>
        <v-btn
          :disabled="currentPage >= totalPages"
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
  import { ref, computed } from 'vue'
  import dateFormat from 'dateformat'

  // Component name for Vue linting
  defineOptions({
    name: 'RegisterIndexPage'
  })

  // Dummy data matching the image examples
  const dummyDatasets = [
    {
      id: 1,
      title: '51651',
      description: '16651',
      domain: 'test',
      storageLocation: '',
      date: new Date('2025-11-06T12:16:30')
    },
    {
      id: 2,
      title: 'zandmotor',
      description: 'Measurement of dune development',
      domain: 'flumes',
      storageLocation: '',
      date: new Date('2025-01-15T01:00:00')
    },
    {
      id: 3,
      title: 'hoge snelheidslijn barendrecht (fictief)',
      description: 'Resultaten van funderingsberekening...',
      domain: 'flumes',
      storageLocation: '',
      date: new Date('2025-02-11T01:00:00')
    },
    {
      id: 4,
      title: 'cone penetration test zwolle area',
      description: 'Short description Hanzeweg en Delft...',
      domain: 'flumes',
      storageLocation: '',
      date: new Date('2025-03-06T01:00:00')
    },
    {
      id: 5,
      title: 'determine waterflow conditions delft-area',
      description: 'This is data related to a magnificent ...',
      domain: 'flumes',
      storageLocation: '',
      date: new Date('2025-03-25T01:00:00')
    },
    {
      id: 6,
      title: 'idlab: flood data analysis',
      description: 'iDlab Deltares project to analyse how...',
      domain: 'flumes',
      storageLocation: '',
      date: new Date('2024-12-18T01:00:00')
    },
    {
      id: 7,
      title: 'test dataset 7',
      description: 'Another test dataset for demonstration purposes',
      domain: 'flumes',
      storageLocation: 's3://bucket/path',
      date: new Date('2025-04-10T14:30:00')
    },
    {
      id: 8,
      title: 'test dataset 8',
      description: 'Yet another dataset with a longer description that should be truncated properly',
      domain: 'test',
      storageLocation: '',
      date: new Date('2025-05-20T09:15:00')
    }
  ]

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

  const itemsPerPage = ref(10)
  const currentPage = ref(1)
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

  // Computed properties
  const sortedDatasets = computed(() => {
    const data = [...dummyDatasets]
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

  const totalPages = computed(() => {
    return Math.ceil(sortedDatasets.value.length / itemsPerPage.value)
  })

  const paginatedDatasets = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedDatasets.value.slice(start, end)
  })

  // Methods
  function formatDate(date) {
    if (!date) return '—'
    return dateFormat(date, 'dd-mm-yyyy HH:MM:ss')
  }

  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function handleEdit(item) {
    console.log('Edit item:', item)
    // TODO: Navigate to edit page
  }

  function handleDelete(item) {
    console.log('Delete item:', item)
    // TODO: Implement delete functionality
  }
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
