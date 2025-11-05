import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import 'unfonts.css'
import { registerPlugins } from '@/plugins'
import 'leaflet/dist/leaflet.css'


import { createPinia } from 'pinia'


const app = createApp(App)


const pinia = createPinia()
app.use(pinia) 


const vuetify = createVuetify()
app.use(vuetify)


app.use(router)
registerPlugins(app)


router.isReady().then(() => app.mount('#app'))
