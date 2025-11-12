<template>
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col
        cols="12"
        md="10"
        lg="8"
        xl="6"
      >
        <h1 class="text-h4 font-weight-bold mb-4">
          Register a new item
        </h1>

        <form @submit.prevent="handleSubmit">
          <!-- Empty state when no collections are available -->
          <v-card v-if="collections.length === 0" class="mb-4">
            <v-card-text class="d-flex flex-column align-center justify-center py-12 text-center">
              <v-icon
                size="64"
                color="grey"
                class="mb-4"
              >
                mdi-database-off
              </v-icon>
              <h3 class="text-h6 mb-2">
                No collections available
              </h3>
              <p class="text-body-2 text-grey-darken-1 max-width-md mb-4">
                There are no collections you have permission to add items to.
                Please contact your administrator to get access.
              </p>
              <v-btn variant="outlined" to="/register">
                Return to items
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Domain Selection -->
          <v-card v-if="collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Data set domain
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="formData.collectionId"
                :items="collectionOptions"
                label="Domain"
                variant="outlined"
                :loading="isLoadingCollections"
                @update:model-value="handleCollectionChange"
              />
            </v-card-text>
          </v-card>

          <!-- General Information - Always visible but disabled until domain selected -->
          <v-card v-if="collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              General information
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.projectNumber"
                    label="Project number"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.title"
                    label="Project title"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-menu
                    v-model="publicationDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                    :offset="8"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="publicationDateDisplay"
                        label="Publication date"
                        variant="outlined"
                        :disabled="!formData.collectionId"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card>
                      <v-date-picker
                        v-model="formData.properties.publication_datetime"
                        show-adjacent-months
                        elevation="0"
                      />
                      <v-divider />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="publicationDateMenu = false">
                          Cancel
                        </v-btn>
                        <v-btn variant="flat" @click="applyPublicationDate">
                          Apply
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.properties.description"
                    label="Description"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                    rows="3"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.properties.language"
                    :items="languageOptions"
                    label="Language"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.properties.legalRestrictions"
                    :items="legalRestrictionsOptions"
                    label="Legal restrictions"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.properties.restrictionsOfUse"
                    label="Applications for which this data set is not suitable"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                    rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.properties.spatialReferenceSystem"
                    :items="spatialReferenceSystemOptions"
                    label="Spatial reference system"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.spatialReferenceSystemCustom"
                    label="Or define a custom spatial reference system"
                    variant="outlined"
                    :disabled="!formData.collectionId"
                    placeholder="e.g., EPSG:4326"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Data Quality -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Data quality
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="formData.properties.dataQualityInfoStatement"
                label="Description of the origin of this data set"
                variant="outlined"
                rows="3"
              />
            </v-card-text>
          </v-card>

          <!-- Originator Data Set -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Originator data set
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorDataOrganisation"
                    label="Organisation"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorDataEmail"
                    label="E-mail"
                    variant="outlined"
                    type="email"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Originator Meta Data -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Originator meta data
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorMetaDataOrganisation"
                    label="Organisation"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorMetaDataEmail"
                    label="E-mail"
                    variant="outlined"
                    type="email"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Date Range -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Date Range
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                    :offset="8"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="startDateDisplay"
                        label="Start date"
                        variant="outlined"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card>
                      <v-date-picker
                        v-model="tempStartDate"
                        show-adjacent-months
                        elevation="0"
                      />
                      <v-divider />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="startDateMenu = false">
                          Cancel
                        </v-btn>
                        <v-btn variant="flat" @click="applyStartDate">
                          Apply
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    location="bottom start"
                    :offset="8"
                  >
                    <template #activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        v-model="endDateDisplay"
                        label="End date (optional)"
                        variant="outlined"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card>
                      <v-date-picker
                        v-model="tempEndDate"
                        show-adjacent-months
                        elevation="0"
                      />
                      <v-divider />
                      <v-card-actions>
                        <v-spacer />
                        <v-btn variant="text" @click="endDateMenu = false">
                          Cancel
                        </v-btn>
                        <v-btn variant="flat" @click="applyEndDate">
                          Apply
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-col>
              </v-row>
              <p class="text-body-2 text-grey-darken-1 mt-2">
                Select a single date or a date range.
              </p>
            </v-card-text>
          </v-card>

          <!-- Type of Origin -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Type of Origin
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedFacilityType"
                :items="facilityTypeOptions"
                label="Filter by Type of Origin"
                variant="outlined"
                @update:model-value="handleFacilityTypeChange"
              />
            </v-card-text>
          </v-card>

          <!-- Keywords -->
          <v-card v-if="formData.collectionId && filteredKeywordsGroups.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Keywords
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="group in filteredKeywordsGroups"
                  :key="group.id"
                  cols="12"
                  md="4"
                >
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1">
                      {{ group.group_name_en }}
                    </v-card-title>
                    <v-card-text>
                      <v-checkbox
                        v-for="keyword in group.keywords"
                        :key="keyword.id"
                        v-model="selectedKeywords"
                        :value="keyword"
                        :label="keyword.nl_keyword"
                        density="compact"
                        hide-details
                        class="mb-1"
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Storage Location Data Set -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Storage location data set
            </v-card-title>
            <v-card-text>
              <div
                v-for="(asset, assetId) in formData.assets"
                :key="assetId"
                class="mb-4 pb-4 border-b"
              >
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.title"
                      label="Title of the dataset"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.description"
                      label="Description of the dataset"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.href"
                      label="Link to the dataset"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.type"
                      label="Type of dataset (e.g. file type)"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      @click="removeAsset(assetId)"
                    >
                      Remove
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-btn
                variant="outlined"
                prepend-icon="mdi-plus"
                @click="addAsset"
              >
                Add
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Geometry - Placeholder for now -->
          <v-card v-if="formData.collectionId" class="mb-4">
            <v-card-title class="text-h6">
              Geometry
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 text-grey-darken-1">
                Geometry drawing component will be implemented here.
              </p>
            </v-card-text>
          </v-card>

          <!-- Form Actions -->
          <div class="d-flex justify-space-between mt-4">
            <v-btn variant="outlined" to="/register">
              Cancel
            </v-btn>
            <v-btn
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="!formData.collectionId || !formData.properties.title"
            >
              Publish project data
            </v-btn>
          </div>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { nanoid } from 'nanoid'
  import { useNuxtApp, useRequestHeaders, useRouter } from '#app'
  import { bbox } from '@turf/turf'
  import dateFormat from 'dateformat'

  defineOptions({
    name: 'RegisterCreatePage'
  })

  const { $api } = useNuxtApp()

  // State
  const collections = ref([])
  const collectionPermissions = ref([])
  const keywordsGroups = ref([])
  const isLoadingCollections = ref(false)
  const isSubmitting = ref(false)
  const selectedKeywords = ref([])
  const selectedFacilityType = ref('')

  // Date picker menus
  const publicationDateMenu = ref(false)
  const startDateMenu = ref(false)
  const endDateMenu = ref(false)
  const tempStartDate = ref(null)
  const tempEndDate = ref(null)

  // Form data
  const formData = ref({
    collectionId: null,
    properties: {
      projectNumber: '',
      title: '',
      publication_datetime: null,
      description: '',
      language: 'eng',
      legalRestrictions: 'license',
      restrictionsOfUse: '',
      spatialReferenceSystem: 'not applicable',
      spatialReferenceSystemCustom: '',
      dataQualityInfoStatement: '',
      originatorDataOrganisation: 'Deltares',
      originatorDataEmail: '',
      originatorMetaDataOrganisation: 'Deltares',
      originatorMetaDataEmail: '',
      facility_type: '',
      datetime: null,
      start_datetime: null,
      end_datetime: null,
    },
    assets: {},
    geometry: null,
  })

  // Options
  const languageOptions = [
    { value: 'eng', title: 'English' },
    { value: 'dut', title: 'Dutch' },
    { value: 'ger', title: 'German' },
    { value: 'fre', title: 'French' },
  ]

  const legalRestrictionsOptions = [
    { value: 'copyright', title: 'copyright' },
    { value: 'patent', title: 'patent' },
    { value: 'patentPending', title: 'patent pending' },
    { value: 'trademark', title: 'trademark' },
    { value: 'license', title: 'license' },
    { value: 'intellectualPropertyRights', title: 'intellectual property rights' },
    { value: 'restricted', title: 'Prohibition of distribution and use' },
  ]

  const spatialReferenceSystemOptions = [
    { value: 'not applicable', title: 'not applicable' },
    { value: 'EPSG:28992 (Amersfoort / RD New)', title: 'EPSG:28992 (Amersfoort / RD New)' },
    { value: 'EPSG:4326 (WGS 84)', title: 'EPSG:4326 (WGS 84)' },
    { value: 'EPSG:3857 (WGS 84 / Pseudo-Mercator)', title: 'EPSG:3857 (WGS 84 / Pseudo-Mercator)' },
    { value: 'EPSG:25831 (ETRS89 / UTM zone 31N)', title: 'EPSG:25831 (ETRS89 / UTM zone 31N)' },
    { value: 'EPSG:25832 (ETRS89 / UTM zone 32N)', title: 'EPSG:25832 (ETRS89 / UTM zone 32N)' },
    { value: 'EPSG:3035 (ETRS89 / UTM zone 32N)', title: 'EPSG:3035 (ETRS89 / UTM zone 32N)' },
    { value: 'EPSG:3812 (ETRS89 / UTM zone 12N)', title: 'EPSG:3812 (ETRS89 / UTM zone 12N)' },
    { value: 'EPSG:5243 (ETRS89 / UTM zone 33N)', title: 'EPSG:5243 (ETRS89 / UTM zone 33N)' },
    { value: 'EPSG:4839 (ETRS89 / UTM zone 39N)', title: 'EPSG:4839 (ETRS89 / UTM zone 39N)' },
  ]

  const facilityTypeOptions = [
    { value: '', title: 'Type of Origin' },
    { value: 'experimentalFacility', title: 'Experimental Facilities' },
    { value: 'numericalModel', title: 'Numerical Models' },
    { value: 'Field', title: 'Field' },
  ]

  // Computed
  const collectionOptions = computed(() => {
    return collections.value.map(collection => ({
      value: collection.id,
      title: collection.title || collection.id,
    }))
  })

  const filteredKeywordsGroups = computed(() => {
    if (!keywordsGroups.value || keywordsGroups.value.length === 0) return []
    if (!selectedFacilityType.value) return []

    return keywordsGroups.value.filter(group => {
      return group.facility_type === selectedFacilityType.value ||
        group.facility_type === 'general'
    })
  })

  const publicationDateDisplay = computed(() => {
    if (!formData.value.properties.publication_datetime) return ''
    try {
      const date = new Date(formData.value.properties.publication_datetime)
      if (isNaN(date.getTime())) return formData.value.properties.publication_datetime
      return dateFormat(date, 'dd-mm-yyyy')
    } catch {
      return formData.value.properties.publication_datetime
    }
  })

  const startDateDisplay = computed(() => {
    if (!tempStartDate.value) return ''
    return dateFormat(tempStartDate.value, 'dd-mm-yyyy')
  })

  const endDateDisplay = computed(() => {
    if (!tempEndDate.value) return ''
    return dateFormat(tempEndDate.value, 'dd-mm-yyyy')
  })

  // Methods
  async function fetchCollections() {
    isLoadingCollections.value = true
    try {
      const headers = process.server ? useRequestHeaders() : {}
      
      const [collectionsData, permissionsData] = await Promise.all([
        $api('/collections', {
          query: { limit: 1000 },
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers,
          },
        }),
        $api('/collection-permissions', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...headers,
          },
        }),
      ])

      const allCollections = collectionsData?.collections || []
      const permissions = permissionsData || []

      // Filter collections by item:create permission
      collections.value = allCollections.filter(collection => {
        return permissions.some(permission =>
          permission.collection_id === collection.id &&
          permission.permissions?.includes('item:create')
        )
      })

      collectionPermissions.value = permissions
    } catch (error) {
      console.error('Failed to fetch collections:', error)
      collections.value = []
    } finally {
      isLoadingCollections.value = false
    }
  }

  async function fetchKeywords() {
    if (!formData.value.collectionId) {
      keywordsGroups.value = []
      return
    }

    try {
      const collection = await $api('/collections/{collection_id}', {
        path: {
          collection_id: formData.value.collectionId,
        },
        credentials: 'include',
      })

      const keywordsLink = collection.links?.find(
        item => item.rel === 'keywords' && item.id
      )

      if (!keywordsLink?.id) {
        keywordsGroups.value = []
        return
      }

      const keywordsResult = await $api('/keywords', {
        query: {
          facility_id: keywordsLink.id,
        },
        credentials: 'include',
      })

      keywordsGroups.value = keywordsResult || []
    } catch (error) {
      console.error('Error loading keywords:', error)
      keywordsGroups.value = []
    }
  }

  function handleCollectionChange() {
    if (formData.value.collectionId) {
      fetchKeywords()
    } else {
      keywordsGroups.value = []
    }
  }

  function handleFacilityTypeChange(value) {
    selectedFacilityType.value = value
    formData.value.properties.facility_type = value
    selectedKeywords.value = []
  }

  function applyPublicationDate() {
    if (formData.value.properties.publication_datetime) {
      // Convert date to ISO string format
      const date = new Date(formData.value.properties.publication_datetime)
      formData.value.properties.publication_datetime = date.toISOString().split('T')[0]
      publicationDateMenu.value = false
    }
  }

  function applyStartDate() {
    if (tempStartDate.value) {
      startDateMenu.value = false
    }
  }

  function applyEndDate() {
    if (tempEndDate.value) {
      endDateMenu.value = false
    }
  }

  function addAsset() {
    const assetId = nanoid()
    formData.value.assets[assetId] = {
      title: '',
      description: '',
      href: '',
      type: '',
    }
  }

  function removeAsset(assetId) {
    delete formData.value.assets[assetId]
  }

  async function handleSubmit() {
    if (!formData.value.collectionId || !formData.value.properties.title) {
      return
    }

    if (!tempStartDate.value) {
      alert('Please select a date or date range.')
      return
    }

    isSubmitting.value = true

    try {
      // Generate unique ID
      const itemId = nanoid()

      // Build the new item
      const newItem = {
        id: itemId,
        type: 'Feature',
        stac_version: '1.0.0',
        collection: formData.value.collectionId,
        links: [],
        properties: {
          ...formData.value.properties,
          keywords: selectedKeywords.value,
        },
        assets: formData.value.assets,
      }

      // Handle datetime fields from date pickers
      if (tempStartDate.value && tempEndDate.value) {
        // Both dates selected - save as start_datetime and end_datetime
        newItem.properties.datetime = null
        newItem.properties.start_datetime = new Date(tempStartDate.value).toISOString()
        newItem.properties.end_datetime = new Date(tempEndDate.value).toISOString()
      } else if (tempStartDate.value && !tempEndDate.value) {
        // Only start date - save as datetime
        newItem.properties.datetime = new Date(tempStartDate.value).toISOString()
        newItem.properties.start_datetime = undefined
        newItem.properties.end_datetime = undefined
      }

      // Handle spatial reference system
      if (formData.value.properties.spatialReferenceSystemCustom) {
        newItem.properties.spatialReferenceSystem = formData.value.properties.spatialReferenceSystemCustom
      }

      // Handle geometry if available
      if (formData.value.geometry) {
        newItem.geometry = formData.value.geometry
        newItem.bbox = bbox(formData.value.geometry)
      }

      // Submit to API
      const headers = process.server ? useRequestHeaders() : {}
      await $api('/collections/{collection_id}/items', {
        method: 'POST',
        body: newItem,
        path: {
          collection_id: formData.value.collectionId,
        },
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      })

      // Success - navigate to register page
      const router = useRouter()
      await router.push('/register')
    } catch (error) {
      console.error('Failed to register dataset:', error)
      alert('Something went wrong! Please try again.')
    } finally {
      isSubmitting.value = false
    }
  }

  // Initialize
  onMounted(async () => {
    await fetchCollections()
    // Initialize with one empty asset
    addAsset()
  })
</script>

<style scoped>
  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>

