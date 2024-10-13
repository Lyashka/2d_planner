import { defineStore } from 'pinia'

import { ref } from 'vue'


import { Settings} from '../defs'


export const useSettingsStore = defineStore('settingsStore',() => {

 const settings: Settings = ref({})

 return { settings }
});
