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
        label="联系人"
        name="clientName"
        :rules="[{ required: true, message: '请输入联系人!' }]"
      >
        <a-input v-model:value="formState.clientName" placeholder="输入联系人" />
      </a-form-item>
      <a-form-item
        label="联系手机"
        name="phone"
        :rules="[{ required: true, message: '请输入联系手机!' , pattern: /^1[3-9]\d{9}$/}]"
      >
        <a-input v-model:value="formState.phone" :disabled="editStatus" placeholder="输入联系手机" />
      </a-form-item>
      <a-form-item
        label="公司名称"
        name="company"
        :rules="[{ required: false, message: '请输入公司名称!' }]"
      >
        <a-input v-model:value="formState.company" placeholder="输入公司名称" />
      </a-form-item>
      <a-form-item
        label="地址"
        name="address"
        :rules="[{ required: false, message: '请输入地址!' }]"
      >
        <a-input v-model:value="formState.address" placeholder="输入地址" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: false, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="password" placeholder="输入密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import {message } from 'ant-design-vue'
import { ref, defineExpose, reactive } from 'vue'
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
  clientName: string
  phone:string
  company: string
  address: string,
  id:string
}

const formState = reactive<FormState>({
  clientName: '',
  phone:'',
  company:'',
  address:'',
  id:""
})
const password = ref('')
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const title = ref('新增客户')
const editStatus = ref(false)
const open = (param:any) => {
  editStatus.value = false
  password.value = ''
  title.value = '新增客户'
  if(param){
    title.value = '编辑客户'
    editStatus.value = true
    for (const key in formState) {
      formState[key] = param[key]
    }
  }
  modelOpen.value = true
}
const close = () => {
  for (const key in formState) {
    formState[key] = null
  }
  modelOpen.value = false
}
const handleOk = async () => {
  formRefs.value.validate().then(async () => {
    if(password.value!==props.initPassword){
      message.error('密码错误')
      return
    }
    await saveData()
    emit('change',{...formState})
    close()
  })
}

const saveData = async ()=>{


  const res = await electron.readFile('dbFile/client')

  const jsonList:any = JSON.parse(res)

  if(editStatus.value){
    jsonList.filter((item:any)=>{
      if(item.id===formState.id){
        for (const key in item) {
          item[key] = formState[key]
        }
        item.updateTime = new Date().getTime()
      }
    })
  }else {
    jsonList.filter((item:any)=>{
      if(item.phone===formState.phone){
        message.error('手机号已存在')
        throw new Error('手机号已存在')
      }
    })
    const newData = {
      ...formState,
      id: new Date().getTime().toString(),
      createTime: new Date().getTime(),
      updateTime: new Date().getTime()
    }
    jsonList.unshift(newData)
  }


  const clientData = await electron.createFile({
    savePath: 'dbFile',
    fileName: 'client',
    content: JSON.stringify(jsonList)
  })
  message.success('保存成功')
  // console.log('clientData',clientData)
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
