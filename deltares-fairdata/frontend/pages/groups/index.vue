<template>
  <v-sheet class="d-flex flex-column">
    <!-- Header Section -->
    <div class="header-container pa-4">
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-space-between align-end">
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">
              Groups
            </h1>
            <p class="text-body-2 text-grey-darken-1">
              List of groups, which you are allowed to edit.
            </p>
          </div>
          <v-btn
            color="grey-darken-1"
            variant="flat"
            prepend-icon="mdi-plus"
            class="text-white"
            to="/groups/create"
          >
            Add new group
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
      <div v-else class="table-container">
        <v-data-table
          :headers="headers"
          :items="mappedGroups"
          :items-per-page="itemsPerPage"
          :page="1"
          class="elevation-0 flex-grow-1 groups-table"
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
    </div>
  </v-sheet>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useGroupsStore } from '~/stores/groups'

  // Component name for Vue linting
  defineOptions({
    name: 'GroupsIndexPage'
  })

  // Router
  const router = useRouter()
  const route = useRoute()

  // Store
  const store = useGroupsStore()

  // Table configuration
  const headers = [
    { title: 'Name', key: 'name', sortable: true },
    { title: 'Description', key: 'description', sortable: true },
    { title: '', key: 'edit', sortable: false },
    { title: '', key: 'delete', sortable: false }
  ]

  const sortByOptions = ref([{ key: 'name', order: 'asc' }])
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

  // Map groups to table format
  const mappedGroups = computed(() => {
    return store.groups.map(group => ({
      id: group.id,
      name: group.name || '—',
      description: group.description || '—',
      // Keep original group for edit/delete operations
      _original: group
    }))
  })

  // Methods
  function handleEdit(item) {
    router.push(`/groups/${item.id}/edit`)
  }

  function handleDelete(item) {
    router.push(`/groups/${item.id}/delete`)
  }

  // Fetch items on mount
  onMounted(async () => {
    await store.fetchGroupsList()
  })

  // Watch the route path to refresh data
  watch(
    () => route.path,
    (newPath, oldPath) => {
      if (newPath === '/groups' && oldPath && oldPath !== '/groups') {
        store.fetchGroupsList()
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

  .header-container {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  .table-container {
    width: 100%;
    max-width: 870px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  :deep(.groups-table) {
    width: 100%;
  }

  :deep(.v-data-table) {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>

