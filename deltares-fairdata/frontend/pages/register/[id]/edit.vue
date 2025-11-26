<template>
  <ItemForm :mode="'edit'" :item-id="itemId" />
</template>

<script setup>
  import ItemForm from '~/components/ItemForm.vue'
  import { useRoute } from 'vue-router'

  defineOptions({
    name: 'RegisterEditPage'
  })

  const route = useRoute()
  const itemId = route.params.id
</script>
