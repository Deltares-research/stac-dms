<script setup lang="ts">
import DeleteFacility from "~/components/keywords/DeleteFacility.vue"
import FacilityGroupLink from "~/components/keywords/FacilityGroupLink.vue"
import LinkKeywordGroup from "~/components/keywords/LinkKeywordGroup.vue"
import UpdateFacility from "~/components/keywords/UpdateFacility.vue"

let route = useRoute()

let facility_id = route.params.facility_id as string

let { data: facility } = await useApi(`/facility/{facility_id}`, {
  path: {
    facility_id: route.params.facility_id as string,
  },
})

let { data: keywordgroups, refresh } = await useApi("/keywords", {
  query: {
    facility_id: route.params.facility_id as string,
  },
})
</script>

<template>
  <div v-if="facility">
    <div
      class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"
    >
      Facility
    </div>
    <div class="mt-3 flex items-center justify-between gap-1.5">
      <UpdateFacility :facility="facility" />
      <DeleteFacility :facility_id="facility_id" />
    </div>

    <ul class="mt-5 flex flex-col gap-1">
      <li v-for="group in keywordgroups" :key="group.id">
        <FacilityGroupLink
          :group="group"
          :facility_id="facility_id"
          @unlink="refresh"
        />
      </li>
    </ul>

    <hr class="my-8" />

    <LinkKeywordGroup
      :facility_id="route.params.facility_id as string"
      @link="refresh"
    />
  </div>
</template>
