<script setup>

import { mdiCircleOutline, mdiDuck, mdiPlus, mdiRectangleOutline } from "@mdi/js";
import { reactive } from "vue";
import MenuGroupBtn from "./menuGroupBtn.vue";

const typeDoor = [
  'Левая', 'Правая', 'Двойная'
]

const corner = reactive({
  center: 0,
  ring: 0
})

const label = reactive({
  width: 1000,
  name: '',
})

const door = reactive({
  width: 1000,
  type: typeDoor[0],
})

</script>

<template>
  <v-container class="pa-8">
    <v-row class="ga-3 mb-4" no-gutters>
      <v-col cols="12" class="text-h6 text-center">
        Размер узлов
      </v-col>
      <v-col>
        <v-slider
          v-model="corner.center"
          color="orange"
          label="Центр"
          :max="corner.ring"
          hide-details
        />
        <!--                  {{corner.center}}-->
      </v-col>
      <v-col>
        <v-slider
          v-model="corner.ring"
          color="orange"
          label="Кольцо"
          :min="corner.center"
          hide-details
        />
        <!--                  {{corner.ring}}-->
      </v-col>
    </v-row>
    <v-row class="ga-3 mb-4 align-center justify-space-between" no-gutters>
      <v-col cols="12" class="text-h6 text-center">
        Текстовое поле
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="label.name"
          label="Название"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="3">
        <v-number-input
          v-model="label.width"
          autocomplete="off"
          label="Длина"
          :maxlength="5"
          :min="0"
          density="comfortable"
          variant="outlined"
          hide-spin-buttons
          inset
          hide-details
          control-variant="stacked"
          suffix="мм"
        >
          <template v-slot:increment />
          <template v-slot:decrement />
        </v-number-input>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          class="'text-surface', 'bg-primary', 'text-caption', 'text-sm-button', 'text-uppercase'"
          variant="text"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="ga-3 align-center justify-space-between mb-12" no-gutters>
      <v-col cols="12" class="text-h6 text-center">
        Двери
      </v-col>
      <v-col cols="6">
        <v-btn-toggle
          v-model="door.type"
          mandatory
          divided
          color="primary"
          variant="outlined"
        >
          <v-btn :value="typeDoor[0]">
            <v-icon :icon="mdiRectangleOutline" :size="30"></v-icon>
          </v-btn>
          <v-btn :value="typeDoor[1]">
            <v-icon :icon="mdiCircleOutline" :size="30"></v-icon>
          </v-btn>
          <v-btn :value="typeDoor[2]">
            <v-icon :icon="mdiDuck" :size="30"></v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="3">
        <v-number-input
          v-model="door.width"
          autocomplete="off"
          label="Ширина"
          :maxlength="5"
          :min="0"
          density="comfortable"
          variant="outlined"
          hide-spin-buttons
          inset
          hide-details
          control-variant="stacked"
          suffix="мм"
        >
          <template v-slot:increment />
          <template v-slot:decrement />
        </v-number-input>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          class="'text-surface', 'bg-primary', 'text-caption', 'text-sm-button', 'text-uppercase'"
          variant="text"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <menu-group-btn />
  </v-container>
</template>
