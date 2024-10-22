<template>
  <v-col>
    <v-number-input
      v-model="LocalLWidthInput1"
      autocomplete="off"
      label="Ширина 1"
      :maxlength="5"
      :min="0"
      density="comfortable"
      variant="outlined"
      hide-spin-buttons
      inset
      control-variant="stacked"
      suffix="мм"
    />

    <v-number-input
      v-model="LocalLHeightInput1"
      autocomplete="off"
      label="Длина 1"
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
    <v-number-input
      v-model="LocalLWidthInput2"
      autocomplete="off"
      label="Ширина 2"
      :maxlength="5"
      :min="0"
      density="comfortable"
      variant="outlined"
      hide-spin-buttons
      inset
      control-variant="stacked"
      suffix="мм"
    />
    <v-number-input
      v-model="LocalLHeightInput2"
      autocomplete="off"
      label="Длина 2"
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
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
const emit = defineEmits(['inFocus', 'submit'])

const props = defineProps({
  LWidthInput1: Number,
  LHeightInput1: Number,
  LWidthInput2: Number,
  LHeightInput2: Number
})

const LocalLWidthInput1 = ref(1000)
const LocalLHeightInput1 = ref(2000)

const LocalLWidthInput2 = ref(1000)
const LocalLHeightInput2 = ref(1000)

watch([LocalLWidthInput1, LocalLHeightInput1, LocalLWidthInput2, LocalLHeightInput2], ([newLWidthInput1, newLHeightInput1, newLWidthInput2, newLHeightInput2]) => {
  emit('update:LWidthInput1', newLWidthInput1)
  emit('update:LHeightInput1', newLHeightInput1)
  emit('update:LWidthInput2', newLWidthInput2)
  emit('update:LHeightInput2', newLHeightInput2)
})

onMounted(() => {
  LocalLWidthInput1.value = props.LWidthInput1
  LocalLHeightInput1.value = props.LHeightInput1

  LocalLWidthInput2.value = props.LWidthInput2
  LocalLHeightInput2.value = props.LHeightInput2

})
</script>
