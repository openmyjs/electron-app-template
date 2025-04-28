<template>
  <a-modal v-model:open="modelOpen" title="添加字段" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
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
        label="字段类型"
        name="dataType"
        :rules="[{ required: true, message: '选择数据类型!' }]"
      >
        <a-select
          allowClear
          v-model:value="formState.dataType"
          :placeholder="selectItems.placeholder"
          :disabled="selectItems.disabled"
          :options="selectItems.options"
          @select="selectItems.select"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="字段名"
        name="name"
        :rules="[{ required: true, message: '请输入字段名称!' }]"
      >
        <a-input v-model:value="formState.name" allowClear placeholder="输入字段名称" />
      </a-form-item>
      <a-form-item
        v-if="formState.dataType==='text'"
        label="数值"
        name="value"
        :rules="[{ required: false, message: '请输入数值!' }]"
      >
        <a-textarea
          v-model:value="formState.value"
          allowClear
          placeholder="输入数值"
          :auto-size="{ minRows: 2, maxRows: 10 }"
        />
      </a-form-item>
      <a-form-item
        v-if="formState.dataType==='file'"
        label="数值"
        name="value"
        :rules="[{ required: false, message: '请添加文件!' }]"
      >
        <chooseFile v-model:value="formState.value" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive } from 'vue'
import chooseFile from '@renderer/components/chooseFile/chooseFile.vue'
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)
const emit = defineEmits(['change'])
interface FormState {
  dataType: string | null
  name: string | null
  value: string | any
}

const formState = reactive<FormState>({
  dataType: null,
  name:null,
  value:null
})

const selectItems = ref({
  placeholder: '选择数据类型',
  disabled: false,
  options: [
    {
      value: 'text',
      label: '文本',
      disabled: false
    },
    {
      value: 'file',
      label: '文件',
      disabled: false
    },
  ],
  select:(e:any, _option:any)=>{
    switch (e){
      case 'array':
        formState.value = []
        break;
    }
  }
})



const onFinish = (values: any) => {
  // console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  // console.log('Failed:', errorInfo)
}

const open = (data:AddData) => {
  if(data){
    formState.dataType = data.type
    formState.name = data.label
    formState.value = data.value
  }
  modelOpen.value = true
}
const close = () => {
  for (const argumentsKey in formState) {
    formState[argumentsKey] = null
  }
  modelOpen.value = false
}

interface AddData {
  label: string | null,
  value: string | null,
  type: string | null,
  children:any[]
}

const handleOk = () => {
  formRefs.value.validate().then(async () => {
    const data:AddData = {
      label: formState.name,
      value: formState.value,
      type: formState.dataType,
      children:[]
    }
    emit('change', data)
    close()
  })
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
