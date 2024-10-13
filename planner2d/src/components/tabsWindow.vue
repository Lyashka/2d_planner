<script setup>

import TabFurniture from "./tabFurniture.vue";
import TabRoom from "./tabRoom.vue";
import TabFloor from "./tabFloor.vue";
import {ref} from "vue";


const mdiCropFree = 'mdi-crop-free'
const mdiEye = 'mdi-eye'
const mdiFloorPlan = 'mdi-floor-plan'
const mdiTableFurniture = 'mdi-table-furniture'

const props = defineProps({
  tab: String
})

const tab = ref(props.tab)
console.log(tab.value)
const items = [
  { title: 'Floor', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { title: 'Display', subtitle: 'Дисплей' ,icon: mdiEye },

]
</script>

<template>
  <div>

    <v-tabs
      stacked
      v-model="tab"
    >
      <v-tab
        class="flex-0-1-100 h-100"
        v-for="item in items"
        :key="item.title"
        :value="item.title"
      >
        <v-icon class="mb-1" :icon="item.icon" :size="35"/>
        <v-list-item-title>{{ item.subtitle }}</v-list-item-title>
      </v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        :value="items[0].title"
      >
        <tab-floor/>
      </v-tabs-window-item>
      <v-tabs-window-item
        :value="items[1].title"
      >
        <tab-room/>
      </v-tabs-window-item>
      <v-tabs-window-item
        :value="items[2].title"
      >
        <tab-furniture/>
      </v-tabs-window-item>
      <v-tabs-window-item
        :value="items[3].title"
      >
        <div> display </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

</template>

<style scoped>

</style>