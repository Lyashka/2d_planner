import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCanvasStore = defineStore('canvasStore', () => {

  const canvas = ref({})
  const ctx = ref({})

return { canvas, ctx }
})

