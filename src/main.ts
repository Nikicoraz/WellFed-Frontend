import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './extensions/router'
import { i18n } from './extensions/i18n'
import google from 'vue3-google-login';


createApp(App).use(router).use(i18n).use(google, {clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID}).mount('#app')
