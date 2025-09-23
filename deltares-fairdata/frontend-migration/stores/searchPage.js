import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchPageStore = defineStore('searchPage', () => {
  const q = ref('')
  const start = ref(undefined)
  const end = ref(undefined)
  const keywords = ref([])
  const collections = ref([])
  const includeEmptyGeometry = ref(false)
  const bbox = ref([ 180, 90, -180, -90 ]) //live TODO: check if both are needed.
  const bboxFilter = ref([ 180, 90, -180, -90 ]) // send in the request. 

  return { q, start, end, keywords, collections, includeEmptyGeometry, bbox, bboxFilter }


})