<template>
  <a-modal v-model:open="modelOpen" title="添加服务器" :maskClosable="false">
    <template #footer>
      <a-button v-if="activeKey !== 0" key="back" @click="handleCancel">上一步</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="handleOk">下一步</a-button>
    </template>

    <div style="height: 50px">
      <a-steps :current="activeKey" :items="stepsOption"></a-steps>
    </div>
    <swiper :current="activeKey" :duration="100">
      <swiper-item>
        <itemData0 ref="itemData0Refs" v-model:formState="itemData0FormState" />
      </swiper-item>
      <swiper-item>
        <itemData1 ref="itemData1Refs" v-model:formState="itemData1FormState" />
      </swiper-item>
    </swiper>
  </a-modal>
</template>
<script setup lang="tsx">
import swiperItem from '@renderer/components/swiper/swiper-item.vue'
import swiper from '@renderer/components/swiper/swiper.vue'
// import { Modal } from 'ant-design-vue'
import { defineEmits, defineExpose, reactive, ref } from 'vue'
import itemData0 from './components/itemData0.vue'
import itemData1 from './components/itemData1.vue'
const emit = defineEmits(['update:config'])

const props: any = defineProps({
  config: {
    type: Object,
    required: true
  },
  ssh: {
    type: Object,
    required: true
  }
})
const modelOpen = ref(false)
const confirmLoading = ref(false)
const activeKey = ref(0)
const itemData0Refs: any = ref(null)
const itemData1Refs: any = ref(null)
interface FormState {
  severName: string | null
  host: string | null
  verifyType: string
  account: string | null
  password: string | null
  ports: number | null
}

const itemData0FormState = reactive<FormState>({
  severName: '开发环境',
  host: '47.113.184.182',
  verifyType: 'password',
  account: 'root',
  password: 'AAxiaoyu001',
  ports: 22
})
interface FormState2 {
  basicApp: string | null
  yum: string | null
  imageYum: string[]
}
const itemData1FormState = ref<FormState2>({
  basicApp: null,
  yum: null,
  imageYum: []
})
const stepsOption = ref([
  {
    title: '服务器'
  },
  {
    title: '配置'
  },
  {
    title: '安装'
  }
])
const open = () => {
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}

const handleOk = async () => {
  switch (activeKey.value) {
    case 0:
      const config = {
        host: itemData0FormState.host,
        username: itemData0FormState.account,
        password: itemData0FormState.password,
        port: itemData0FormState.ports,
        verifyType: itemData0FormState.verifyType
      }

      itemData0Refs.value.verifyForm(async () => {
        console.log('验证表单')
        activeKey.value = 1
        // const res = await props.ssh.start(config)
        // console.log('res', res)
        // if (res.data.status === 0) {
        //   activeKey.value += 1
        // } else {
        //   Modal.error({
        //     title: 'error',
        //     content: res.data.logs,
        //     onOk() { }
        //   })
        //   return
        // }
        // props.ssh.on('uploadSh', (data: any) => {
        //   console.log('uploadSh', data)
        // })
        // await props.ssh.upload({
        //   channel: 'uploadSh',
        //   // localDir:'E:\\git\\electron\\electron-app-template\\sh',
        //   localDir: 'D:\\360data\\重要数据\\我的图片\\Camera Roll',
        //   remoteDir: '/huangjianfeng',
        // })


      })
      break;
    case 1:
      itemData1Refs.value.verifyForm(async () => {
        console.log('验证表单2');

      })
      break;
    default:
      break;
  }
  console.log('下一步')

}
const uploadSh = async () => {

}
const handleCancel = () => {
  activeKey.value -= 1
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
