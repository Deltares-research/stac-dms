<template>
  <div class="item-map-wrapper" :style="{ height: height }">
    <mapbox-map
      v-model:map="mapInstance"
      :access-token="accessToken"
      map-style="mapbox://styles/mapbox/streets-v12"
      :center="center"
      :zoom="zoom"
      @mb-created="onMapCreated"
    >
      <MapboxNavigationControl position="bottom-right" :show-compass="false" />
    </mapbox-map>
  </div>
</template>

<script setup>
  import { ref} from 'vue'
  import { MapboxMap, MapboxNavigationControl } from '@studiometa/vue-mapbox-gl'

  const mapInstance = ref(null)
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN
  const props = defineProps({
    height: {
      type: String,
      default: '400px',
    },
  })
  // Default center (Netherlands)
  const center = ref([5.1, 52.07])
  const zoom = ref(10.5)


  function onMapCreated(map) {
    mapInstance.value = map
  }

</script>

<style scoped>
.item-map-wrapper {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.item-map-wrapper :deep(.mapboxgl-map) {
  width: 100%;
  height: 100%;
}
</style>

