<template>
  <div class="map-wrapper">
    <mapbox-map
      :access-token="accessToken"
      :center="[5.1, 52.07]"
      :zoom="10.5"
      map-style="mapbox://styles/mapbox/light-v11"
    />
  </div>
</template>
<script setup>
  import { MapboxMap } from '@studiometa/vue-mapbox-gl'
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN

</script>
<style>
.map-wrapper,
.map-wrapper .mapboxgl-map {
  width: 100%;
  height: 100%;
}
</style>