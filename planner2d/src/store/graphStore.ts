import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Graph } from '../defs'


export const useGraphStore = defineStore('graphStore',() => {

  const graph: Graph = ref({})

  return { graph }
});
