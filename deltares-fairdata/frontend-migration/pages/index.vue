<template>
  <v-container fluid class="pa-0 ma-0 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col
        :cols="12"
        :md="6"
        class="fill-height"
      >
        <v-sheet height="100%">
          <p>content</p>
        </v-sheet>
      </v-col>

      <v-col
        :cols="12"
        :md="6"
        class="fill-height"
      >
        <v-sheet height="100%">
          <map-component />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

