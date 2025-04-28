<template>
  <a-modal v-model:open="modelOpen" title="新增" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
    <a-form
      ref="formRefs"
      :model="formState"
      name="basic"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item label="选择类型" name="images" :rules="[{ required: true, message: '请选择类型' }]">
        <div class="x">
          <a-select v-model:value="formState.images" size="large" :options="typeOption"></a-select>
          <a-popover title="Title" placement="right">
            <template #content>
              <p>Content</p>
              <p>Content</p>
            </template>
            <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
          </a-popover>
        </div>
      </a-form-item>
      <a-form-item label="选择镜像" name="images" :rules="[{ required: true, message: '请选择镜像' }]">
        <div class="x">
          <a-select v-model:value="formState.images" size="large" :options="imagesOption"></a-select>
          <a-popover title="Title" placement="right">
            <template #content>
              <p>Content</p>
              <p>Content</p>
            </template>
            <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
          </a-popover>
        </div>
      </a-form-item>

      <a-form-item label="容器名称" name="containerName" :rules="[{ required: true, message: '输入一个容器名称!' }]">
        <div class="x">
          <a-input placeholder="my-mongoDB-1" v-model:value="formState.containerName" />
          <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
        </div>
      </a-form-item>
      <a-form-item label="端口映射" name="ports" :rules="[{ required: true, message: '输入一个容器名称!' }]">
        <div class="x">
          <a-input-number id="inputNumber" v-model:value="formState.ports" :min="1" :max="65535" />
          <!--          <a-input placeholder="my-mongoDB-1" v-model:value="formState.containerName" />-->
          <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
        </div>
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">开机自启动</a-checkbox>
      </a-form-item>

      <!--      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">-->
      <!--        <a-button type="primary" html-type="submit">Submit</a-button>-->
      <!--      </a-form-item>-->
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose } from 'vue'
const modelOpen = ref(false)
const formRefs: any = ref(null)
const confirmLoading = ref(false)
import { InfoCircleOutlined } from '@ant-design/icons-vue'
const open = () => {
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}

import { reactive } from 'vue'

interface FormState {
  images: any
  containerName: string
  ports: number
  remember: boolean
}

const typeOption = ref([
  {
    label: '数据库',
    value: 'slq'
  },
  {
    label: '后端',
    value: 'Pear'
  },
  {
    label: 'web',
    value: 'web'
  }
])
const imagesOption = ref([
  {
    label: 'MongoDB',
    value: 'Mongo'
  },
  {
    label: 'MySQL',
    value: 'Pear'
  },
  {
    label: 'nginx',
    value: 'nginx'
  },
  {
    label: 'nodejs',
    value: 'nodejs'
  },
  {
    label: 'Redis',
    value: 'Redis'
  }
])
const handleOk = () => {
  formRefs.value.validate().then(() => {
    console.log('formState', formState)
    confirmLoading.value = true
  })
}
const formState = reactive<FormState>({
  images: '',
  containerName: '',
  remember: true
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
