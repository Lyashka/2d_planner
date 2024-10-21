import { defineStore } from 'pinia'
import { ref } from 'vue'
import { optionalString } from '../defs'


export const useStateStore = defineStore('stateStore',() => {

  const state : optionalString = ref(null)

  function setState(newState) {
    state.value = newState
  }
  return { state, setState }
});
