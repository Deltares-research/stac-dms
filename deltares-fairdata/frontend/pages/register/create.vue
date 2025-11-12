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
          <!-- Loading state -->
          <v-card v-if="isLoadingCollections" class="mb-4">
            <v-card-text class="d-flex flex-column align-center justify-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                class="mb-4"
              />
              <p class="text-body-2 text-grey-darken-1">
                Loading collections...
              </p>
            </v-card-text>
          </v-card>

          <!-- Empty state when no collections are available (only after loading completes) -->
          <v-card v-else-if="!isLoadingCollections && collections.length === 0" class="mb-4">
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
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Select a domain to register your data set in
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="formData.collectionId"
                :items="collectionOptions"
                label="Domain"
                variant="outlined"
                @update:model-value="handleCollectionChange"
              />
            </v-card-text>
          </v-card>

          <!-- General Information - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
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
                  <div class="text-body-2 text-grey-darken-1 mb-2">
                    Spatial reference system (choose one from the list or define a custom one)
                  </div>
                  <div class="d-flex ga-2">
                    <v-select
                      v-model="formData.properties.spatialReferenceSystem"
                      :items="spatialReferenceSystemOptions"
                      label="Select..."
                      variant="outlined"
                      :disabled="!formData.collectionId"
                      class="flex-grow-0"
                      style="min-width: 300px;"
                    />
                    <v-text-field
                      v-model="formData.properties.spatialReferenceSystemCustom"
                      label="Or define a custom spatial reference system"
                      variant="outlined"
                      :disabled="!formData.collectionId"
                      placeholder="e.g., EPSG:4326"
                      class="flex-grow-1"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Data Quality - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Data quality
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="formData.properties.dataQualityInfoStatement"
                label="Description of the origin of this data set"
                variant="outlined"
                :disabled="!formData.collectionId"
                rows="3"
              />
            </v-card-text>
          </v-card>

          <!-- Originator Data Set - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
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
                    :disabled="!formData.collectionId"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.properties.originatorDataEmail"
                    label="E-mail"
                    variant="outlined"
                    type="email"
                    :disabled="!formData.collectionId"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Originator Meta Data -->
          <v-card v-if="!isLoadingCollections && collections.length > 0 && formData.collectionId" class="mb-4">
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

          <!-- Date Range - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
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
                        :disabled="!formData.collectionId"
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
                        :disabled="!formData.collectionId"
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

          <!-- Type of Origin - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Type of Origin
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedFacilityType"
                :items="facilityTypeOptions"
                label="Filter by Type of Origin"
                variant="outlined"
                :disabled="!formData.collectionId"
                @update:model-value="handleFacilityTypeChange"
              />
            </v-card-text>
          </v-card>

          <!-- Keywords -->
          <v-card v-if="!isLoadingCollections && collections.length > 0 && formData.collectionId && filteredKeywordsGroups.length > 0" class="mb-4">
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

          <!-- Storage Location Data Set - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
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
                      :disabled="!formData.collectionId"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.description"
                      label="Description of the dataset"
                      variant="outlined"
                      :disabled="!formData.collectionId"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.href"
                      label="Link to the dataset"
                      variant="outlined"
                      :disabled="!formData.collectionId"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="asset.type"
                      label="Type of dataset (e.g. file type)"
                      variant="outlined"
                      :disabled="!formData.collectionId"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      variant="outlined"
                      color="error"
                      prepend-icon="mdi-delete"
                      :disabled="!formData.collectionId"
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
                :disabled="!formData.collectionId"
                @click="addAsset"
              >
                Add
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Geometry - Always visible but disabled until domain selected -->
          <v-card v-if="!isLoadingCollections && collections.length > 0" class="mb-4">
            <v-card-title class="text-h6">
              Geometry
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Map is coming
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
                  :disabled="!formData.collectionId"
                  rows="4"
                  class="mb-3"
                />

                <div class="mb-3">
                  <v-checkbox
                    v-model="latLongOrder"
                    label="Lat/Lng order (uncheck for Lng/Lat)"
                    density="compact"
                    :disabled="!formData.collectionId"
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
                    :disabled="!formData.collectionId || !geometryInputValid"
                    @click="createGeometryFromCoordinates"
                  >
                    Create Geometry
                  </v-btn>
                  <v-btn
                    variant="outlined"
                    :disabled="!formData.collectionId"
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
  import { createItem } from '~/requests/items'

  defineOptions({
    name: 'RegisterCreatePage'
  })

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

  // Geometry coordinate input state
  const coordinateInput = ref('')
  const latLongOrder = ref(true)
  const geometryInputValid = ref(false)
  const geometryValidationMessage = ref('')

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

  // Options are imported from configuration files

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
      const result = await fetchCollectionsWithCreatePermission({ includeHeaders: true })
      collections.value = result.collections
      collectionPermissions.value = result.permissions
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
      const collection = await fetchCollectionById(formData.value.collectionId)

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

  function clearCoordinateInput() {
    coordinateInput.value = ''
    geometryInputValid.value = false
    geometryValidationMessage.value = ''
    formData.value.geometry = null
  }

  function parseAndValidateCoordinates(input) {
    if (!input.trim()) {
      geometryInputValid.value = false
      geometryValidationMessage.value = ''
      return null
    }

    try {
      const cleaned = input.trim()
      const lines = cleaned.split(/\n/).filter(line => line.trim())
      const coordinates = []

      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim())
        if (parts.length !== 2) {
          throw new Error(`Invalid coordinate format: "${line}"`)
        }

        const coord1 = parseFloat(parts[0])
        const coord2 = parseFloat(parts[1])

        if (isNaN(coord1) || isNaN(coord2)) {
          throw new Error(`Invalid numbers in: "${line}"`)
        }

        if (latLongOrder.value) {
          coordinates.push([coord2, coord1]) // [lng, lat] for GeoJSON
        } else {
          coordinates.push([coord1, coord2]) // [lng, lat] for GeoJSON
        }
      }

      if (coordinates.length === 0) {
        throw new Error('No valid coordinates found')
      }

      let detectedType = 'Point'
      if (coordinates.length === 2) {
        detectedType = 'Rectangle'
      } else if (coordinates.length > 2) {
        detectedType = 'Polygon'
      }

      geometryInputValid.value = true
      geometryValidationMessage.value = `Detected: ${detectedType} with ${coordinates.length} point${coordinates.length > 1 ? 's' : ''}`
      return coordinates
    } catch (error) {
      geometryInputValid.value = false
      geometryValidationMessage.value = error.message || 'Invalid coordinate format'
      return null
    }
  }

  function createGeometryFromCoordinates() {
    const coordinates = parseAndValidateCoordinates(coordinateInput.value)
    if (!coordinates || !geometryInputValid.value) return

    let geometry

    if (coordinates.length === 1) {
      // Point
      geometry = {
        type: 'Point',
        coordinates: coordinates[0],
      }
    } else if (coordinates.length === 2) {
      // Rectangle
      const [nw, se] = coordinates
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [nw[0], nw[1]], // NW
          [se[0], nw[1]], // NE
          [se[0], se[1]], // SE
          [nw[0], se[1]], // SW
          [nw[0], nw[1]], // Close
        ]],
      }
    } else {
      // Polygon
      const coords = [...coordinates]
      coords.push(coords[0]) // Close the polygon
      geometry = {
        type: 'Polygon',
        coordinates: [coords],
      }
    }

    formData.value.geometry = geometry
  }

  // Watch coordinate input for validation
  watch(coordinateInput, (newValue) => {
    if (newValue) {
      parseAndValidateCoordinates(newValue)
    } else {
      geometryInputValid.value = false
      geometryValidationMessage.value = ''
    }
  })

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
      await createItem(formData.value.collectionId, newItem)

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

