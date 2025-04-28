

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
      label="选择器"
      name="selector"
      :rules="[{ required: true, message: '输入选择器' }]"
    >
      <a-input v-model:value="formState.selector" allowClear />
    </a-form-item>
    <a-form-item
      label="第几个"
      name="index"
      :rules="[{ required: true, message: '第几个' }]"
    >
      <a-input-number v-model:value="formState.index" allowClear />
    </a-form-item>
    <a-form-item
      label="页面等待"
      name="wait"
      :rules="[{ required: true, message: '等待加载页面' }]"
    >
      <a-switch v-model:checked="formState.wait" />
    </a-form-item>
    <a-form-item
      label="失败继续"
      name="goOn"
      :rules="[{ required: true, message: '等待加载页面' }]"
    >
      <div class="x">
        <a-switch v-model:checked="formState.goOn" />
        未找到点击元素时，继续执行?
      </div>

    </a-form-item>
    <a-form-item
      label="备注"
      name="remark"
      :rules="[{ required: true, message: '输入备注' }]"
    >
      <a-input v-model:value="formState.remark" allowClear />
    </a-form-item>



  </a-form>
</template>
<script setup lang="ts">
const formRefs: any = ref(null)

interface FormState {
  selector: string,
  wait: boolean,
  remark:string,
  goOn:boolean,
  mouse:boolean,
  index:number
}

const formState = reactive<FormState>({
  selector: '',
  wait:false,
  remark: '',
  goOn:false,
  mouse:false,
  index:0
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
  console.log('element/update---------------```', element)
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