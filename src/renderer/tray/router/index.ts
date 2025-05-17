import { createRouter, createWebHashHistory, type Router } from 'vue-router'

import NotFoundIndex from '@tray/components/NotFound/index.vue'
import rightView from '@tray/views/right/right.vue'
import leftView from '@tray/views/left/left.vue'
import middle from './middle'
const routesList = [
  {
    path: '/right',
    component: rightView,
  },
  {
    path: '/left',
    component: leftView,
  },
  {
    path: '/:pathMatch(.*)*', // 通配符路由，匹配所有未定义的路径
    component: NotFoundIndex
  }
]
const router: Router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routesList
})
middle(router, routesList)
export default router
