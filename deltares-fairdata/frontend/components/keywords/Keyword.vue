<template>
  <div class="d-flex align-center gap-2 group">
    <UpdateKeyword
      :keyword="keyword"
      @updated="$emit('updated')"
    />
    <DeleteKeyword
      :keyword="keyword"
      @deleted="$emit('deleted')"
    />
  </div>
</template>

<script setup>
  import UpdateKeyword from './UpdateKeyword.vue'
  import DeleteKeyword from './DeleteKeyword.vue'

  defineOptions({
    name: 'Keyword'
  })

  defineProps({
    keyword: {
      type: Object,
      required: true
    }
  })

  defineEmits(['updated', 'deleted'])
</script>

<style scoped>
  .group :deep(.delete-btn) {
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .group:hover :deep(.delete-btn) {
    opacity: 1;
  }
</style>

