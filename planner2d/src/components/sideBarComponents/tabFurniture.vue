<script setup>

import {mdiCircleOutline, mdiDuck, mdiPlus, mdiRectangleOutline, mdiUmbrellaBeach} from "@mdi/js";
import {reactive} from "vue";
import MenuGroupBtn from "./menuGroupBtn.vue";


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
  <v-container class="pa-8">

    <!--    <v-row class="ga-3" justify="space-between" no-gutters>-->
    <!--      <v-col cols="4">-->
    <!--        <v-number-input-->
    <!--            v-model="item.id"-->
    <!--            autocomplete="off"-->
    <!--            label="ID стола"-->
    <!--            :maxlength="2"-->
    <!--            :min="0"-->
    <!--            density="comfortable"-->
    <!--            hide-spin-buttons-->
    <!--            variant="outlined"-->
    <!--            inset-->
    <!--            control-variant="stacked"-->
    <!--        >-->
    <!--          <template v-slot:increment/>-->
    <!--          <template v-slot:decrement/>-->
    <!--        </v-number-input>-->
    <!--      </v-col>-->
    <!--      <v-col cols="auto">-->
    <!--        <v-btn-toggle-->
    <!--            v-model="item.type"-->
    <!--            mandatory-->
    <!--            divided-->
    <!--            color="primary"-->
    <!--            variant="outlined"-->
    <!--        >-->
    <!--          <v-btn :icon="mdiRectangleOutline" :value="typeTable[0]"></v-btn>-->
    <!--          <v-btn :icon="mdiCircleOutline" :value="typeTable[1]"></v-btn>-->
    <!--          <v-btn :icon="mdiDuck" :value="typeTable[2]"></v-btn>-->
    <!--          <v-btn :icon="mdiUmbrellaBeach" :value="typeTable[3]"></v-btn>-->
    <!--        </v-btn-toggle>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row justify="space-between" class="ga-3" no-gutters>-->
    <!--      <v-col cols="4">-->
    <!--        <v-number-input-->
    <!--            v-model="item.weight"-->
    <!--            autocomplete="off"-->
    <!--            label="Ширина"-->
    <!--            :maxlength="5"-->
    <!--            :min="0"-->
    <!--            density="comfortable"-->
    <!--            variant="outlined"-->
    <!--            hide-spin-buttons-->
    <!--            hide-details-->
    <!--            inset-->
    <!--            control-variant="stacked"-->
    <!--            suffix="мм"-->
    <!--        >-->
    <!--          <template v-slot:increment/>-->
    <!--          <template v-slot:decrement/>-->
    <!--        </v-number-input>-->
    <!--      </v-col>-->
    <!--      <v-col cols="4">-->
    <!--        <v-number-input-->
    <!--            v-model="item.height"-->
    <!--            autocomplete="off"-->
    <!--            label="Длина"-->
    <!--            :maxlength="5"-->
    <!--            :min="0"-->
    <!--            density="comfortable"-->
    <!--            hide-spin-buttons-->
    <!--            hide-details-->
    <!--            variant="outlined"-->
    <!--            inset-->
    <!--            control-variant="stacked"-->
    <!--            suffix="мм"-->
    <!--        >-->
    <!--          <template v-slot:increment/>-->
    <!--          <template v-slot:decrement/>-->
    <!--        </v-number-input>-->
    <!--      </v-col>-->
    <!--      <v-col cols="auto">-->
    <!--        <v-btn-->
    <!--            class="h-100"-->
    <!--            variant="text"-->
    <!--        >-->
    <!--          <v-icon :icon="mdiPlus" :size="30"></v-icon>-->
    <!--        </v-btn>-->
    <!--      </v-col>-->
    <!--    </v-row>-->


    <v-row class="ga-3" no-gutters>
      <v-col cols="6">
        <v-number-input
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
        >
          <template v-slot:increment />
          <template v-slot:decrement />
        </v-number-input>
      </v-col>
      <v-col>
        <v-number-input
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
        >
          <template v-slot:increment />
          <template v-slot:decrement />
        </v-number-input>
      </v-col>
      <v-col>
        <v-number-input
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
        >
          <template v-slot:increment />
          <template v-slot:decrement />
        </v-number-input>
      </v-col>
    </v-row>
    <v-spacer />
    <v-row class="mb-12" no-gutters>
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
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          class="h-100"
          variant="text"
        >
          <v-icon :icon="mdiPlus" :size="30"></v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <menu-group-btn />
  </v-container>
</template>
