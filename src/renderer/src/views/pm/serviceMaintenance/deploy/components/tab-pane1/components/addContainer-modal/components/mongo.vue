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
      <a-form-item label="身份验证" name="verifyMode" :rules="[{ required: true, message: '请选择镜像' }]">
        <div class="x">
          <a-select
            v-model:value="formState.verifyMode"
            size="large"
            :disabled="!formState.ports2"
            placeholder="请选择验证模式"
            :options="verifyModeOptions"
            @change="selectChange"
          >
          </a-select>
        </div>
      </a-form-item>
      <a-form-item label="超管账户名" name="account" :rules="[{ required: true, message: '输入一个超管账户名!' }]">
        <div class="x">
          <a-input placeholder="请输入超级管理员账户" :disabled="true" size="large" v-model:value="formState.account" />
          <!--          <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>-->
        </div>
      </a-form-item>
      <a-form-item label="超管密码" name="password" :rules="[{ required: true, message: '输入超管密码!' }]">
        <div class="x">
          <a-input
            placeholder="请输入超管密码!"
            :disabled="!formState.account"
            size="large"
            v-model:value="formState.password"
          />
          <!--          <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>-->
        </div>
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
  tag: [String, null]
})
interface FormState {
  containerName: string | null
  ports1: number | null
  ports2: number | null
  account: string | null
  password: string | null
  containerId: string | null
  verifyMode: string | null
  remember: boolean
}
// ports1: 27017,
//   ports2: 27017,
//   containerName: 'my-mongo-container',
//   verifyMode: 'accountPassword',
//   account: 'root'
const formState: any = reactive<FormState>({
  containerName: 'my-mongo-container',
  ports1: 27017,
  ports2: 27017,
  account: 'root',
  password: null,
  containerId: null,
  verifyMode: 'accountPassword',
  remember: true
})
const verifyModeOptions = ref([
  {
    value: 'accountPassword',
    label: '账户与密码'
  }
])

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const selectChange = (e: any) => {
  console.log('selectChange', e)
}
const formRefs: any = ref(null)
const verifyForm = async (callback: () => void) => {
  await formRefs.value.validate().then(async () => {
    emit('confirmLoading', true)
    const command = `docker run --name ${formState.containerName} -e MONGO_INITDB_ROOT_USERNAME=${formState.account} -e MONGO_INITDB_ROOT_PASSWORD=${formState.password} -p ${formState.ports1}:${formState.ports2} -d ${formState.remember ? ' --restart=always' : ''} mongo:${props.tag} --auth`
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
