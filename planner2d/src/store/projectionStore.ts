
import { defineStore } from 'pinia'

import { Projection } from '../classes/Pojection'

export const useProjectionStore = defineStore('projectionStore', () => {

  const projection= new Projection(0.1)
  const floorplanProjection = new Projection(0.1)


  return { projection, floorplanProjection }
})
