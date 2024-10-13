import { defineStore } from 'pinia'

export const useCanvasStore = defineStore('canvasStore', {

  state: () => ({
    canvas: {},
    ctx: {},
  })

})

