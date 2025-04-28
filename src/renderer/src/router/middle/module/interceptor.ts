import type {
  Router,
  RouteLocationNormalized,
  NavigationGuardNext,
  LocationQueryRaw
} from 'vue-router'
import { isLogin } from '@renderer/utils/auth'
/** 路由拦截器 主要用于登录状态判断拦截*/
export default function (router: Router) {
  router.beforeEach(
    (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const loggedIn = isLogin()
      // if (to.path === '/') {
      //   next('/home')
      //   return
      // }
      // pinia.routerPath =
      // document.title = typeof to.meta.title === 'string' ? to.meta.title : '默认标题'
      if (!to.meta.requiresAuth) return next()
      console.log('进入需要登录的逻辑')
      if (!loggedIn) {
        switch (to.path) {
          case '/login':
            next()
            break
          default:
            next({
              path: '/login',
              query: {
                enterPath: to.path
              } as LocationQueryRaw
            })
            break
        }
      } else {
        next()
      }
    }
  )
}
