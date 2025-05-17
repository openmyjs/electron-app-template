
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue' //ui库
import './styles/styles.scss' //自定义css
import 'ant-design-vue/dist/reset.css' //ui库
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
