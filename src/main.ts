import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import vuetify from '../planner2d/src/plugins/vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'
// import '@mdi/font/css/materialdesignicons.css'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

import VueKonva from 'vue-konva';

// const vuetify = createVuetify({
//   components,
//   directives,
// })

const app = createApp(App)
app.use(createPinia())

app.use(router)

app.use(VueKonva);

app.use(vuetify);

app.mount('#app')
