import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Header from './components/HeaderComponent.vue'
import Navigation from './components/NavigationComponent.vue'
import AudioPlayer from './components/AudioPlayerComponent.vue'

const app = createApp(App)

app.use(createPinia())
app.component('Header', Header)
app.component('AudioPlayer', AudioPlayer)
app.component('Navigation', Navigation)
app.use(router)

app.mount('#app')
