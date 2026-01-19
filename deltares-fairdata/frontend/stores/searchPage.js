import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { center } from '@turf/turf'
import { isEqual } from 'lodash-es'
import { fetchCollections as fetchCollectionsApi, fetchTopics as fetchTopicsApi, fetchKeywords as fetchKeywordsApi } from '~/requests'
import { searchItems } from '~/requests/search'

// Global bounding box constant (covers entire world)
const GLOBAL_BBOX = [ -180, -90, 180, 90 ]

export const useSearchPageStore = defineStore('searchPage', () => {
  //State
  const q = ref('')
  const startDate = ref(undefined)
  const endDate = ref(undefined)
  const keywords = ref([]) // Change from array of IDs to array of objects with {id, count, selected}
  const collections = ref([]) // Already has selected property
  const includeEmptyGeometry = ref(false)
  const bbox = ref([ 180, 90, -180, -90 ])
  const bboxFilter = ref([ 180, 90, -180, -90 ])
  const topics = ref([])
  
  const featureCollection = ref(null)
  const totalMatched = ref(0)
  const searchStatus = ref('idle')
  const searchError = ref(null)
  const selectedFeatureId = ref(null)
  const selectedFeatureBbox = ref(null)
  const areaDrawMode = ref(false)

  // Getter: Feature collection with only features that have valid geometry
  // This keeps original geometries (doesn't convert polygons to points)
  const featureCollectionWithGeometry = computed(() => {
    if (!featureCollection.value || !featureCollection.value.features) {
      return null
    }
    
    // Filter out features with null or missing geometry and normalize properties.id
    const validFeatures = featureCollection.value.features
      .filter(feature => feature.geometry && feature.geometry.type)
      .filter(feature => {
        // Exclude features marked as global dataset
        return !feature.properties?.globaldataset
      })
      .map(feature => {
        let processedFeature = { ...feature }
        
        // Ensure properties.id is set to feature.id if it exists
        if (processedFeature.id) {
          processedFeature = {
            ...processedFeature,
            properties: {
              ...processedFeature.properties,
              id: processedFeature.properties?.id || processedFeature.id,
            },
          }
        }
        
        return processedFeature
      })
    
    // Return null if no valid features, otherwise return filtered collection
    if (validFeatures.length === 0) {
      return null
    }
    
    return {
      ...featureCollection.value,
      features: validFeatures,
    }
  })

  // Computed: Feature collection with only Point geometries (for clustering)
  const featureCollectionPoints = computed(() => {
    if (!featureCollectionWithGeometry.value || !featureCollectionWithGeometry.value.features) {
      return null
    }
    
    const pointFeatures = featureCollectionWithGeometry.value.features
      .filter(feature => feature.geometry && feature.geometry.type === 'Point')
    
    if (pointFeatures.length === 0) {
      return null
    }
    
    return {
      type: 'FeatureCollection',
      features: pointFeatures,
    }
  })

  // Computed: Feature collection with only Polygon/MultiPolygon geometries (for layer display)
  const featureCollectionPolygons = computed(() => {
    if (!featureCollectionWithGeometry.value || !featureCollectionWithGeometry.value.features) {
      return null
    }
    
    const polygonFeatures = featureCollectionWithGeometry.value.features
      .filter(feature => {
        const geomType = feature.geometry?.type
        return geomType === 'Polygon' || geomType === 'MultiPolygon'
      })
    
    if (polygonFeatures.length === 0) {
      return null
    }
    
    return {
      type: 'FeatureCollection',
      features: polygonFeatures,
    }
  })


  //Functions
  async function search(limit = 1000) {
    // Get selected collections (collections that are marked as selected)
    const selected = (collections.value || []).filter(c => c.selected)
    const selectedIds = selected.map(c => c.id)
    
    // Get selected topics
    const selectedTopics = (topics.value || []).filter(t => t.selected)
    const selectedTopicIds = selectedTopics.map(t => t.id)
    
    // Get selected keywords
    const selectedKeywords = (keywords.value || []).filter(k => k.selected)
    const selectedKeywordIds = selectedKeywords.map(k => k.id)
    
    searchStatus.value = 'pending'
    searchError.value = null
  
    try {
      const data = await searchItems({
        q: q.value,
        startDate: startDate.value,
        endDate: endDate.value,
        keywords: selectedKeywordIds, // Pass array of selected keyword IDs
        collections: selectedIds,
        topics: selectedTopicIds,
        includeEmptyGeometry: includeEmptyGeometry.value,
        bbox: bboxFilter.value,
        limit: limit,
      })

      // Mark features with global bounding box
      if (data && data.features && Array.isArray(data.features)) {
        data.features = data.features.map(feature => {
          // Check if feature has global bbox
          if (feature.bbox && Array.isArray(feature.bbox) && feature.bbox.length === 4) {
            if (isEqual(feature.bbox, GLOBAL_BBOX)) {
              return {
                ...feature,
                properties: {
                  ...feature.properties,
                  globaldataset: true,
                },
              }
            }
          }
          return feature
        })
      }

      featureCollection.value = data
      totalMatched.value = data?.numMatched || 0
      searchStatus.value = 'success'
      
    } catch (e) {
      searchError.value = e?.message || e?.toString() || 'Unknown error'
      searchStatus.value = 'error'
      totalMatched.value = 0
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

  function setSelectedFeatureBbox(bbox) {
    selectedFeatureBbox.value = bbox
  }

  function clearSelectedFeature() {
    selectedFeatureId.value = null
    selectedFeatureBbox.value = null
  }
  async function fetchTopics() {
    try {
      const data = await fetchTopicsApi()
      topics.value = data.topics || []
    } catch (e) {
      console.error('Failed to fetch topics:', e?.message || e?.toString() || 'Unknown error')
      return []
    }
  }

  async function fetchKeywords() {
    try {
      const data = await fetchKeywordsApi()
      // data is now an array of keywords, not an object with keywords property
      keywords.value = (Array.isArray(data) ? data : []).map(k => ({ ...k, selected: false }))
    } catch (e) {
      console.error('Failed to fetch keywords:', e?.message || e?.toString() || 'Unknown error')
      keywords.value = []
    }
  }

  return { 
    q, startDate, endDate, keywords, collections, topics, 
    includeEmptyGeometry, bbox, bboxFilter, featureCollection, 
    featureCollectionWithGeometry, 
    featureCollectionPoints, // Add this
    featureCollectionPolygons, // Add this
    totalMatched, searchStatus, searchError, 
    selectedFeatureId, selectedFeatureBbox, areaDrawMode, 
    search, fetchCollections, setSelectedFeature, setSelectedFeatureBbox, 
    clearSelectedFeature, fetchTopics, fetchKeywords, 
  }

})


