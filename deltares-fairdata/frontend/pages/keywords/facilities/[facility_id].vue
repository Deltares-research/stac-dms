<template>
  <div v-if="facility">
    <div class="text-uppercase text-caption text-grey-darken-1 font-weight-bold mb-3">
      Domain
    </div>
    
    <div class="d-flex align-center justify-space-between mb-4 gap-2">
      <UpdateFacility
        :facility="facility"
        @updated="handleUpdate"
      />
      <DeleteFacility
        :facility-id="facilityId"
      />
    </div>

    <v-list class="mt-5" density="compact">
      <v-list-item
        v-for="group in keywordGroups"
        :key="group.id"
        class="mb-1"
      >
        <FacilityGroupLink
          :group="group"
          :facility-id="facilityId"
          @unlinked="handleUnlink"
        />
      </v-list-item>
    </v-list>

    <v-divider class="my-8" />

    <LinkKeywordGroup
      :facility-id="facilityId"
      @linked="handleLink"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchFacilityById, fetchKeywordsByFacilityId } from '~/requests/keywords'
  import UpdateFacility from '~/components/keywords/UpdateFacility.vue'
  import DeleteFacility from '~/components/keywords/DeleteFacility.vue'
  import FacilityGroupLink from '~/components/keywords/FacilityGroupLink.vue'
  import LinkKeywordGroup from '~/components/keywords/LinkKeywordGroup.vue'

  defineOptions({
    name: 'KeywordsFacilityDetailPage'
  })

  const route = useRoute()
  const facilityId = route.params.facility_id
  const facility = ref(null)
  const keywordGroups = ref([])

  async function loadData() {
    try {
      const [facilityData, groupsData] = await Promise.all([
        fetchFacilityById(facilityId),
        fetchKeywordsByFacilityId(facilityId)
      ])
      facility.value = facilityData
      keywordGroups.value = groupsData || []
    } catch (error) {
      console.error('Error loading facility data:', error)
    }
  }

  function handleUpdate() {
    loadData()
  }

  function handleLink() {
    loadData()
  }

  function handleUnlink() {
    loadData()
  }

  onMounted(async () => {
    await loadData()
  })

  watch(
    () => route.params.facility_id,
    async (newId) => {
      if (newId) {
        await loadData()
      }
    }
  )
</script>

