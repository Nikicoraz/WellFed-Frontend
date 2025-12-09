import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './extensions/router'
import { i18n } from './extensions/i18n'

createApp(App).use(router).use(i18n).mount('#app')
