import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import './element-variables.scss'

const app = createApp(App)

app
  .use(router)
  .use(ElementPlus)
  .mount('#app')
