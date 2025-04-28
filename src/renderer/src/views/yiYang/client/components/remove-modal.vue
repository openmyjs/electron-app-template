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
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码执行删除!' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="输入密码执行删除" />
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
  password: string
}

const formState = reactive<FormState>({
  password: ''
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const title = ref('删除')
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
    if(formState.password !== props.initPassword){
      message.error('密码错误')
      return
    }
    emit('change',delIndex.value)
    close()
  })
}

defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
