import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default function () {
  const router = useRouter()
  /** 应用集list*/
  const list = ref([
    {
      name: '研发管理系统',
      path: '/pm',
      desc: '一款集项目管理、开发维护、生产维护等功能的项目管理系统'
    },
    {
      name: 'puppeteer',
      path: '/puppeteer',
      desc: 'puppeteer'
    },
    {
      path: '/htmlCodeEdit',
      name: 'html提取',
      desc: '应用描述'
    },
    // {
    //   path: '/register',
    //   name: '注册页面',
    //   desc: '应用描述'
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   desc: '应用描述'
    // }
    // {
    //   name: '应用3',
    //   desc: '应用描述'
    // },
    // {
    //   name: '应用4',
    //   desc: '应用描述'
    // },
    // {
    //   name: '应用5',
    //   desc: '应用描述'
    // },
    // {
    //   name: '应用6',
    //   desc: '应用描述'
    // }
  ])
  /** cardGrid点击*/
  const cardGridTap = (path: string | undefined) => {
    if (path) {
      router.push(path).then()
    }
  }
  return {
    list,
    cardGridTap
  }
}
