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
          {{ mode === 'edit' ? 'Edit item' : 'Register a new item' }}
        </h1>

        <form @submit.prevent="handleSubmit">
          <!-- Loading state -->
          <v-card v-if="isLoading" class="mb-4">
            <v-card-text class="d-flex flex-column align-center justify-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              />
              <p class="text-body-2 text-grey-darken-1">
                {{ mode === 'edit' ? 'Loading item...' : 'Loading collections...' }}
              </p>
            </v-card-text>
          </v-card>

          <!-- Empty state when no collections are available (only for create mode) -->
          <v-card v-else-if="mode === 'create' && !isLoading && collections.length === 0" class="mb-4">
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
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
            <v-card-title class="text-h6">
              {{ mode === 'edit' ? 'Domain that dataset belongs' : 'Select a domain to register your data set in' }}
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="formData.collection"
                :items="collectionOptions"
                label="Domain"
                variant="outlined"
                @update:model-value="handleCollectionChange"
              />
            </v-card-text>
          </v-card>

          <!-- General Information -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
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
                    :disabled="!formData.collection"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.title"
                    label="Project title"
                    variant="outlined"
                    :disabled="!formData.collection"
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
                        :disabled="!formData.collection"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card :width="mode === 'create' ? 400 : undefined">
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
                    :disabled="!formData.collection"
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
                    :disabled="!formData.collection"
                  />
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="formData.properties.legalRestrictions"
                    :items="legalRestrictionsOptions"
                    label="Legal restrictions"
                    variant="outlined"
                    :disabled="!formData.collection"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.properties.restrictionsOfUse"
                    label="Applications for which this data set is not suitable"
                    variant="outlined"
                    :disabled="!formData.collection"
                    rows="2"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="text-body-2 text-grey-darken-1 mb-2">
                    Spatial reference system (choose one from the list or define a custom one)
                  </div>
                  <div class="d-flex ga-2">
                    <v-select
                      v-model="formData.properties.spatialReferenceSystem"
                      :items="spatialReferenceSystemOptions"
                      label="Select..."
                      variant="outlined"
                      :disabled="!formData.collection"
                      class="flex-grow-0"
                      style="min-width: 300px;"
                    />
                    <v-text-field
                      v-model="formData.properties.spatialReferenceSystemCustom"
                      label="Or define a custom spatial reference system"
                      variant="outlined"
                      :disabled="!formData.collection"
                      placeholder="e.g., EPSG:4326"
                      class="flex-grow-1"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Data Quality -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
            <v-card-title class="text-h6">
              Data quality
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="formData.properties.dataQualityInfoStatement"
                label="Description of the origin of this data set"
                variant="outlined"
                :disabled="!formData.collection"
                rows="3"
              />
            </v-card-text>
          </v-card>

          <!-- Originator Data Set -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
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
                    :disabled="!formData.collection"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorDataEmail"
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    :disabled="!formData.collection"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Originator Meta Data -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true) && formData.collection" class="mb-4">
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
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
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
                        :disabled="!formData.collection"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card :width="mode === 'create' ? 400 : undefined">
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
                        :disabled="!formData.collection"
                        readonly
                        prepend-inner-icon="mdi-calendar"
                      />
                    </template>
                    <v-card :width="mode === 'create' ? 400 : undefined">
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
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
            <v-card-title class="text-h6">
              Type of Origin
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedFacilityType"
                :items="facilityTypeOptions"
                label="Filter by Type of Origin"
                variant="outlined"
                :disabled="!formData.collection"
                @update:model-value="handleFacilityTypeChange"
              />
            </v-card-text>
          </v-card>

          <!-- Keywords -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true) && formData.collection && filteredKeywordsGroups.length > 0" class="mb-4">
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
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
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
                      :disabled="!formData.collection"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.description"
                      label="Description of the dataset"
                      variant="outlined"
                      :disabled="!formData.collection"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.href"
                      label="Link to the dataset"
                      variant="outlined"
                      :disabled="!formData.collection"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.type"
                      label="Type of dataset (e.g. file type)"
                      variant="outlined"
                      :disabled="!formData.collection"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      :disabled="!formData.collection"
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
                :disabled="!formData.collection"
                @click="addAsset"
              >
                Add
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Geometry -->
          <v-card v-if="!isLoading && (mode === 'create' ? collections.length > 0 : true)" class="mb-4">
            <v-card-title class="text-h6">
              Geometry
            </v-card-title>
            <v-card-text style="min-height: 300px;">
              <div class="mb-4 map-wrapper">
                <item-map-component
                  :enabled-tools="['polygon', 'marker']"
                  :center="mode === 'create' ? [5.1, 52.07] : [0, 0]"
                  :zoom="mode === 'create' ? undefined : 2"
                />
              </div>
            </v-card-text>
            <v-card-text>
              <p v-if="!formData.geometry" class="text-body-2 text-grey-darken-1 mb-4">
                No geometry set. Use the coordinate input below or draw on the map.
              </p>
                
              <div class="pa-4 border rounded-lg bg-grey-lighten-5">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-subtitle-2 font-weight-medium">
                    Enter coordinates manually
                  </h3>
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        size="small"
                        variant="text"
                        class="text-grey"
                      >
                        <v-icon>mdi-help-circle</v-icon>
                      </v-btn>
                    </template>
                    <div class="pa-2">
                      <div class="text-body-2 font-weight-bold mb-2">
                        Coordinate Input Examples
                      </div>
                      <div class="text-caption">
                        <div class="mb-1">
                          <strong>Point:</strong><br>40.7128, -74.0060
                        </div>
                        <div class="mb-1">
                          <strong>Rectangle:</strong><br>40.73, -73.94<br>40.71, -73.92
                        </div>
                        <div class="mb-1">
                          <strong>Polygon:</strong><br>40.73, -73.94<br>40.71, -73.94<br>40.71, -73.92
                        </div>
                        <div class="mt-2 pt-2 border-t">
                          <strong>Tips:</strong><br>
                          • Use new lines to separate multiple coordinates<br>
                          • Rectangle mode creates a box from NW and SE corners<br>
                          • Polygon mode automatically closes the shape
                        </div>
                      </div>
                    </div>
                  </v-tooltip>
                </div>

                <v-textarea
                  v-model="coordinateInput"
                  placeholder="40.7128, -74.0060"
                  variant="outlined"
                  :disabled="!formData.collection"
                  rows="4"
                  class="mb-3"
                />

                <div class="mb-3">
                  <v-checkbox
                    v-model="latLongOrder"
                    label="Lat/Lng order (uncheck for Lng/Lat)"
                    density="compact"
                    :disabled="!formData.collection"
                    hide-details
                  />
                </div>

                <div
                  v-if="geometryValidationMessage"
                  class="text-caption pa-2 rounded mb-3"
                  :class="geometryInputValid ? 'bg-green-lighten-5 text-green-darken-2' : 'bg-red-lighten-5 text-red-darken-2'"
                >
                  {{ geometryValidationMessage }}
                </div>

                <div class="d-flex ga-2">
                  <v-btn
                    variant="outlined"
                    :disabled="!formData.collection || !geometryInputValid"
                    @click="createGeometryFromCoordinates"
                  >
                    Create Geometry
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    :disabled="!formData.collection"
                    @click="clearCoordinateInput"
                  >
                    Clear
                  </v-btn>
                </div>
              </div>
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
              :disabled="!formData.collection || !formData.properties.title"
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { nanoid } from 'nanoid'
  import { useRouter } from '#app'
  import { bbox } from '@turf/turf'
  import dateFormat from 'dateformat'
  import languageOptions from '~/configuration/languageOptions.json'
  import legalRestrictionsOptions from '~/configuration/legalRestrictionsOptions.json'
  import spatialReferenceSystemOptions from '~/configuration/spatialReferenceSystemOptions.json'
  import facilityTypeOptions from '~/configuration/facilityTypeOptions.json'
  import { fetchCollectionsWithCreatePermission, fetchCollectionById, fetchKeywordsByFacilityId } from '~/requests'
  import { fetchItemById, createItem, updateItem } from '~/requests/items'
  import { parseAndValidateCoordinates, createGeometryFromCoordinates as createGeometry } from '~/utils/helpers'

  const props = defineProps({
    mode: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit'].includes(value)
    },
    itemId: {
      type: String,
      default: null
    }
  })

  const router = useRouter()

  // State
  const collections = ref([])
  const collectionPermissions = ref([])
  const keywordsGroups = ref([])
  const isSubmitting = ref(false)
  const selectedKeywords = ref([])
  const selectedFacilityType = ref('')
  const isLoading = ref(props.mode === 'edit') // Edit starts loading, create doesn't

  // Initialize formData with proper structure
  const formData = ref({
    collection: null,
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

  const error = ref(null)

  // Date picker menus
  const publicationDateMenu = ref(false)
  const startDateMenu = ref(false)
  const endDateMenu = ref(false)
  const tempStartDate = ref(null)
  const tempEndDate = ref(null)

  // Geometry coordinate input state
  const coordinateInput = ref('')
  const latLongOrder = ref(true)
  const geometryInputValid = ref(false)
  const geometryValidationMessage = ref('')

  // Computed
  const collectionOptions = computed(() => {
    const allCollections = collections.value || []
    const permissions = collectionPermissions.value || []
  
    if (props.mode === 'edit') {
      // For edit: include collections with item:create permission + current collection
      const currentCollectionId = formData.value?.collection
      const filteredCollections = allCollections.filter(collection => {
        if (collection.id === currentCollectionId) {
          return true
        }
        return permissions.some(permission =>
          permission.collection_id === collection.id &&
          permission.permissions?.includes('item:create')
        )
      })
      return filteredCollections.map(collection => ({
        value: collection.id,
        title: collection.title || collection.id,
      }))
    } else {
      // For create: just map all collections
      return allCollections.map(collection => ({
        value: collection.id,
        title: collection.title || collection.id,
      }))
    }
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
    if (!formData.value?.properties?.publication_datetime) return ''
    try {
      const date = new Date(formData.value.properties.publication_datetime)
      if (isNaN(date.getTime())) return formData.value.properties.publication_datetime
      return dateFormat(date, 'dd-mm-yyyy')
    } catch {
      return formData.value.properties.publication_datetime || ''
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
    try {
      const result = await fetchCollectionsWithCreatePermission({ includeHeaders: true })
      collections.value = result.collections
      collectionPermissions.value = result.permissions
    } catch (error) {
      console.error('Failed to fetch collections:', error)
      collections.value = []
      collectionPermissions.value = []
    }
  }

  async function fetchKeywords() {
    if (!formData.value?.collection) {
      keywordsGroups.value = []
      return
    }

    try {
      const collection = await fetchCollectionById(formData.value.collection)
      const keywordsLink = collection.links?.find(
        item => item.rel === 'keywords' && item.id
      )

      if (!keywordsLink?.id) {
        keywordsGroups.value = []
        return
      }

      keywordsGroups.value = await fetchKeywordsByFacilityId(keywordsLink.id)
    } catch (error) {
      console.error('Error loading keywords:', error)
      keywordsGroups.value = []
    }
  }

  function handleCollectionChange() {
    if (formData.value?.collection) {
      fetchKeywords()
    } else {
      keywordsGroups.value = []
    }
  }

  function handleFacilityTypeChange(value) {
    selectedFacilityType.value = value
    if (formData.value?.properties) {
      formData.value.properties.facility_type = value
    }
    selectedKeywords.value = []
  }

  function applyPublicationDate() {
    if (formData.value?.properties?.publication_datetime) {
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
    if (!formData.value.assets) {
      formData.value.assets = {}
    }
    formData.value.assets[assetId] = {
      title: '',
      description: '',
      href: '',
      type: '',
    }
  }

  function removeAsset(assetId) {
    if (formData.value?.assets) {
      delete formData.value.assets[assetId]
    }
  }

  function clearCoordinateInput() {
    coordinateInput.value = ''
    geometryInputValid.value = false
    geometryValidationMessage.value = ''
    if (formData.value) {
      formData.value.geometry = null
    }
  }

  function validateCoordinates(input) {
    const result = parseAndValidateCoordinates(input, latLongOrder.value)
    geometryInputValid.value = result.isValid
    geometryValidationMessage.value = result.message
    return result
  }

  function createGeometryFromCoordinates() {
    const result = validateCoordinates(coordinateInput.value)
    if (!result.isValid || !result.coordinates) return

    const geometry = createGeometry(result.coordinates)
    if (geometry && formData.value) {
      formData.value.geometry = geometry
    }
  }

  watch(coordinateInput, (newValue) => {
    if (newValue) {
      validateCoordinates(newValue)
    } else {
      geometryInputValid.value = false
      geometryValidationMessage.value = ''
    }
  })

  async function handleSubmit() {
    if (!formData.value?.collection || !formData.value?.properties?.title) {
      return
    }

    if (!tempStartDate.value) {
      alert('Please select a date or date range.')
      return
    }

    isSubmitting.value = true

    try {
      const itemData = {
        type: 'Feature',
        stac_version: '1.0.0',
        collection: formData.value.collection,
        links: [],
        properties: {
          ...formData.value.properties,
          keywords: selectedKeywords.value,
        },
        assets: formData.value.assets || {},
      }

      // Handle datetime fields
      if (tempStartDate.value && tempEndDate.value) {
        itemData.properties.datetime = null
        itemData.properties.start_datetime = new Date(tempStartDate.value).toISOString()
        itemData.properties.end_datetime = new Date(tempEndDate.value).toISOString()
      } else if (tempStartDate.value && !tempEndDate.value) {
        itemData.properties.datetime = new Date(tempStartDate.value).toISOString()
        itemData.properties.start_datetime = undefined
        itemData.properties.end_datetime = undefined
      }

      // Handle spatial reference system
      if (formData.value.properties.spatialReferenceSystemCustom) {
        itemData.properties.spatialReferenceSystem = formData.value.properties.spatialReferenceSystemCustom
      }

      // Handle geometry
      if (formData.value.geometry) {
        itemData.geometry = formData.value.geometry
        itemData.bbox = bbox(formData.value.geometry)
      }

      if (props.mode === 'edit') {
        // Edit mode: use existing ID and update
        itemData.id = props.itemId
        await updateItem(formData.value.collection, props.itemId, itemData)
      } else {
        // Create mode: generate new ID and create
        itemData.id = nanoid()
        await createItem(formData.value.collection, itemData)
      }

      // Navigate to register page
      await router.push('/register')
    } catch (error) {
      console.error(`Failed to ${props.mode === 'edit' ? 'update' : 'register'} dataset:`, error)
      alert('Something went wrong! Please try again.')
    } finally {
      isSubmitting.value = false
    }
  }

  // Initialize
  onMounted(async () => {
    if (props.mode === 'edit') {
      // Edit mode: fetch item and collections in parallel
      isLoading.value = true
      error.value = null
    
      try {
        const [item] = await Promise.all([
          fetchItemById(props.itemId),
          fetchCollections(),
        ])
      
        // Populate formData from item
        formData.value = {
          collection: item.collection || null,
          properties: {
            projectNumber: item.properties?.projectNumber || '',
            title: item.properties?.title || '',
            publication_datetime: item.properties?.publication_datetime || null,
            description: item.properties?.description || '',
            language: item.properties?.language || 'eng',
            legalRestrictions: item.properties?.legalRestrictions || 'license',
            restrictionsOfUse: item.properties?.restrictionsOfUse || '',
            spatialReferenceSystem: item.properties?.spatialReferenceSystem || 'not applicable',
            spatialReferenceSystemCustom: item.properties?.spatialReferenceSystemCustom || '',
            dataQualityInfoStatement: item.properties?.dataQualityInfoStatement || '',
            originatorDataOrganisation: item.properties?.originatorDataOrganisation || 'Deltares',
            originatorDataEmail: item.properties?.originatorDataEmail || '',
            originatorMetaDataOrganisation: item.properties?.originatorMetaDataOrganisation || 'Deltares',
            originatorMetaDataEmail: item.properties?.originatorMetaDataEmail || '',
            facility_type: item.properties?.facility_type || '',
            datetime: item.properties?.datetime || null,
            start_datetime: item.properties?.start_datetime || null,
            end_datetime: item.properties?.end_datetime || null,
          },
          assets: item.assets ? { ...item.assets } : {},
          geometry: item.geometry || null,
        }
      
        // Initialize dates
        if (item.properties?.start_datetime && item.properties?.end_datetime) {
          tempStartDate.value = item.properties.start_datetime.split('T')[0]
          tempEndDate.value = item.properties.end_datetime.split('T')[0]
        } else if (item.properties?.datetime) {
          tempStartDate.value = item.properties.datetime.split('T')[0]
          tempEndDate.value = null
        }
      
        // Initialize keywords and facility type
        if (item.properties?.keywords && Array.isArray(item.properties.keywords)) {
          selectedKeywords.value = [...item.properties.keywords]
        }
        if (item.properties?.facility_type) {
          selectedFacilityType.value = item.properties.facility_type
        }
      
        // Fetch keywords for the collection
        if (formData.value.collection) {
          await fetchKeywords()
        }
      } catch (err) {
        error.value = err.message || 'Failed to load item'
        console.error('Error loading item:', err)
      } finally {
        isLoading.value = false
      }
    } else {
      // Create mode: just fetch collections and initialize with one asset
      await fetchCollections()
      addAsset()
    }
  })
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.map-wrapper, .map-wrapper .mapboxgl-map { width: 100%; height: 100%; }
</style>

