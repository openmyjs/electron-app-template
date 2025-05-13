// import './style/global.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' //路由
import { createPinia } from 'pinia' //全局
import Antd from 'ant-design-vue' //ui库
import 'ant-design-vue/dist/reset.css' //ui库
import i18n from './locales/i18n' //国际化
import '@renderer/styles/index.scss' //自定义css
// import 'ant-design-vue/dist/antd.css'
// import Particles from "vue3-particles";
import 'virtual:svg-icons-register' // vite 自动加载 svg 图标 文件
import Particles from '@tsparticles/vue3' // 动画
import { loadSlim } from '@tsparticles/slim' // 动画
import { getUrlParams } from '@renderer/utils'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(i18n)
// app.use(Particles);
app.use(Particles, {
  init: async (engine: any) => {
    await loadSlim(engine) // 加载完整的 tsParticles 库
  }
})

app
  .mount('#app')
  .$nextTick(() => {
    // console.log('renderer 加载完成')
    postMessage({ payload: 'removeLoading' }, '*')
  })
  .then(() => {
    // 操作缓存的方法

    const winId = getUrlParams(window.location.href).query.winId
    console.log('winId', window.location.href,winId)
    if (winId) {
      sessionStorage.setItem('win-id', winId)
    }
  })
