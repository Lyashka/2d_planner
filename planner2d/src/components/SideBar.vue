<script setup>
import {reactive, ref} from "vue";

import {
  mdiCropFree, mdiEye,
  mdiFloorPlan, mdiHomeCity,
  mdiMenuClose,
  mdiMenuOpen, mdiTableFurniture,
} from '@mdi/js';
import TabsWindow from "./sideBarComponents/tabsWindow.vue";

const items = [
  { title: 'Floor', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { title: 'Display', subtitle: 'Отображение' ,icon: mdiEye },
]

const isOpen=ref(false)
const tab = ref(items[0].title)

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
        @click="tab=item.title"
        :active="tab===item.title"
      />
    </v-list>
    <tabs-window v-else :tab="tab"/>


  </v-navigation-drawer>
</template>
