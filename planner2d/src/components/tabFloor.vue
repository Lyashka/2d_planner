<script setup>

import {mdiDelete, mdiDownload} from "@mdi/js";
import { ref } from "vue";
import MenuGroupBtn from "./menuGroupBtn.vue";

const widthFloor = ref(1000)
</script>

<template>
  <v-sheet class="pa-8 mb-4">
    <v-row class="ga-3 justify-space-between align-center mb-8" no-gutters>
      <v-col cols="3">
        <v-text-field
            type="number"
            v-model="widthFloor"
            autocomplete="off"
            label="Ширина"
            :maxlength="5"
            :min="0"
            density="comfortable"
            variant="outlined"
            hide-spin-buttons
            hide-details
            inset
            control-variant="stacked"
            suffix="мм"
        />
      </v-col>
      <v-spacer/>
      <v-col cols="auto">
        <v-btn
            class="'text-surface', 'bg-primary', 'text-caption', 'text-sm-button', 'text-uppercase'"
            variant="outlined"
        >
          <v-icon cl :icon="mdiDownload"/>
          <span class="ml-2">Загрузить</span>
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
            class="'text-surface', 'bg-primary', 'text-caption', 'text-sm-button', 'text-uppercase'"
            variant="outlined"
        >
          <v-icon :icon="mdiDelete"/>
          <span class="ml-2">Удалить</span>
        </v-btn>
      </v-col>
    </v-row>
    <menu-group-btn/>
  </v-sheet>
</template>

<style scoped>

</style>