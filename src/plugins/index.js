/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import  router  from '../router'
// import { createPinia } from 'pinia'
import i18n from './i18n'

export function registerPlugins (app) {

  // const pinia = createPinia()
  // app.use(pinia)

  app.use(vuetify)
  app.use(i18n)

  app.use(router)
}
