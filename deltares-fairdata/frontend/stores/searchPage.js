import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchCollections as fetchCollectionsApi } from '~/requests'
import { searchItems } from '~/requests/search'

export const useSearchPageStore = defineStore('searchPage', () => {
  //State
  const q = ref('')
  const startDate = ref(undefined)
  const endDate = ref(undefined)
  const keywords = ref([])
  const collections = ref([]) // Stores all available collection objects, selected ones are filtered from this
  const includeEmptyGeometry = ref(false)
  const bbox = ref([ 180, 90, -180, -90 ]) //live TODO: check if both are needed.
  const bboxFilter = ref([ 180, 90, -180, -90 ]) // send in the request. 

  
  const featureCollection = ref(null)
  const searchStatus = ref('idle')
  const searchError = ref(null)
  const selectedFeatureId = ref(null)
  const areaDrawMode = ref(false)

  // Getter: Feature collection with only features that have valid geometry
  const featureCollectionWithGeometry = computed(() => {
    if (!featureCollection.value || !featureCollection.value.features) {
      return null
    }
    
    // Filter out features with null or missing geometry
    const validFeatures = featureCollection.value.features.filter(
      feature => feature.geometry && feature.geometry.type,
    )
    
    // Return null if no valid features, otherwise return filtered collection
    if (validFeatures.length === 0) {
      return null
    }
    
    return {
      ...featureCollection.value,
      features: validFeatures,
    }
  })


  //Functions
  async function search() {
    // Get selected collections (collections that are marked as selected)
    const selected = (collections.value || []).filter(c => c.selected)
    const selectedIds = selected.map(c => c.id)
    
    searchStatus.value = 'pending'
    searchError.value = null
  
    try {
      const data = await searchItems({
        q: q.value,
        startDate: startDate.value,
        endDate: endDate.value,
        keywords: keywords.value,
        collections: selectedIds,
        includeEmptyGeometry: includeEmptyGeometry.value,
        bbox: bboxFilter.value,
        limit: 1000,
      })
  
      featureCollection.value = data
      searchStatus.value = 'success'
      
    } catch (e) {
      searchError.value = e?.message || e?.toString() || 'Unknown error'
      searchStatus.value = 'error'
    }
  }

  async function fetchCollections() {
    try {
      const data = await fetchCollectionsApi({ includeHeaders: false })
      collections.value = (data?.collections || []).map(c => ({ ...c, selected: false }))
    } catch (e) {
      console.error('Failed to fetch collections:', e?.message || e?.toString() || 'Unknown error')
      collections.value = []
    }
  }

  function setSelectedFeature(featureId) {
    selectedFeatureId.value = featureId
  }

  function clearSelectedFeature() {
    selectedFeatureId.value = null
  }

  return { q, startDate, endDate, keywords, collections, includeEmptyGeometry, bbox, bboxFilter, featureCollection, featureCollectionWithGeometry, searchStatus, searchError, selectedFeatureId, areaDrawMode, search, fetchCollections, setSelectedFeature, clearSelectedFeature }

})