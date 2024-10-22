<template>



  <v-row class=" ga-4 " no-gutters>
    <v-col>
        <v-btn
          block
          variant="text"
          @click="saveFile"
        >
          <v-icon :icon="items[0].icon" :size="25" ></v-icon>
          <v-tooltip
            activator="parent"
            location="bottom center"
            close-on-content-click
            contained
            location-strategy="connected"
            open-delay="1000"
            :text="items[0].title"
          />
        </v-btn>
    </v-col>
    <v-col>
      <v-btn
        block
        variant="text"
        @click="$refs.inputUpload.click()"
      >
        <v-icon :icon="items[1].icon" :size="25" ></v-icon>
      </v-btn>
      <input v-show="false" ref="inputUpload" type="file" @change="loadFile" />
    </v-col>
    <v-col>
      <v-btn
        block
        variant="text"
        @click="exportFileAsPNG"
      >
        <v-icon :icon="items[2].icon" :size="25" ></v-icon>
        <v-tooltip
          activator="parent"
          location="bottom center"
          close-on-content-click
          contained
          location-strategy="connected"
          open-delay="1000"
          :text="items[2].title"
        />
      </v-btn>
    </v-col>

    <v-col>
      <v-btn
        block
        variant="text"
        @click="printFileAsPDF"
      >
        <v-icon :icon="items[3].icon" :size="25" ></v-icon>
        <v-tooltip
          activator="parent"
          location="bottom center"
          close-on-content-click
          contained
          location-strategy="connected"
          open-delay="1000"
          :text="items[3].title"
        />
      </v-btn>
    </v-col>

  </v-row>


</template>

<script setup lang="ts">
import { ref } from 'vue'
import {mdiContentSave, mdiDownload, mdiFileExport, mdiPrinter} from "@mdi/js";
import { saveAsJsonFile } from '../../composables/eventGroup/saveAsJsonFile'
import { loadInput } from '../../composables/eventGroup/loadFile'
import { exportButton } from '../../composables/eventGroup/exportFileAsPNG'
import { printButton } from '../../composables/eventGroup/printFileAsPDF'

const items = [
  {title: 'Save', icon: mdiContentSave},
  {title: 'Download', icon: mdiDownload},
  {title: 'Export', icon: mdiFileExport},
  {title: 'Print', icon: mdiPrinter},
]


const inputUpload = ref(null);

function saveFile() {
  saveAsJsonFile()
}

function loadFile() {
  loadInput(inputUpload)
}

function exportFileAsPNG() {
  exportButton()
}

function printFileAsPDF() {
  printButton()
}

</script>