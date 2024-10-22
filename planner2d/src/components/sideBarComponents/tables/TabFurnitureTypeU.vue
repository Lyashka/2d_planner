<template>
  <v-col>
    <v-number-input
      v-model="localUWidthInput1"
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
      v-model="localUHeightInput1"
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
      v-model="localUWidthInput2"
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
      v-model="localUHeightInput2"
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
  <v-col>
    <v-number-input
      v-model="localUWidthInput3"
      autocomplete="off"
      label="Ширина 3"
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
      v-model="localUHeightInput3"
      autocomplete="off"
      label="Длина 3"
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
  UWidthInput1: Number,
  UHeightInput1: Number,
  UWidthInput2: Number,
  UHeightInput2: Number,
  UWidthInput3: Number,
  UHeightInput3: Number
})

const localUWidthInput1 = ref(1000)
const localUHeightInput1 = ref(2000)

const localUWidthInput2 = ref(1000)
const localUHeightInput2 = ref(1000)

const localUWidthInput3 = ref(1000)
const localUHeightInput3 = ref(2000)

watch([localUWidthInput1, localUHeightInput1, localUWidthInput2, localUHeightInput2, localUWidthInput3, localUHeightInput3],([newUWidthInput1, newUHeightInput1, newUWidthInput2, newUHeightInput2, newUWidthInput3, newUHeightInput3]) => {
  emit('update:UWidthInput1', newUWidthInput1)
  emit('update:UHeightInput1', newUHeightInput1)
  emit('update:UWidthInput2', newUWidthInput2)
  emit('update:UHeightInput2', newUHeightInput2)
  emit('update:UWidthInput3', newUWidthInput3)
  emit('update:UHeightInput3', newUHeightInput3)
})

onMounted(() => {
  localUWidthInput1.value = props.UWidthInput1
  localUHeightInput1.value = props.UHeightInput1

  localUWidthInput2.value = props.UWidthInput2
  localUHeightInput2.value = props.UHeightInput2

  localUWidthInput3.value = props.UWidthInput3
  localUHeightInput3.value = props.UHeightInput3
})

</script>