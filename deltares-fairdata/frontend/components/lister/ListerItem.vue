<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <li class="w-full block">
    <NuxtLink
      :to="to"
      active-class="bg-white shadow-sm"
      class="rounded px-3 py-1.5 text-sm font-medium w-full block"
    >
      <slot />
    </NuxtLink>
  </li>
</template>
