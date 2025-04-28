

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
      label="超时时间"
      name="timeOut"
      :rules="[{ required: true, message: '输入延时触发时间' }]"
    >
      <a-input-number v-model:value="formState.timeOut" allowClear placeholder="等待元素出现超时时间" />
    </a-form-item>
    <a-form-item
      label="继续执行"
      name="goOnStatus"
      :rules="[{ required: true, message: '是否继续执行' }]"
    >
      <a-switch v-model:checked="formState.goOnStatus" />
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
      :rules="[{ required: true, message: '是否等待加载页面' }]"
    >
      <a-switch v-model:checked="formState.wait" />
    </a-form-item>

  </a-form>
</template>
<script setup lang="ts">
const formRefs: any = ref(null)
interface FormState {
  selector:string,
  timeOut:number,
  goOnStatus:boolean,
  remark:string,x:number,y:number,wait: boolean;
}

const formState = reactive<FormState>({
  selector:'',
  timeOut:10000,
  goOnStatus:true,
  remark: '',
  x:0,
  y:0,
  wait:false,
})
const verifyForm = async (callback: (data:any) => void) => {
  formRefs.value.validate().then(async () => {
    callback({
      ...formState,
    })
  })
}
const onFinish = (values: any) => {
  // console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  // console.log('Failed:', errorInfo)
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