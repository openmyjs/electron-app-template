import type { Router } from 'vue-router'
import NProgress from 'nprogress'
/** NProgress是一个轻量级的JavaScript库，主要用于在页面加载时显示一个进度条，类似于YouTube、Medium等网站的页面加载指示器*/
export default function (router: Router) {
  router.beforeEach(async () => {
    NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done() // finish progress bar
  })
  router.onError((error) => {
    console.log('路由错误', error)
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500)
  })
}
