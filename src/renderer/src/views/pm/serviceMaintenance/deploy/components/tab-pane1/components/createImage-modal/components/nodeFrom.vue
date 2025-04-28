<template>
  <div>
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
      <a-form-item
        label="自定义镜像名称"
        name="imageName"
        :rules="[{ required: true, message: '输入一个自定义镜像名称!' }]"
      >
        <a-input v-model:value="formState.imageName" allowClear placeholder="例如:node:latest-app:1.0.0" />
      </a-form-item>
      <a-form-item
        label="项目路径"
        name="projectPath"
        :rules="[{ required: true, message: '请选择项目路径本地路径!' }]"
      >
        <div class="x">
          <a-button v-if="!formState.projectPath" type="primary" @click="chooseFile('projectPath')"> 选择 </a-button>
          <a-input v-else v-model:value="formState.projectPath" allowClear placeholder="/dist" />
        </div>
      </a-form-item>
      <a-form-item
        label="打包后路径"
        name="distPath"
        :rules="[{ required: true, message: '请选择项目打包后的路径,一般是项目下的dist目录!' }]"
      >
        <div class="x">
          <a-button v-if="!formState.distPath" type="primary" @click="chooseFile('distPath')"> 选择 </a-button>
          <a-input v-else v-model:value="formState.distPath" allowClear placeholder="package.json" />
        </div>
      </a-form-item>
      <a-form-item
        label="工作目录"
        name="workDir"
        :rules="[{ required: true, message: '服务器工作目录,一般是/usr/src/app' }]"
      >
        <a-input v-model:value="formState.workDir" :disabled="true" allowClear placeholder="例如:/usr/src/app" />
      </a-form-item>
      <a-form-item
        label="应用端口"
        name="port"
        :rules="[{ required: true, message: '暴露应用的端口（假设你的应用运行在 3000 端口）!' }]"
      >
        <a-input-number id="inputNumber" v-model:value="formState.port" :min="1" :max="3000" />
      </a-form-item>
      <a-form-item label="启动命令" name="command" :rules="[{ required: true, message: '启动项目的命令!' }]">
        <a-input v-model:value="formState.command" allowClear placeholder="例如:node index.js" />
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="tsx">
import { defineExpose } from 'vue'
import { ref } from 'vue'

const { electron } = window
const formRefs: any = ref(null)
const props: any = defineProps({
  formState: {
    type: Object,
    default: () => {
      return {
        imageName: '',
        projectPath: '',
        distPath: '',
        workDir: '',
        port: 3000,
        command: ''
      }
    }
  }
})
const chooseFile = (path: string) => {
  console.log('chooseFile')
  electron.ipcRenderer
    .invoke('chooseFile', {
      title: '选择dist文件',
      properties: ['openDirectory']
    })
    .then((res: any) => {
      props.formState[path] = res.filePaths[0]
      console.log('res', res)
    })
}
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const verifyFrom = (callback: () => void) => {
  formRefs.value.validate().then(async () => {
    callback()
  })
}
defineExpose({ verifyFrom })
</script>
<style scoped lang="scss"></style>
