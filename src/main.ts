import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './extensions/router'
import { i18n } from './extensions/i18n'
import google from 'vue3-google-login';


createApp(App).use(router).use(i18n).use(google, {clientId: "43282625022-3kh9onnp8f7slcgd4f6a0gu4dmcsligf.apps.googleusercontent.com"}).mount('#app')
