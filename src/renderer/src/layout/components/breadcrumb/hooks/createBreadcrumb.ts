import { ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'
export default function () {
  const router = useRouter()
  //获取当前路由路径
  const nowRouterPath = router.currentRoute.value.path
  const i18nNameList = toI18nNameList(nowRouterPath)

  // console.log('i18nNameList', i18nNameList)

  const list: Ref<{ path: string; i18nName: string }[]> = ref(i18nNameList)
  watch(
    () => router.currentRoute.value.path,
    () => {
      list.value = toI18nNameList(router.currentRoute.value.path)
    }
  )
  return {
    list
  }
}
const toI18nNameList = (path: string) => {
  // const path = '/chat/page/get/data'
  const modifiedPath = path.slice(1)
  //分割成数组
  const parts = modifiedPath.split('/')

  // console.log('parts', parts)
  // // 生成包含每个级别路径的数组
  const result: string[] = []
  let currentPath: string = ''
  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '.' // 添加当前部分和斜杠
    // console.log('currentPath', currentPath)
    result.push(currentPath)
  }

  return result.map((item) => {
    return {
      path: '/' + item.replace(/\./g, '/').slice(0, -1),
      i18nName: item + 'title'
    }
  })
}
