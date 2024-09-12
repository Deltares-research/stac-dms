<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { Trash2, X } from "lucide-vue-next"
import { useForm, Form } from "vee-validate"
import { z } from "zod"
import DeleteFacility from "~/components/keywords/DeleteFacility.vue"
import FacilityGroupLink from "~/components/keywords/FacilityGroupLink.vue"
import LinkKeywordGroup from "~/components/keywords/LinkKeywordGroup.vue"
import { Select } from "~/components/ui/select"
import { toast } from "~/components/ui/toast"

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
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ facility?.name }}
      </h1>
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
