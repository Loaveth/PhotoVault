import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}