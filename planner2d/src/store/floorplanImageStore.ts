import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import { FloorplanImage } from '../defs'
import { Rectangle } from '../classes/Rectangle'
import { Openable } from '../classes/Openable'
import { Circle } from '../classes/Circle'
import { Ellipse } from '../classes/Ellipse'

export const useFloorplanImageStore = defineStore('floorplanImageStore', () => {

  const floorplanImage: FloorplanImage= ref({})

  const labels: Rectangle[] = reactive([]);
  const openables: Openable[] = reactive([]);
  const furniture: (Circle | Ellipse | Rectangle)[] = reactive([]);

  return { floorplanImage, labels, openables, furniture }
})

