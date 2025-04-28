<template>
  <div>
    <a-timeline :pending="pending" mode="left">
      <a-timeline-item
        v-for="(item, index) in timelineList"
        :key="index"
        :color="item.content[item.state].color"
        v-show="item.state !== 'pending'"
      >
        <span style="margin-left: 8px">{{ item.content[item.state].title }}</span>
        <Button type="link" v-if="item.state === 'fail'" @click="lineUp">
          <RedoOutlined />
        </Button>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script lang="tsx" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const pending: any = ref(false)
import { RedoOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'

const timelineList = ref([
  {
    state: 'pending',
    content: {
      pending: {
        title: '服务器登录...',
        color: '#c8c6c6'
      },
      success: {
        title: '登录成功',
        color: 'green'
      },
      fail: {
        title: '服务器登录失败',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  },
  {
    state: 'pending',
    content: {
      pending: {
        title: '检查docker是否安装...',
        color: '#c8c6c6'
      },
      success: {
        title: 'docker 已安装',
        color: 'green'
      },
      fail: {
        title: 'docker未安装',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  }
])

/** 函数队列*/
const lineUp = async () => {
  await loginServer(0)
  await checkDocker(1)
  // console.log('队列执行完成')
}
/** 登录服务器测试 是否连通*/
const loginServer = async (index: number) => {
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const query = router.currentRoute.value.query
  const get = await window.api.invoke('/docker', {
    type: 'loginServer',
    data: query
    //   {
    //   host: '47.113.184.182',
    //   port: 22,
    //   username: 'root',
    //   password: '123456'
    // }
  })
  // console.log('get', get)
  pending.value = false
  if (get.code === 0) {
    return (timelineList.value[index].state = 'success')
  }
  timelineList.value[index].state = 'fail'
  throw new Error(get)
}

/** 检测docker 是否安装*/
const checkDocker = async (index: number) => {
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const get = await window.api.invoke('/docker', {
    type: 'getExec',
    data: {
      config: router.currentRoute.value.query,
      cmdCode: 'docker'
    }
  })
  // console.log('get', get)
  pending.value = false
  if (get.code === 0) {
    pending.value = false
    return (timelineList.value[index].state = 'success')
  }
  timelineList.value[index].state = 'fail'
  throw new Error(get)
}

onMounted(() => {
  lineUp()
})
</script>
