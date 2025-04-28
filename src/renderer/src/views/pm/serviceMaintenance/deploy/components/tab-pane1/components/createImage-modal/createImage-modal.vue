<template>
  <a-modal
    v-model:open="modelOpen"
    title="制作自定义镜像"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :maskClosable="false"
  >
    <a-form
      ref="formRefs"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item label="基础镜像" name="baseImage" :rules="[{ required: true, message: '请选择一个基础镜像!' }]">
        <a-select
          v-model:value="formState.baseImage"
          allowClear
          :placeholder="items.placeholder"
          :disabled="items.disabled"
          :options="items.options"
          @change="selectChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="基础镜像版本"
        name="tag"
        :rules="[{ required: true, message: '输入基础镜像版本,一般使用latest!' }]"
      >
        <a-input v-model:value="formState.tag" allowClear placeholder="例如:latest" />
      </a-form-item>
    </a-form>
    <NodeFrom ref="NodeFromRefs" v-if="formState.baseImage" :formState="formState" />
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive } from 'vue'
import { Modal, message } from 'ant-design-vue'
import NodeFrom from './components/nodeFrom.vue'
const props = defineProps({
  serverConfig: Object,
  execTo: Function
})
const emit = defineEmits(['refresh'])
const { electron } = window
const formRefs: any = ref(null)
const NodeFromRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)

// 推荐配置  // 后期根据这个进行配置维护
const recommend = ref({
  node: {
    tag: 'latest',
    imageName: 'node_latest-app_1.0.0',
    workDir: '/usr/src/app',
    port: 3000,
    command: 'node index.js'
  }
})

const items = ref({
  placeholder: false,
  disabled: false,
  options: [
    {
      value: 'node',
      label: 'node',
      disabled: false
    },
    {
      value: 'java',
      label: 'java',
      disabled: true
    }
  ]
})
interface FormState {
  baseImage: string | null
  tag: string | null
  imageName: string | null
  projectPath: string | null
  distPath: string | null
  workDir: string | null
  port: number | null
  command: string | null
}
const formState = reactive<FormState>({
  baseImage: null, //基础镜像
  tag: null, //基础镜像版本
  imageName: null, //自定义镜像名称
  projectPath: 'E:\\git\\open-my-js\\backend.omjs.nodejs', //项目路径
  distPath: 'E:\\git\\open-my-js\\backend.omjs.nodejs\\dist', //项目打包后的路径
  workDir: null, //工作目录
  port: null, //端口
  command: null //启动命令
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const selectChange = (value: any) => {
  console.log(`selected`, value)
  switch (value) {
    case 'node':
      const R_node = recommend.value['node']
      for (const key in R_node) {
        formState[key] = R_node[key]
      }
      break
  }
}

const open = () => {
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}
const handleOk = () => {
  formRefs.value.validate().then(() => {
    NodeFromRefs.value.verifyFrom(async () => {
      confirmLoading.value = true
      await createDockerfile(formState)
      confirmLoading.value = false
    })
  })
}
const createDockerfile = async (params: FormState) => {
  const data = {
    dockerFile: {
      ...JSON.parse(JSON.stringify(params))
    },
    config: props.serverConfig,
    remoteDirPath: `/dockerfileDist`
  }
  if (!props.execTo) return
  //创建服务器文件夹
  await props.execTo(`mkdir -p ${data.remoteDirPath}`)
  /** 创建
   * 1. 创建dockerfile
   * 2.复制文件复制 electron
   * 3.上传文件 到服务器
   * */
  const res = await electron.ipcRenderer.invoke('createDockerfile', data)
  console.log('createDockerfile', res)
  if (res.code !== 0) {
    Modal.error({
      title: 'error',
      content: res.msg
    })
    return
  }

  // 制作镜像
  const res2 = await props.execTo(
    `docker build -f ${data.remoteDirPath}/Dockerfile  -t ${params.imageName} ${data.remoteDirPath}`
  )
  console.log('res2', res2)
  // 删除服务器上传的文件
  const res3 = await props.execTo(`rm -r ${data.remoteDirPath}`)
  console.log('res3', res3)
  //删除本地electron 创建的文件
  const res4 = await electron.ipcRenderer.invoke('removeDockerfile', res2.data.exeFolderDist)
  console.log('res4', res4)
  if (res.code === 0) {
    message.success('制作镜像成功')
    close()
    emit('refresh')
  } else {
    Modal.error({
      title: 'error',
      content: res2.log
    })
  }
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
