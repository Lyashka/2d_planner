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
          @input="setNodeTransSize"

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
          @input="setNodeExtendSize"
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
          v-model="labelNameInput"
          label="Название"
          density="comfortable"
          hide-details
        />
      </v-col>
      <v-col cols="3">
        <v-number-input
          v-model="labelHeightInput"
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
          @click="addLabelButton"
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
          v-model="currTypeDoor"
          mandatory
          divided
          color="primary"
          variant="outlined"
        >
          <v-btn
            :value="typeDoor[0]"
            @click="changeToLeftOpenableType">
            <v-icon :icon="mdiRectangleOutline" :size="30"></v-icon>
          </v-btn>
          <v-btn
            :value="typeDoor[1]"
            @click="changeToRightOpenableType">
            <v-icon :icon="mdiCircleOutline" :size="30"></v-icon>
          </v-btn>
          <v-btn
            :value="typeDoor[2]"
            @click="changeToDoubleOpenableType">
            <v-icon :icon="mdiDuck" :size="30"></v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="3">
        <v-number-input
          v-model="openableWidthInput"
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
          @click="addOpenableButton"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <menu-group-btn />
  </v-container>
</template>

<script setup>

import { mdiCircleOutline, mdiDuck, mdiPlus, mdiRectangleOutline } from "@mdi/js";
import { reactive, ref } from 'vue'
import MenuGroupBtn from "./menuGroupBtn.vue";

import { useSettingsStore} from '../../store/settingsStore'
import { useProjectionStore } from '../../store/projectionStore'
import { useFloorplanImageStore } from '../../store/floorplanImageStore'
import { useCanvasStore } from '../../store/canvasStore'

import { drawMain } from '../../composables/drawMain'
import { getText } from '../../composables/getText'
import { loc } from '../../composables/loc'
import { setFontSize } from '../../composables/updateCtx'
import { validNumericInput } from '../../composables/calculations'

import { Rectangle } from '../../classes/Rectangle'
import { MovableType, OpenableType } from '../../defs'
import { Openable } from '../../classes/Openable'

const { settings } = useSettingsStore()
const { projection } = useProjectionStore()
const { labels, openables } = useFloorplanImageStore()
const { ctx } = useCanvasStore()

const typeDoor = [
  'Left', 'Right', 'Double'
]

const corner = reactive({
  center: 0,
  ring: 0
})

const openableWidthInput = ref(1000)
const currTypeDoor = ref(typeDoor[0])

const labelNameInput = ref('room')
const labelHeightInput = ref(1000)

const nodeTransSlider = ref(50)
const nodeExtendSlider = ref(150)


function setNodeTransSize() {
  settings.value.nodeTransSize = Number(nodeTransSlider.value);
  settings.value.nodeExtendSize = Math.max(settings.value.nodeExtendSize, settings.value.nodeTransSize);

  nodeExtendSlider.value = String(settings.value.nodeExtendSize);

  drawMain();
}

function addLabelButton() {
  if (!validNumericInput(labelHeightInput.value) || !labelNameInput.value) {
    alert(getText(loc.room.label.inputError));
    return;
  }
  const start = projection.to({ x: 10, y: 100 });
  setFontSize(labelHeightInput.value)
  labels.push(new Rectangle(labelNameInput.value, MovableType.Rectangle, start.x, start.y, ctx.value.measureText(labelNameInput.value).width, labelHeightInput.value));
  console.log("add Label:", labelNameInput.value);
  drawMain();
}

function setNodeExtendSize() {

  settings.value.nodeExtendSize = Number(nodeExtendSlider.value);
  settings.value.nodeTransSize = Math.min(settings.value.nodeExtendSize, settings.value.nodeTransSize);

  nodeTransSlider.value = String(settings.value.nodeTransSize);

  drawMain();
}

function changeToLeftOpenableType() {
  settings.value.openableType = OpenableType.Left;
}

function changeToRightOpenableType() {
  settings.value.openableType = OpenableType.Right
}

function changeToDoubleOpenableType() {
  settings.value.openableType = OpenableType.Double
}


function addOpenableButton() {
  if (!validNumericInput(openableWidthInput.value)) {
    alert(getText(loc.room.openable.inputError));
    return;
  }
  const start = projection.to({ x: 10, y: 100 })
  openables.push(new Openable(settings.value.openableType, start.x, start.y, openableWidthInput.value, 180))
  console.log("add Openable:", settings.value.openableType)
  drawMain()
}
</script>