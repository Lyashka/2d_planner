import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Graph } from '../defs'


export const useGraphStore = defineStore('graphStore',() => {

  const graph: Graph = reactive({})
  const floorPlanGraph: Graph = reactive({})

  return { graph, floorPlanGraph }
});
