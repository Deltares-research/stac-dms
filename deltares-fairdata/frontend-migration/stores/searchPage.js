import { defineStore } from 'pinia'
import { ref } from 'vue'
import searchBody from '@/utils/search/searchBody.js' // the modular builder you made
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useSearchPageStore = defineStore('searchPage', () => {
  //State
  const q = ref('')
  const startDate = ref(undefined)
  const endDate = ref(undefined)
  const keywords = ref([])
  const collections = ref([])
  const includeEmptyGeometry = ref(false)
  const bbox = ref([ 180, 90, -180, -90 ]) //live TODO: check if both are needed.
  const bboxFilter = ref([ 180, 90, -180, -90 ]) // send in the request. 

  
  const featureCollection = ref(null)
  //getter.
  //filteredCollections;
  //
  const searchStatus = ref('idle') // 'idle' | 'pending' | 'success' | 'error'
  const searchError = ref(null)


  //Functions
  async function search() {
    console.log('SEARCH action:', q.value, startDate.value, endDate.value, keywords.value, collections.value, includeEmptyGeometry.value, bboxFilter.value)
   
    searchStatus.value = 'pending'; searchError.value = null
    const { $api } = useNuxtApp()
  
    try {

      const data = await $api('/search', {
        method: 'POST',
        body: searchBody({
          q: q.value,
          startDate: startDate.value,
          endDate: endDate.value,
          keywords: keywords.value,
          collections: collections.value,
          includeEmptyGeometry: includeEmptyGeometry.value,
          bbox: bboxFilter.value, 
        }),
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        onRequest ({ request, options }) {
          console.log('[search:onRequest]', request, options)
        },
        onResponse ({ request, response }) {
          console.log('[search:onResponse]', response.status, response.statusText)
          // _data is the parsed JSON response
          console.log('[search:data]', response?._data)
        },
        onResponseError ({ request, response }) {
          console.warn('[search:onResponseError]', response?.status, response?._data)
        },
      })
  
      featureCollection.value = data
      searchStatus.value = 'success'
      
    }catch (e) {
      searchError.value = e
      searchStatus.value = 'error'
    }
  }
  return { q, startDate, endDate, keywords, collections, includeEmptyGeometry, bbox, bboxFilter, featureCollection, searchStatus, searchError, search }


})