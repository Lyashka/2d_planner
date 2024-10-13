<script setup>

const mdiContentSave = 'mdi-content-save'
const mdiDownload = 'mdi-download'
const mdiFileExport = 'mdi-file-export'
const mdiPrinter = 'mdi-printer'

const items = [
  {title: 'Save', icon: mdiContentSave},
  {title: 'Download', icon: mdiDownload},
  {title: 'Export', icon: mdiFileExport},
  {title: 'Print', icon: mdiPrinter},
]
</script>

<template>
  <v-row class=" ga-4 " no-gutters>
    <v-col
        v-for="(item, index) in items"
        :key="item.title">
      <v-btn
          block
          variant="text"
      >
        <v-icon :icon="item.icon" :size="25" ></v-icon>
        <v-tooltip
            activator="parent"
            location="bottom center"
            close-on-content-click
            contained
            location-strategy="connected"
            open-delay="1000"
            :text="item.title"
        />
      </v-btn>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>


<!--  <v-btn-group class="d-flex justify-space-between border-sm rounded-xl">-->
<!--    <v-btn-->
<!--        class="px-10"-->
<!--        v-for="(item, index) in items"-->
<!--        :key="item.title"-->
<!--    >-->
<!--      &lt;!&ndash;        сделать подсказку при наведении что за действие&ndash;&gt;-->
<!--      <v-icon :icon="item.icon"></v-icon>-->
<!--    </v-btn>-->
<!--  </v-btn-group>-->