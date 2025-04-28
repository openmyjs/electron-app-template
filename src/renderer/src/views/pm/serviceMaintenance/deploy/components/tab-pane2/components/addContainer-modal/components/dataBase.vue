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
import { defineProps, ref, defineExpose } from 'vue'
// import { message, Modal } from 'ant-design-vue'
defineProps({
  formState: {
    type: Object,
    default: () => {
      return {
        containerName: null,
        ports1: null,
        ports2: null,
        verifyMode: null,
        account: null,
        password: null,
        remember: false
      }
    }
  }
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
const verifyForm = (callback: () => void) => {
  formRefs.value.validate().then(async () => {
    callback()
  })
}
defineExpose({ verifyForm })
</script>
<style scoped lang="scss"></style>
