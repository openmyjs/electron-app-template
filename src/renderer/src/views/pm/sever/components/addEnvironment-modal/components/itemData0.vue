<template>
  <div>
    <a-form ref="formRefs" :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
      autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="自定义名称" name="severName" :rules="[{ required: true, message: '请输入自定义服务器名称!' }]">
        <a-input v-model:value="formState.severName" placeholder="输入自定义服务器名称" />
      </a-form-item>
      <a-form-item label="主机" name="host" :rules="[
        { required: true, message: '请输入主机!' },
        {
          pattern:
            /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2,})$/,
          message: '请输入正确的主机!'
        }
      ]">
        <a-input v-model:value="formState.host" placeholder="输入主机" />
      </a-form-item>
      <a-form-item label="用户名" name="account" :rules="[{ required: true, message: '请输入用户名!' }]">
        <a-input v-model:value="formState.account" placeholder="输入用户名" />
      </a-form-item>
      <a-form-item label="身份验证方式" name="verifyType" :rules="[{ required: true, message: '请选择身份验证方式!' }]">
        <a-select v-model:value="formState.verifyType" :placeholder="selectItems.placeholder"
          :disabled="selectItems.disabled" :options="selectItems.options" @change="selectChange">
        </a-select>
      </a-form-item>

      <a-form-item :label="verifyType.options[verifyType.sign].label" name="password"
        :rules="[{ required: true, message: verifyType.options[verifyType.sign].message }]">
        <a-input v-if="verifyType.sign === 'password'" v-model:value="formState.password"
          :placeholder="verifyType.options[verifyType.sign].placeholder" />
        <a-input-search v-else v-model:value="formState.password"
          :placeholder="verifyType.options[verifyType.sign].placeholder" @search="onSearch">
          <template #enterButton>
            <!--          <a-button>Custom</a-button>-->
            <FolderOpenOutlined />
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item label="端口" name="ports" :rules="[{ required: true, message: '请输入端口!' }]">
        <a-input-number v-model:value="formState.ports" :min="1" :max="65535" placeholder="输入端口" />
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="tsx">
import { ref, defineExpose } from 'vue'
import { FolderOpenOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  formState: {
    type: Object,
    required: true
  }
})
const selectItems = ref({
  placeholder: '请选择',
  disabled: false,
  options: [
    {
      value: 'password',
      label: '密码',
      disabled: false
    },
    {
      value: 'keypair',
      label: '密钥对',
      disabled: false
    }
  ]
})
const verifyType = ref({
  sign: 'password',
  options: {
    keypair: {
      label: '密钥对',
      message: '请选择私钥文件!',
      placeholder: '请选择私钥文件'
    },
    password: {
      label: '密码',
      message: '请输入密码!',
      placeholder: '输入密码'
    }
  }
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const selectChange = (value: any) => {
  console.log(`selected ${value}`)
  verifyType.value.sign = value
}
const onSearch = (value: any) => {
  console.log('search:', value)
}
const formRefs: any = ref(null)
const verifyForm = (callback: any) => {
  formRefs.value.validate().then(async () => {
    callback(true)
  })
}
defineExpose({ verifyForm })
</script>
<style scoped lang="scss"></style>
