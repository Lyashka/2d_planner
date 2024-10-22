
<template>
  <v-navigation-drawer
    :rail="!isOpen"
    permanent
    location="right"
    :width="isOpen ? 500 : '100%'"
  >
    <v-btn class="py-6 mb-6" block variant="text" @click="isOpen = !isOpen">
      <v-icon :icon="isOpen ? mdiMenuClose : mdiMenuOpen" :size="35"/>
    </v-btn>

    <v-list v-if="!isOpen" class="py-0" nav>
      <v-row class="ga-4" no-gutters >
        <v-col>
          <v-list-item
            v-for="item in mainItems"
            :key="item.title"
            :prepend-icon="item.icon"
            :value="item.title"
            @click="changeMode(item.title)"
            :active="tab === item.title"
          >
            <v-tooltip
              activator="parent"
              location="left center"
              close-on-content-click
              contained
              location-strategy="connected"
              open-delay="1000"
              :text="item.subtitle"
            />
          </v-list-item>
        </v-col>
        <v-divider/>
        <v-col class="">
          <v-list-item
            class="ma-0"
            v-for="item in zoomItems"
            :key="item.title"
            :prepend-icon="item.icon"
            @click="zoomFloor(item.title)"
          >
            <v-tooltip
              activator="parent"
              location="left center"
              close-on-content-click
              contained
              location-strategy="connected"
              open-delay="1000"
              :text="item.subtitle"
            />
          </v-list-item>
        </v-col>
        <v-divider/>
        <v-col class="">
          <v-list-item
            class="ma-0"
            v-for="item in filesItems"
            :key="item.title"
            :prepend-icon="item.icon"
            @click="console.log(1)"
          >
            <v-tooltip
              activator="parent"
              location="left center"
              close-on-content-click
              contained
              location-strategy="connected"
              open-delay="1000"
              :text="item.subtitle"
            />
          </v-list-item>
        </v-col>
      </v-row>

    </v-list>

    <tabs-window v-else :tab="tab" @changeMode="changeMode"/>



  </v-navigation-drawer>


</template>

<script setup>
import { ref } from "vue";

import {
  mdiCropFree,
  mdiEye,
  mdiFloorPlan,
  mdiHomeCity,
  mdiMenuClose,
  mdiMenuOpen,
  mdiTableFurniture,
  mdiMagnifyPlusOutline,
  mdiImageFilterCenterFocus,
  mdiMagnifyMinusOutline,
  mdiContentSave, mdiDownload, mdiFileExport, mdiPrinter
} from '@mdi/js'
import TabsWindow from "./sideBarComponents/tabsWindow.vue";
import { useSettingsStore } from '../store/settingsStore'
import { drawMain } from '../composables/drawMain'
import { zoomToMiddle, centerProjection} from '../composables/zoomProjection'

const { settings } = useSettingsStore();

const mainItems = [
  { id: 0, title: 'FloorPlan', subtitle: 'Этаж' , icon: mdiFloorPlan },
  { id: 1, title: 'Room', subtitle: 'Комната' ,icon: mdiCropFree },
  { id: 2, title: 'Furniture', subtitle: 'Мебель' ,icon: mdiTableFurniture },
  { id: 3, title: 'Display', subtitle: 'Отображение' ,icon: mdiEye },
]
const zoomItems = [
  { title: 'Zoom+', subtitle: 'Приблизить' , icon: mdiMagnifyPlusOutline },
  { title: 'Center', subtitle: 'Фокус' , icon: mdiImageFilterCenterFocus },
  { title: 'Zoom-', subtitle: 'Отдалить' , icon: mdiMagnifyMinusOutline },
]

const filesItems = [
  { title: 'Save', subtitle: 'Сохранить' , icon: mdiContentSave },
  { title: 'Load', subtitle: 'Загрузить' , icon: mdiDownload },
  { title: 'Export', subtitle: 'Экспортировать' , icon: mdiFileExport },
  { title: 'Print', subtitle: 'Распечатать' , icon: mdiPrinter },
]

const isOpen=ref(false)
const tab = ref(mainItems[1].title)

function changeMode(title) {
  switch (title) {
    case 'FloorPlan':
      settings.value.mode = 0;
      tab.value = mainItems[0].title
      break;
    case 'Room':
      settings.value.mode = 1;
      tab.value = mainItems[1].title
      break;
    case 'Furniture':
      settings.value.mode = 2;
      tab.value = mainItems[2].title
      break;
    case 'Display':
      settings.value.mode = 3;
      tab.value = mainItems[3].title
      break;
  }
  drawMain();
}

function zoomFloor(zoomValue) {
  console.log(zoomValue)
  switch (zoomValue) {
    case 'Zoom+':
      zoomToMiddle(Math.pow(settings.value.zoomFactor, 4))
      break;
    case 'Center':
      centerProjection()
      break;
    case 'Zoom-':
      zoomToMiddle(1 / Math.pow(settings.value.zoomFactor, 4))
      break;
  }
}



</script>
