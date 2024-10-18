<script setup>

import TabFurniture from "./tabFurniture.vue";
import TabRoom from "./tabRoom.vue";
import TabFloor from "./tabFloor.vue";
import { ref } from "vue";
import { mdiCropFree, mdiEye, mdiFloorPlan, mdiTableFurniture } from "@mdi/js";

const props = defineProps({
  tab: String
})

const tab = ref(props.tab)
const items = [
  { id: 0, title: 'FloorPlan', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { id: 1, title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { id: 2, title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { id: 3, title: 'Display', subtitle: 'Отображение' ,icon: mdiEye },
]




</script>

<template>
  <v-tabs
    class="border-sm border-opacity-0"
    stacked
    v-model="tab"
  >
    <v-tab
      class="flex-0-1-100 h-100"
      v-for="item in items"
      :key="item.title"
      :value="item.title"
      @click="$emit('changeMode',item.title)"
    >
      <v-icon class="mb-1" :icon="item.icon" :size="35"/>
      <v-list-item-title>{{ item.subtitle }}</v-list-item-title>

    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item
      :value="items[0].title"
    >
      <tab-floor />
    </v-tabs-window-item>
    <v-tabs-window-item
      :value="items[1].title"
    >
      <tab-room />
    </v-tabs-window-item>
    <v-tabs-window-item
      :value="items[2].title"
    >
      <tab-furniture />
    </v-tabs-window-item>
  </v-tabs-window>
</template>
