<template>
  <v-container class="pa-0 fill-height" fluid src="../assets/background.png">
    <v-row class="fill-height" no-gutters>

      <v-col class="pa-4" cols="12" md="4">
        <div class="left-scroll">
          <QuestionsList />
        </div>
      </v-col>

      <v-col class="pa-4" cols="12" md="8">
        <StorageOptionsGrid />
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>

  import QuestionsList from '@/components/QuestionsList.vue'
  import StorageOptionsGrid from '@/components/StorageOptionsGrid.vue'

</script>

<style scoped>

.fill-height {
  height: 100vh;
}

.left-scroll {
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.left-scroll::-webkit-scrollbar {
  width: 8px;
}

.left-scroll::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.2);
}

.left-scroll::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}

</style>
