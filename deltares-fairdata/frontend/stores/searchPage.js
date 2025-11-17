import { defineStore } from 'pinia'
import { ref } from 'vue'
import searchBody from '@/utils/search/searchBody.js' // the modular builder you made
import { useNuxtApp } from '#app'

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


  //Functions
  async function search() {
    // Get selected collections (collections that are marked as selected)
    const selected = (collections.value || []).filter(c => c.selected)
    const selectedIds = selected.map(c => c.id)
    
   
    searchStatus.value = 'pending'; searchError.value = null
    const { $api } = useNuxtApp()
  
    try {

      const data = await $api('/search', {
        method: 'POST',
        body: {
          ...searchBody({
            q: q.value,
            startDate: startDate.value,
            endDate: endDate.value,
            keywords: keywords.value,
            collections: selectedIds,
            includeEmptyGeometry: includeEmptyGeometry.value,
            bbox: bboxFilter.value, 
          }),
          limit: 1000,
        },
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        onRequest ({ options }) {
          console.log('[search:onRequest]', options)
        },
        onResponse ({ response }) {
          console.log('[search:onResponse]', response.status, response.statusText)
          // _data is the parsed JSON response
          console.log('[search:data]', response?._data)
        },
        onResponseError ({ response }) {
          console.warn('[search:onResponseError]', response?.status, response?._data)
        },
      })
  
      featureCollection.value = data
      searchStatus.value = 'success'
      
    }catch (e) {
      searchError.value = e?.message || e?.toString() || 'Unknown error'
      searchStatus.value = 'error'
    }
  }

  async function fetchCollections() {
    const { $api } = useNuxtApp()
    
    try {
      const data = await $api('/collections', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
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

  return { q, startDate, endDate, keywords, collections, includeEmptyGeometry, bbox, bboxFilter, featureCollection, searchStatus, searchError, selectedFeatureId, areaDrawMode, search, fetchCollections, setSelectedFeature, clearSelectedFeature }


})