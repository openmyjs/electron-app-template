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
        label="客户"
        name="phone"
        :rules="[{ required: true, message: '请选择客户!' }]"
      >
        <a-select
          :allowClear="true"
          v-model:value="formState.phone"
          :placeholder="selectItems.placeholder"
          :disabled="selectItems.disabled"
          :options="selectItems.options"
          @change=""
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="备注"
        name="remark"
        :rules="[{ required: false, message: '请输入备注!' }]"
      >
        <a-textarea
          v-model:value="formState.remark"
          placeholder="输入备注"
          :auto-size="{ minRows: 2, maxRows: 5 }"
        />
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
const props = defineProps({
  initPassword: {
    type: String,
    default: ''
  }
})
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
const selectItems = ref({
  placeholder: '选择客户',
  disabled: false,
  options: []
})
interface FormState {
  phone: string | null
  remark: string | null
  password: string
  id: string
}

const formState = reactive<FormState>({
  phone: null,
  remark: null,
  password: '',
  id:''
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const title = ref('')
const editStatus = ref(false)
const open = (param:any) => {
  console.log(param)
  editStatus.value = false
  // password.value = ''
  title.value = '新增订单'
  if(param){
    title.value = '编辑订单'
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
    if(formState.password !== props.initPassword){
      message.error('密码错误')
      return
    }
    await saveData()
    emit('change',{...formState})
    close()
  })
}

const saveData = async ()=>{

  const res = await electron.readFile('dbFile/order')

  const jsonList:any = JSON.parse(res)

  if(editStatus.value){

  }else {

    const newData = {
      phone:formState.phone,
      remark:formState.remark,
      orderStatus: 0,
      id: new Date().getTime().toString(),
      createTime: new Date().getTime(),
      updateTime: new Date().getTime()
    }

    jsonList.unshift(newData)

  }

   await electron.createFile({
    savePath: 'dbFile',
    fileName: 'order',
    content: JSON.stringify(jsonList)
  })

  message.success('保存成功')
  // console.log('trucksData',trucksData)
}

const clientList = ref([])

const loadData = async () => {

  const res = await electron.readFile('dbFile/client')

  clientList.value = JSON.parse(res)

  selectItems.value.options = clientList.value.map((item:any)=>{
    return {
      value: item.phone,
      label: item.clientName + ' ' + item.phone,
      disabled: false
    }
  })
}
onMounted(async () => {
  await loadData()
})
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
