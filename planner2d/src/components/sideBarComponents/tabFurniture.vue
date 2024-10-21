

<template>
  <v-container class="pa-8">

    <v-row class="ga-3" no-gutters>
      <v-col cols="6">
        <v-text-field
          v-model="nameInput"
          autocomplete="off"
          label="Название стола"
          density="comfortable"
          hide-spin-buttons
          variant="outlined"
          inset
          control-variant="stacked"
        >

        </v-text-field>
      </v-col>

      <TabFurnitureRectangle
        :inputWeight="inputWeight"
        :inputHeight="inputHeight"
        @update:inputWeight="inputWeight = $event"
        @update:inputHeight="inputHeight = $event"
      />

    </v-row>
    <v-spacer />
    <v-row class="mb-12" no-gutters>
      <v-col>
        <v-btn-toggle
          v-model="inputType"
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
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          class="h-100"
          variant="text"
          @click="addFurniture"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <menu-group-btn />
  </v-container>
</template>

<script setup>
import TabFurnitureRectangle from './tables/TabFurnitureRectangle.vue'
import { addFurnitureButton } from '../../composables/addFurniture'

import { useSettingsStore } from '../../store/settingsStore'

import {mdiCircleOutline, mdiDuck, mdiPlus, mdiRectangleOutline, mdiUmbrellaBeach} from "@mdi/js";
import { ref } from 'vue'
import MenuGroupBtn from "./menuGroupBtn.vue";

const { settings } = useSettingsStore()
import { FurnitureType } from '../../defs'

const typeTable = [
  'Прямоугольник','Круг','Угловой','П'
]

const nameInput = ref('NameInput')

const inputWeight = ref(1000)
const inputHeight = ref(1000)

const inputType = ref(typeTable[0])

function addFurniture() {
  let objSize = {}
  switch (inputType.value) {
    case typeTable[0]:
      settings.value.type = FurnitureType.Rectangle
      objSize = {
        widthInput: inputWeight.value,
        heightInput: inputHeight.value
      }
      addFurnitureButton(nameInput, objSize)
      break;
    case typeTable[1]:
      settings.value.type = FurnitureType.Circle
      objSize = {
        circleWidthInput: inputWeight.value,
        circleHeightInput: inputHeight.value
      }
      addFurnitureButton(nameInput, objSize)
      break;
  }

}

</script>
