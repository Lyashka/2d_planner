

<template>
  <v-container class="pa-8">

    <v-row class="mb-2">
      <v-col>
        <v-text-field
          v-model="nameInput"
          autocomplete="off"
          label="Название стола"
          density="comfortable"
          hide-spin-buttons
          variant="outlined"
          inset
          control-variant="stacked"
        />
      </v-col>

    </v-row>
    <v-row class="ga-3" no-gutters>

      <TabFurnitureRectangleCircle
        v-if="inputType === typeTable[0] || inputType === typeTable[1]"
        :inputWeight="inputWeight"
        :inputHeight="inputHeight"
        @update:inputWeight="inputWeight = $event"
        @update:inputHeight="inputHeight = $event"
      />

      <TabFurnitureTypeL
        v-if="inputType === typeTable[2]"
        :LWidthInput1="LWidthInput1"
        :LHeightInput1="LHeightInput1"
        :LWidthInput2="LWidthInput2"
        :LHeightInput2="LHeightInput2"
        @update:LWidthInput1="LWidthInput1 = $event"
        @update:LHeightInput1="LHeightInput1 = $event"
        @update:LWidthInput2="LWidthInput2 = $event"
        @update:LHeightInput2="LHeightInput2 = $event"
      />

      <TabFurnitureTypeU
        v-if="inputType === typeTable[3]"
        :UWidthInput1="UWidthInput1"
        :UHeightInput1="UHeightInput1"
        :UWidthInput2="UWidthInput2"
        :UHeightInput2="UHeightInput2"
        :UWidthInput3="UWidthInput3"
        :UHeightInput3="UHeightInput3"
        @update:UWidthInput1="UWidthInput1 = $event"
        @update:UHeightInput1="UHeightInput1 = $event"
        @update:UWidthInput2="UWidthInput2 = $event"
        @update:UHeightInput2="UHeightInput2 = $event"
        @update:UWidthInput3="UWidthInput3 = $event"
        @update:UHeightInput3="UHeightInput3 = $event"
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
import TabFurnitureRectangleCircle from './tables/TabFurnitureRectangleCircle.vue'
import TabFurnitureTypeL from './tables/TabFurnitureTypeL.vue'
import TabFurnitureTypeU from './tables/TabFurnitureTypeU.vue'

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

// Table type Rectangle and Circle
const inputWeight = ref(1000)
const inputHeight = ref(1000)

// Table type L
const LWidthInput1 = ref(1000)
const LHeightInput1 = ref(2000)

const LWidthInput2 = ref(1000)
const LHeightInput2 = ref(1000)

// Table type U
const UWidthInput1 = ref(1000)
const UHeightInput1 = ref(2000)

const UWidthInput2 = ref(1000)
const UHeightInput2 = ref(1000)

const UWidthInput3 = ref(1000)
const UHeightInput3 = ref(2000)

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
    case typeTable[2]:
      settings.value.type = FurnitureType.L
      objSize = {
        LWidthInput1: LWidthInput1.value,
        LHeightInput1: LHeightInput1.value,
        LWidthInput2: LWidthInput2.value,
        LHeightInput2: LHeightInput2.value
      }
      addFurnitureButton(nameInput, objSize)
      break;
    case typeTable[3]:
      settings.value.type = FurnitureType.U
      objSize = {
        UWidthInput1: UWidthInput1.value,
        UHeightInput1: UHeightInput1.value,
        UWidthInput2: UWidthInput2.value,
        UHeightInput2: UHeightInput2.value,
        UWidthInput3: UWidthInput3.value,
        UHeightInput3: UHeightInput3.value
      }
      addFurnitureButton(nameInput, objSize)
      break;
  }
}

</script>
