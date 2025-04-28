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
        label="驾驶员"
        name="trucksName"
        :rules="[{ required: true, message: '请选择你的名字!' }]"
      >
        <a-select
          allowClear
          v-model:value="formState.trucksName"
          :placeholder="selectItems.placeholder"
          :disabled="selectItems.disabled"
          :options="selectItems.options"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入你的密码!' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          type="password"
          placeholder="请输入你的密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import {message} from 'ant-design-vue'
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
interface FormState {
  trucksName: string | null
  password: string | null
}

const formState = reactive<FormState>({
  trucksName: null,
  password: null
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}
const selectItems:any = ref({
  placeholder: '选择你的名字',
  disabled: false,
  options: []
})
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const title = ref('选择')

const open = (param:any) => {
  modelOpen.value = true
}

const close = () => {
  for (const key in formState) {
    formState[key] = null
  }
  modelOpen.value = false
}
const trucksList = ref([])
const loadData =async ()=>{
  const trucks = await electron.readFile('dbFile/trucks')
   trucksList.value = JSON.parse(trucks)
  selectItems.value.options = trucksList.value.map((item:any)=>{
    return {
      value: item.phone,
      label: item.trucksName+' / '+ item.trucksCode+' / '+ item.phone,
      disabled: item.status!==0
    }
  })
}
const handleOk = () => {
  formRefs.value.validate().then(async () => {
    //验证密码是否正确
    const filter:any = trucksList.value.filter((item:any)=>{
      return item.phone === formState.trucksName
    })
    if(formState.password !== filter[0].password){
      message.error('密码错误')
      return
    }
    emit('change',{...filter[0]})
    close()
  })
}
onMounted(async () => {
  loadData()
})
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
