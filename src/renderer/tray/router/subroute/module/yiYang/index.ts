export default [
  {
    path: '/yiyang',
    component: () => import('@renderer/views/yiYang/yiYang.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/yiyang/client',
    component: () => import('@renderer/views/yiYang/client/client.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/yiyang/staff',
    component: () => import('@renderer/views/yiYang/staff/staff.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/yiyang/order',
    component: () => import('@renderer/views/yiYang/order/order.vue'),
    meta: {
      requiresAuth: false // 需要登录
    }
  }
]
