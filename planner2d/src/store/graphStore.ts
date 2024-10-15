import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { Graph } from '../defs'


export const useGraphStore = defineStore('graphStore',() => {

  const graph: Graph = reactive({})

  return { graph }
});
