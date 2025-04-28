<template>
  <a-modal v-model:open="modelOpen" :title="title" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
    <a-form
      ref="formRefs"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
    >
      <a-form-item
        label="子集合名称"
        name="sonArrayName"
        :rules="[{ required: true, message: '请输入子集合名称!' }]"
      >
        <a-input v-model:value="formState.sonArrayName" placeholder="输入子集合名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
interface FormState {
  sonArrayName: string
}

const formState = reactive<FormState>({
  sonArrayName: ''
})

const title = ref('新增')
const modalType = ref('')
const open = (param:any) => {
  if(param){
    const {data,title: titled,type}=param
    if(titled){
      title.value=titled
    }
    if(data){
      for (const key in data) {
        formState[key] = data[key]
      }
      // console.log('open',formState)
    }
    if(type){
      modalType.value  = type
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
const handleOk = () => {
  formRefs.value.validate().then(async () => {
    const data = {
      type: modalType.value,
      data: {
        ...formState
      }
    }
    emit('change',data)
    close()
  })
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
