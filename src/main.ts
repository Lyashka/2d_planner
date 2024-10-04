import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import categoryList from '/planner2d/src/planner2d.js';
import VueKonva from 'vue-konva';


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(categoryList)
app.use(VueKonva);


app.mount('#app')
