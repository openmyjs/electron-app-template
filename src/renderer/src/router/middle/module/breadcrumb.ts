import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
/** 用于面包屑空页面 拦截*/
export default function (router: Router, routesList) {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (to.query?.breadcrumb) {
        const matchingRoute: any[] = await flattenRouterArray(routesList)
        const find = matchingRoute.find((item) => item === to.path)

        if (!find) {
          next(false)
          return
        }
        next()
      } else {
        next()
      }
    }
  )
}

//扁平化路由
async function flattenRouterArray(arr) {
  let arrRouterList: string[] = []
  function flatten(arr) {
    // arr.forEach((item) => {
    //
    // })
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]
      if (item.children) {
        flatten(item.children)
      } else {
        arrRouterList.push(item.path)
      }
    }
  }
  await flatten(arr)
  return arrRouterList
}
