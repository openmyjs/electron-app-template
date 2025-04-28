export default [
  {
    path: '/pm', // 子路由的路径是相对于父路由的
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    component: () => import('@renderer/views/pm/index.vue')
  },
  {
    path: '/pm/serviceMaintenance',
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    component: () => import('@renderer/views/pm/serviceMaintenance/index.vue')
  },
  {
    path: '/pm/sever', // 子路由的路径是相对于父路由的
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    component: () => import('@renderer/views/pm/sever/index.vue')
  },
  {
    path: '/pm/serviceMaintenance/deploy',
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    component: () => import('@renderer/views/pm/serviceMaintenance/deploy/index.vue')
  },
  {
    path: '/pm/serviceMaintenance/deploy/getDetails',
    meta: {
      requiresAuth: false, // 需要登录
      requiresBreadcrumb: true //需要面包屑
    },
    component: () => import('@renderer/views/pm/serviceMaintenance/deploy/getDetails/getDetails.vue')
  }
]
