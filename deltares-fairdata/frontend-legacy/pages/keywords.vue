<script setup lang="ts">
import { usePermissions } from "~/composables/permissions"

let { requirePermission } = await usePermissions()

requirePermission("keyword:all")
</script>

<template>
  <div class="py-8 container mx-auto">
    <h1 class="font-semibold text-3xl">Keyword management</h1>
    <p class="text-muted-foreground text-sm mt-3">
      Keywords exist in a 3-tier hierarchy: domains contain keyword groups.
      Keyword groups contain keywords.
    </p>
    <hr class="my-5" />
    <div class="mx-auto grid grid-cols-4 gap-12">
      <div>
        <div
          class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
        >
          Section
        </div>
        <Lister class="mt-3">
          <ListerItem to="/keywords/facilities">Domains</ListerItem>
          <ListerItem to="/keywords/groups">Keyword groups</ListerItem>
        </Lister>
      </div>

      <div class="col-span-3">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
