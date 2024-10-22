<template>
  <v-col>
    <v-number-input
      v-model="localInputWeight"
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
      v-model="localInputHeight"
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
</template>

<script setup lang="ts">

import { onMounted, ref, watch } from 'vue'
const emit = defineEmits(['inFocus', 'submit'])

const localInputWeight = ref(1000)
const localInputHeight = ref(1000)

const props = defineProps({
  inputWeight: Number,
  inputHeight: Number
})

watch([localInputWeight, localInputHeight], ([newWeight, newHeight]) => {
  emit('update:inputWeight', newWeight)
  emit('update:inputHeight', newHeight)
})

onMounted(() => {
  localInputWeight.value = props.inputWeight
  localInputHeight.value = props.inputHeight
})

</script>