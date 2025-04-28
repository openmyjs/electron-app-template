

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
      label="选择器类型"
      name="valueType"
      :rules="[{ required: true, message: '请输入选择器变量名!' }]"
    >
      <a-radio-group v-model:value="formState.valueType" name="radioGroup" @change="radioChange">
        <a-radio value="text">手动输入</a-radio>
        <a-radio value="variate">模版</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      label="选择器"
      name="selector.title"
      :rules="[{ required: true, message: '输入选择器' }]"
    >
      <a-input v-model:value="formState.selector" allowClear placeholder="请输入title selector" />

    </a-form-item>
    <a-form-item
      label=" "
      name="selector.title"
      :colon="false"
      :rules="[{ required: true, message: '输入选择器' }]"
    >
      <a-input v-model:value="formState.selector" allowClear placeholder="请输入option selector" />
    </a-form-item>

    <a-form-item
      label="打字时间"
      name="delay"
      :rules="[{ required: true, message: '输入打字时间' }]"
    >
      <a-input-number v-model:value="formState.delay" allowClear />
    </a-form-item>

    <a-form-item
      label="内容类型"
      name="valueType"
      :rules="[{ required: true, message: '容输入后端变量名' }]"
    >
      <a-radio-group v-model:value="formState.valueType" name="radioGroup" @change="radioChange">
        <a-radio value="text">text</a-radio>
        <a-radio value="variate">变量</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item
      v-if="formState.valueType==='text'"
      label="内容"
      name="value"
      :rules="[{ required: true, message: '请输入文本内容!' }]"
    >
      <a-input v-model:value="formState.value" allowClear placeholder="请输入内容" />
    </a-form-item>

    <a-form-item
      v-if="formState.valueType==='variate'"
      label="变量"
      name="value"
      :rules="[{ required: true, message: '请选择变量!' }]"
    >
      <a-cascader v-model:value="formState.value" :options="variateOptions" placeholder="请选择变量" />
    </a-form-item>

    <a-form-item
      label="remark"
      name="remark"
      :rules="[{ required: true, message: '输入备注' }]"
    >
      <a-input v-model:value="formState.remark" allowClear placeholder="请输入输入备注" />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
const formRefs: any = ref(null)
interface FormState {
  selector: string;
  value: string | any[] | null;
  timeOut?: number;
  delay?: number,
  remark: string;
  valueType: string;
}

const formState = reactive<FormState>({
  selector: '',
  value:null,
  timeOut:1000,
  delay:100,
  remark: '',
  valueType: 'text'
})

const variateOptions = ref([])
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

const update = (element:any,variateOption:any) => {
  for (const elementKey in element) {
    formState[elementKey] = element[elementKey]
  }
  variateOptions.value = variateOption
}

const radioChange = () => {
  formState.value = null
}

defineExpose({
  verifyForm,
  update
})
</script>
<style scoped lang="scss">

</style>