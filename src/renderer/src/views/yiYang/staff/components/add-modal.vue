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
        label="姓名"
        name="trucksName"
        :rules="[{ required: true, message: '请输入联系人姓名!' }]"
      >
        <a-input v-model:value="formState.trucksName" placeholder="输入联系人姓名" />
      </a-form-item>
      <a-form-item
        label="联系手机"
        name="phone"
        :rules="[{ required: true, message: '请输入联系手机!' , pattern: /^1[3-9]\d{9}$/}]"
      >
        <a-input v-model:value="formState.phone" :disabled="editStatus" placeholder="输入联系手机" />
      </a-form-item>
      <a-form-item
        label="车牌号"
        name="trucksCode"
        :rules="[{ required: true, message: '请输入车牌号!' , pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/}]"
      >
        <a-input v-model:value="formState.trucksCode" :disabled="editStatus" placeholder="输入车牌号" />
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="输入密码" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import {message } from 'ant-design-vue'
import { ref, defineExpose, reactive } from 'vue'
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
interface FormState {
  trucksName: string
  phone:string
  trucksCode: string
  id:string
  password:string
}

const formState = reactive<FormState>({
  trucksName: '',
  phone:'',
  trucksCode:'',
  id:"",
  password:'',
  status: 0
})
const password = ref('883314')
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
  // password.value = ''
  title.value = '新增驾驶员'
  if(param){
    title.value = '编辑驾驶员'

    editStatus.value = true
    for (const key in formState) {
      formState[key] = param[key]
    }
    formState.password = ''
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
    if(password.value!=='883314'){
      message.error('密码错误')
      return
    }
    await saveData()
    emit('change',{...formState})
    close()
  })
}

const saveData = async ()=>{


  const res = await electron.readFile('dbFile/trucks')

  const jsonList:any = JSON.parse(res)

  if(editStatus.value){
    const filter = jsonList.filter((item:any)=>item.id===formState.id)
    if(filter[0].password!==formState.password){
      message.error('密码错误')
      throw new Error('密码错误')
    }

    jsonList.filter((item:any)=>{
      if(item.trucksCode===formState.trucksCode){
        for (const key in item) {
          item[key] = formState[key]
        }
        item.updateTime = new Date().getTime()
      }
    })


  }else {
    const filter = jsonList.filter((item:any)=>item.id===formState.id)
    if(filter.length){
      if(filter[0].phone===formState.phone){
        message.error('手机号已存在')
        throw new Error('手机号已存在')
      }
      if(filter[0].trucksCode===formState.trucksCode){
        message.error('车牌号已存在')
        throw new Error('车牌号已存在')
      }
    }

    const newData = {
      ...formState,
      id: new Date().getTime().toString(),
      createTime: new Date().getTime(),
      updateTime: new Date().getTime(),
      status:0
    }
    jsonList.unshift(newData)
  }


  const trucksData = await electron.createFile({
    savePath: 'dbFile',
    fileName: 'trucks',
    content: JSON.stringify(jsonList)
  })
  message.success('保存成功')
  // console.log('trucksData',trucksData)
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
