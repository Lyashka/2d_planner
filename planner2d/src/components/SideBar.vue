<script setup>
import { ref } from "vue";

import {
  mdiCropFree, mdiEye,
  mdiFloorPlan, mdiHomeCity,
  mdiMenuClose,
  mdiMenuOpen, mdiTableFurniture,
} from '@mdi/js';
import TabsWindow from "./sideBarComponents/tabsWindow.vue";
import { useSettingsStore } from '../store/settingsStore'
import { drawMain } from '../composables/drawMain'

const { settings } = useSettingsStore();

const items = [
  { id: 0, title: 'FloorPlan', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { id: 1, title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { id: 2, title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { id: 3, title: 'Display', subtitle: 'Отображение' ,icon: mdiEye },
]

const isOpen=ref(false)
const tab = ref(items[0].title)

function changeMode(title) {
  console.log(title);
  switch (title) {
    case 'FloorPlan':
      settings.value.mode = 0;
      tab.value = items[0].title
      break;
    case 'Room':
      settings.value.mode = 1;
      tab.value = items[1].title
      break;
    case 'Furniture':
      settings.value.mode = 2;
      tab.value = items[2].title
      break;
    case 'Display':
      settings.value.mode = 3;
      tab.value = items[3].title
      break;
  }
  drawMain();
}
</script>

<template>
  <v-navigation-drawer
    class="rounded-b-shaped"
    :class="isOpen ? 'h-100' : 'h-50'"
    :rail="!isOpen"
    permanent
    location="right"
    :width="isOpen ? 500 : '100%'"
  >
    <v-btn class="py-6" :class="isOpen ? '' : 'mb-10'" block variant="text" @click="isOpen = !isOpen">
      <v-icon :icon="isOpen ? mdiMenuClose : mdiMenuOpen" :size="35"/>
    </v-btn>
    <v-list  v-if="!isOpen" nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.icon"
        :value="item.title"
        @click="changeMode(item.title)"
        :active="tab === item.title"
      />
    </v-list>
    <tabs-window v-else :tab="tab"/>


  </v-navigation-drawer>
</template>
