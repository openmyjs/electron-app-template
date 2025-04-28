<template>
  <div class="deployTab0">
    <div style="height: 100px">
      <a-button type="primary" @click="checkTo">
        <RedoOutlined />
        重新体检
      </a-button>
      <a-button type="primary" style="margin-left: 10px" @click="dockerConfigTap">
        <InfoCircleOutlined />
        docker镜像源
      </a-button>
    </div>
    <a-timeline :pending="pending" mode="left">
      <a-timeline-item
        v-for="(item, index) in timelineList"
        :key="index"
        :color="item.content[item.state].color"
        v-show="item.state !== 'pending'"
      >
        <span style="margin-left: 8px">{{ item.content[item.state].title }}</span>
        <a-button type="link" v-if="item.state === 'fail' && item.type === 'server'" @click="lineUp()">
          <RedoOutlined />
        </a-button>
        <a-button type="link" v-if="item.state === 'fail' && item.type !== 'server'" @click="iconTap(item)">
          <VerticalAlignBottomOutlined />
        </a-button>
      </a-timeline-item>
    </a-timeline>
    <dockerYumModal ref="dockerYumRefs" :execTo="execTo" />
    <contextHolder />
  </div>
</template>
<script lang="tsx" setup>
import { ref, onMounted, defineProps, h } from 'vue'
import { Modal, message } from 'ant-design-vue'
const [modal, contextHolder] = Modal.useModal()
const pending: any = ref(false)
import {
  RedoOutlined,
  VerticalAlignBottomOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import dockerYumModal from './components/dockerYum-modal.vue'
const dockerYumRefs: any = ref(null)
const props = defineProps({
  exec: {
    type: Function,
    required: true
  },
  startServer: {
    type: Function,
    required: true
  }
})
const timelineList = ref([
  {
    type: 'server',
    state: 'pending',
    commend: {
      check: '',
      install: ''
    },
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
    type: 'yum-utils',
    state: 'pending',
    commend: {
      check: 'rpm -qa | grep yum-utils',
      install: 'sudo yum install -y yum-utils'
    },
    content: {
      pending: {
        title: '检查yum-utils是否安装...',
        color: '#c8c6c6'
      },
      success: {
        title: 'yum-utils已安装',
        color: 'green'
      },
      fail: {
        title: 'yum-utils未安装',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  },
  {
    type: 'device-mapper-persistent-data',
    state: 'pending',
    commend: {
      check: 'rpm -qa | grep device-mapper-persistent-data',
      install: 'sudo yum install -y device-mapper-persistent-data'
    },
    content: {
      pending: {
        title: '检查device-mapper-persistent-data是否安装...',
        color: '#c8c6c6'
      },
      success: {
        title: 'device-mapper-persistent-data已安装',
        color: 'green'
      },
      fail: {
        title: 'device-mapper-persistent-data未安装',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  },
  {
    type: 'lvm2',
    state: 'pending',
    commend: {
      check: 'rpm -qa | grep lvm2',
      install: 'sudo yum install -y lvm2'
    },
    content: {
      pending: {
        title: '检查lvm2是否安装...',
        color: '#c8c6c6'
      },
      success: {
        title: 'lvm2已安装',
        color: 'green'
      },
      fail: {
        title: 'lvm2未安装',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  },
  {
    type: 'repo',
    state: 'pending',
    commend: {
      check: 'cat /etc/yum.repos.d/docker-ce.repo',
      install: 'yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo'
    },
    content: {
      pending: {
        title: 'docker源repo文件检查',
        color: '#c8c6c6'
      },
      success: {
        title: 'docker源repo文件检查成功',
        color: 'green'
      },
      fail: {
        title: 'docker源repo文件检查失败',
        color: 'red'
      }
    },
    time: '2023-05-01 09:00:00'
  },
  {
    type: 'docker',
    state: 'pending',
    commend: {
      check: 'docker',
      install:
        'yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin&&systemctl start docker&&systemctl enable docker'
    },
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
/** 重新体检*/
const checkTo = async () => {
  timelineList.value.forEach((item) => {
    item.state = 'pending'
  })
  await lineUp()
}

const lineUp = async () => {
  await loginServer(0)
  await checkYumUtils(1)
  await checkDeviceMapperPersistentData(2)
  await checkLvm2(3)
  await checkRepo(4)
  await checkDocker(5)
}

/** 登录服务器测试 是否连通*/
const loginServer = async (index: number) => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const res = await props.startServer()
  // console.log('tab0-----------1', res)
  pending.value = false
  if (res.data.linkStatus === 0) {
    timelineList.value[index].state = 'success'
    return
  }
  Modal.error({
    title: 'error',
    content: res.data.log,
    onOk() {}
  })
  timelineList.value[index].state = 'fail'
  throw new Error(res)
}
/** 检查yum-utils 是否安装*/
const checkYumUtils = async (index: number): Promise<void> => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const res = await execTo(timelineList.value[index].commend.check)

  // console.log('tab0', res)
  pending.value = false
  if (res.code === 0) {
    timelineList.value[index].state = 'success'
    return
  }
  timelineList.value[index].state = 'fail'
  // throw new Error(res)
}
/** 检查device-mapper-persistent-data 是否安装*/
const checkDeviceMapperPersistentData = async (index: number) => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const res = await execTo(timelineList.value[index].commend.check)
  // console.log('tab0/persistent', res)
  pending.value = false
  if (res.code === 0) {
    timelineList.value[index].state = 'success'
    return
  }
  timelineList.value[index].state = 'fail'
  // throw new Error(res)
}
/** 检查lvm2是否安装*/
const checkLvm2 = async (index: number) => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const res = await execTo(timelineList.value[index].commend.check)
  // console.log('tab0', res)
  pending.value = false
  if (res.code === 0) {
    timelineList.value[index].state = 'success'
    return
  }
  timelineList.value[index].state = 'fail'
  // throw new Error(res)
}
/** 检查docker-ce.repo 是否存在 否则创建*/
const checkRepo = async (index: number) => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  let res = await execTo(timelineList.value[index].commend.check)
  // console.log('tab0', res)
  pending.value = false
  if (res.code === 0) {
    timelineList.value[index].state = 'success'
    return
  }
  timelineList.value[index].state = 'fail'
  throw new Error(res)
}
/** 检查docker 是否安装*/
const checkDocker = async (index: number) => {
  pending.value = false
  timelineList.value[index].state = 'pending'
  pending.value = timelineList.value[index].content['pending'].title
  const res = await execTo(timelineList.value[index].commend.check)
  // console.log('tab0', res)
  pending.value = false
  if (res.code === 0) {
    // 设置开机启动
    await execTo('systemctl enable docker')
    timelineList.value[index].state = 'success'
    return
  }
  timelineList.value[index].state = 'fail'
}

const execTo = async (commend: string) => {
  const res = await props.exec(commend)
  if (res.data.linkStatus === 0) {
    return res.data.exec
  }
}
const iconTap = (item: any) => {
  switch (item.type) {
    case 'repo':
      return dockerConfigTap()
  }

  console.log('iconTap', item)
  modal.confirm({
    title: '安装',
    icon: h(ExclamationCircleOutlined),
    content: item.type,
    async onOk() {
      try {
        return await new Promise(async (resolve, _reject) => {
          const res = await execTo(item.commend.install)
          console.log('install', res)
          if (res.code === 0) {
            message.success(item.type + '安装成功')
            resolve(true)
          } else if (res.code === 1) {
            const modal = Modal.error({
              title: 'error',
              content: res.log,
              onOk() {
                modal.destroy()
                resolve(true)
              }
            })
          }
        })
      } catch {
        return console.log('Oops errors!')
      }
    },
    onCancel() {}
  })
}
const dockerConfigTap = () => {
  dockerYumRefs.value.open()
}
onMounted(async () => {
  await lineUp()
})
</script>
<style lang="scss" scoped>
.deployTab0 {
  width: 100%;
  height: 100%;
  //background-color: #3178c6;
}
</style>
