

<template>
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
      label="延时触发"
      name="timeOut"
      :rules="[{ required: true, message: '输入延时触发时间' }]"
    >
      <a-input-number v-model:value="formState.timeOut" allowClear />
    </a-form-item>

    <a-form-item
      label="remark"
      name="remark"
      :rules="[{ required: true, message: '输入备注' }]"
    >
      <a-input v-model:value="formState.remark" allowClear />
    </a-form-item>
    <a-form-item
      label="等待加载页面"
      name="wait"
      :rules="[{ required: true, message: '等待加载页面' }]"
    >
      <a-switch v-model:checked="formState.wait" />
    </a-form-item>

  </a-form>
</template>
<script setup lang="ts">
const formRefs: any = ref(null)

interface FormState {
  remark: string,
  timeOut: number,
  wait:boolean,
  x:number,
  y:number
}

const formState = reactive<FormState>({
  remark: '',
  timeOut:1000,
  wait:false,
  x:0,
  y:0
})
const verifyForm = async (callback: (data:any) => void) => {
  formRefs.value.validate().then(async () => {
    callback({
      ...formState,
    })
  })
}
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}


const update = (element:any) => {
  for (const elementKey in element) {
    formState[elementKey] = element[elementKey]
  }
}
defineExpose({
  verifyForm,
  update
})
</script>
<style scoped lang="scss">

</style>