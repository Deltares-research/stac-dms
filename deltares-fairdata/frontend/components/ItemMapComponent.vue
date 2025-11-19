<template>
  <div class="item-map-wrapper">
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

  // Default center (Netherlands)
  const center = ref([5.1, 52.07])
  const zoom = ref(10.5)


  function onMapCreated(map) {
    mapInstance.value = map
    console.log(map)
  }

</script>

<style scoped>
.item-map-wrapper, .item-map-wrapper :deep(.mapboxgl-map) { 
  width: 100%; 
  height: 100%; 
  min-height: 300px;
}
</style>


