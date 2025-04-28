import { ref } from 'vue'

export default function () {
  const activeKey = ref(0)
  const tabList = ref([
    {
      key: '1',
      tab: '服务器'
    },
    {
      key: '2',
      tab: '本地镜像'
    },
    {
      key: '2',
      tab: '运行中容器'
    },
    {
      key: '2',
      tab: '命令行'
    }
    // {
    //   key: '2',
    //   tab: 'nginx'
    // },
    // {
    //   key: '2',
    //   tab: '数据库容器'
    // },
    // {
    //   key: '2',
    //   tab: '后端容器'
    // },
    // {
    //   key: '2',
    //   tab: 'web容器'
    // }
  ])

  return {
    tabList,
    activeKey
  }
}
