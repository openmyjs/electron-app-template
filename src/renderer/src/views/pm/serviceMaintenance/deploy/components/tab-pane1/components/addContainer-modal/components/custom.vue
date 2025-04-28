<template>
  <div>
    <a-form
      ref="formRefs"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item label="容器名称" name="containerName" :rules="[{ required: true, message: '输入一个容器名称!' }]">
        <a-input placeholder="请输入容器自定义名称" size="large" v-model:value="formState.containerName" />
      </a-form-item>
      <a-form-item label="主机端口" name="ports1" :rules="[{ required: true, message: '输入一个主机端口!' }]">
        <div class="x">
          <a-input-number
            id="inputNumber"
            :disabled="!formState.containerName"
            v-model:value="formState.ports1"
            :min="1"
            :max="65535"
          />
          <!--          <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>-->
        </div>
      </a-form-item>
      <a-form-item label="容器端口" name="ports2" :rules="[{ required: true, message: '输入一个容器端口!' }]">
        <a-input-number
          id="inputNumber"
          :disabled="!formState.ports1"
          v-model:value="formState.ports2"
          :min="1"
          :max="65535"
        />
      </a-form-item>
      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember" :disabled="true">开机自启动</a-checkbox>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { ref, defineExpose, reactive } from 'vue'
import { message, Modal } from 'ant-design-vue'
// import { message, Modal } from 'ant-design-vue'
const emit = defineEmits(['confirmLoading'])
const props = defineProps({
  execTo: {
    type: Function,
    required: true
  },
  imageInfo: {
    type: Object,
    required: true
  }
})
interface FormState {
  containerName: string | null
  ports1: number | null
  ports2: number | null
  remember: boolean
}
// ports1: 27017,
//   ports2: 27017,
//   containerName: 'my-mongo-container',
//   verifyMode: 'accountPassword',
//   account: 'root'
const formState: any = reactive<FormState>({
  containerName: 'my--container',
  ports1: null,
  ports2: null,
  remember: true
})

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const formRefs: any = ref(null)
const verifyForm = async (callback: () => void) => {
  await formRefs.value.validate().then(async () => {
    emit('confirmLoading', true)
    const command = `docker run --name ${formState.containerName}  -p ${formState.ports1}:${formState.ports2} -d ${formState.remember ? ' --restart=always' : ''} ${props.imageInfo.imageName}:${props.imageInfo.tag} `
    const get = await props.execTo(command)
    console.log('get', get)
    if (get.code === 0) {
      message.success('容器创建成功')
    } else {
      Modal.error({
        title: 'error',
        content: get.log
      })
    }
    if (typeof callback === 'function') {
      callback()
    }
    emit('confirmLoading', false)
  })
}
defineExpose({ verifyForm })
</script>
<style scoped lang="scss"></style>
