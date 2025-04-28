import { createRouter, createWebHashHistory, createWebHistory, type Router } from 'vue-router'

import NotFoundIndex from './NotFound/index.vue'
import { layoutHost ,layoutHome,layoutyiyang} from '../layout' //子路由布局容器
import { pmChildren,yiYangChildren } from './subroute' //子路由统一配置
// import { i18n } from '@/i18n'
import middle from './middle'
const routesList = [
  {
    path: '/',
    component: layoutHome,
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    children: [
      {
        path: '/',
        component: () => import('@renderer/views/home/home.vue'),
        meta: {
          requiresAuth: false // 需要登录
        }
      }
    ]
  },
  {
    path: '/pm',
    component: layoutHost,
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    children: pmChildren
  },
  {
    path: '/yiyang',
    component: layoutyiyang,
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    children: yiYangChildren
  },

  {
    path: '/host',
    component: layoutHost,
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    children: [
      {
        path: '/host',
        component: () => import('@renderer/views/host/host.vue'),
        meta: {
          requiresAuth: false // 需要登录
        }
      },
      {
        path: '/host/dataTemplate',
        component: () => import('@renderer/views//host/dataTemplate/dataTemplate.vue'),
        meta: {
          requiresAuth: false // 需要登录
        }
      },
      {
        path: '/host/dataList',
        component: () => import('@renderer/views//host/dataList/dataList.vue'),
        meta: {
          requiresAuth: false // 需要登录
        }
      },
      {
        path: '/host/dataList/add',
        component: () => import('@renderer/views/host/dataList/add/add.vue'),
        meta: {
          requiresAuth: false // 需要登录
        }
      }
      // {
      //   path: '/puppeteer/dataV',
      //   component: () => import('@renderer/views/puppeteer/dataV/dataV.vue'),
      //   meta: {
      //     requiresAuth: false // 需要登录
      //   }
      // }
    ]
  },
  {
    path: '/login',
    component: () => import('@renderer/views/login/login.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/tray',
    component: () => import('@renderer/views/TrayWindow/TrayWindow.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/:pathMatch(.*)*', // 通配符路由，匹配所有未定义的路径
    component: NotFoundIndex
  }
]
const router: Router = createRouter({
  // history: createWebHistory(
  //   (() => {
  //     console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL)
  //     return import.meta.env.BASE_URL
  //   })()
  // ),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(),
  history:
    process.env.NODE_ENV !== 'production'
      ? createWebHistory(import.meta.env.BASE_URL)
      : createWebHashHistory(import.meta.env.BASE_URL),

  routes: routesList
})
middle(router, routesList)
export default router
