import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import './element-variables.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// eslint-disable-next-line
// @ts-ignore
import { Vue3Mq } from "vue3-mq";

library.add(fas, far)

const app = createApp(App)
app
  .use(router)
  .use(ElementPlus)
  .use(Vue3Mq, {
    breakpoints: {
      sm: 0,
      md: 750,
      lg: 960,
    }
  })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
