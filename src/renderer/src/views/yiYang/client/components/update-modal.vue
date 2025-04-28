<template>
  <a-modal v-model:open="modelOpen" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
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
        label="旧密码"
        name="oldPassword"
        :rules="[{ required: true, message: '请输入旧密码!' }]"
      >
        <a-input-password v-model:value="formState.oldPassword" placeholder="输入旧密码" />
      </a-form-item>
      <a-form-item
        label="新密码"
        name="newPassword"
        :rules="[{ required: true, message: '请输入新密码!' }]"
      >
        <a-input-password v-model:value="formState.newPassword" placeholder="输入新密码" />
      </a-form-item>
      <a-form-item
        label="验证新密码"
        name="newPassword2"
        :rules="[{ required: true, message: '请输入验证新密码!' }]"
      >
        <a-input-password v-model:value="formState.newPassword2" placeholder="输入验证新密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive } from 'vue'
import { message } from 'ant-design-vue'
const props = defineProps({
  initPassword:{
    type:String
  }
})

const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
interface FormState {
  oldPassword: string
  newPassword: string
  newPassword2: string
}

const formState = reactive<FormState>({
  oldPassword: '',
  newPassword: '',
  newPassword2: ''
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const title = ref('修改密码')
const delIndex = ref(0)
const open = (param:any) => {
  delIndex.value  = param
  modelOpen.value = true

}
const close = () => {
  for (const key in formState) {
    formState[key] = null
  }
  modelOpen.value = false
}

const handleOk = () => {
  formRefs.value.validate().then(async () => {

    if(formState.oldPassword !== props.initPassword){
      message.error('旧密码错误')
      return
    }
    if(formState.newPassword !== formState.newPassword2){
      message.error('新密码与验证密码不一致')
      return
    }
    sessionStorage.setItem('initPassword',formState.newPassword)
    emit('change',)
    close()
  })
}

defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
