<script setup>

import {reactive} from "vue";
import MenuGroupBtn from "./menuGroupBtn.vue";

const mdiCircleOutline = 'mdi-circle-outline'
const mdiDuck = 'mdi-duck'
const mdiPlus = 'mdi-plus'
const mdiRectangleOutline = 'mdi-rectangle-outline'
const mdiUmbrellaBeach = 'mdi-umbrella-beach'

const typeTable = [
  'Прямоугольник','Круг','Угловой','П'
]

const item = reactive({
  id: '',
  type: typeTable[0],
  weight: 1000,
  height: 1000,
  activity: '',
});

</script>

<template>
  <v-container class="pa-8 mb-4">


    <v-row class="ga-3" no-gutters>
      <v-col cols="6">
        <v-text-field
          type="number"
            v-model="item.id"
            autocomplete="off"
            label="ID стола"
            :maxlength="2"
            :min="0"
            density="comfortable"
            hide-spin-buttons
            variant="outlined"
            inset
            control-variant="stacked"
        />
      </v-col>
      <v-col>
        <v-text-field
            v-model="item.weight"
            autocomplete="off"
            label="Ширина"
            :maxlength="5"
            :min="0"
            density="comfortable"
            variant="outlined"
            hide-spin-buttons
            inset
            control-variant="stacked"
            suffix="мм"
        />
      </v-col>
      <v-col>
        <v-text-field
            v-model="item.height"
            autocomplete="off"
            label="Длина"
            :maxlength="5"
            :min="0"
            density="comfortable"
            hide-spin-buttons
            variant="outlined"
            inset
            control-variant="stacked"
            suffix="мм"
        />
      </v-col>
    </v-row>
      <v-spacer/>
    <v-row no-gutters>
      <v-col>
        <v-btn-toggle
            v-model="item.type"
            mandatory
            divided
            color="primary"
            variant="outlined"
        >
          <v-btn :icon="mdiRectangleOutline" :value="typeTable[0]"></v-btn>
          <v-btn :icon="mdiCircleOutline" :value="typeTable[1]"></v-btn>
          <v-btn :icon="mdiDuck" :value="typeTable[2]"></v-btn>
          <v-btn :icon="mdiUmbrellaBeach" :value="typeTable[3]"></v-btn>
        </v-btn-toggle>
      </v-col>
      <v-spacer/>
      <v-col cols="auto">
        <v-btn
            class="h-100"
            variant="text"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <menu-group-btn/>
</template>
