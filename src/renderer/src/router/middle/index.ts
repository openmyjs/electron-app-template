import type { Router } from 'vue-router'

import interceptor from './module/interceptor'
import NProgress from './module/NProgress'
import breadcrumb from './module/breadcrumb'
// import pageUnload from './module/pageUnload'
/** 路由守卫中间件处理*/
export default function (router: Router, routesList) {
  // 进度条
  NProgress(router)
  // 拦截器
  interceptor(router)

  // 面包屑
  breadcrumb(router, routesList)
  // pageUnload(router)
}
