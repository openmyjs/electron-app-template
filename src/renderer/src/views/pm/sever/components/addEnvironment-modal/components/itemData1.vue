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
      v-show="basicAppItem.show"
      :label="basicAppItem.label"
      :name="basicAppItem.value"
      :rules="basicAppItem.rules"
    >
      <a-select
        v-model:value="formState[basicAppItem.value]"
        :placeholder="basicAppItem.placeholder"
        :disabled="basicAppItem.disabled"
        @change="basicAppItem.onChange"
        :options="basicAppItem.options"
        allowClear
      >
      </a-select>
    </a-form-item>
    <a-form-item v-show="yumItem.show" :label="yumItem.label" :name="yumItem.value" :rules="yumItem.rules">
      <a-select v-model:value="formState[yumItem.value]" allowClear :placeholder="yumItem.placeholder"  @change="yumItem.onChange">
        <a-select-opt-group v-for="(item, index) in yumItem.options" :key="index" :label="item.label">
          <a-select-option v-for="(itm, idx) in item.options" :key="idx" :value="itm.value">{{
            itm.label
          }}</a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-form-item>
    <a-form-item v-show="imageItem.show" label="镜像源" name="imageYum" :rules="[{ required: true, message: '选择镜像源或是手动输入地址!' }]">
      <a-select
        v-model:value="formState.imageYum"
        mode="tags"
        :placeholder="imageItem.placeholder"
        :disabled="imageItem.disabled"
        :options="imageItem.options"
        @change=""
      >
      </a-select>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'

defineProps({
  formState: {
    type: Object,
    required: true
  }
})

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const basicAppItem = reactive({
  label: '基础应用',
  value: 'basicApp',
  rules: [{ required: true, message: '请选择基础应用!' }],
  show: true,
  placeholder: '请选择基础应用',
  disabled: false,
  options: [
    {
      value: 'docker',
      label: 'docker',
      disabled: false
    },
    {
      value: 'nginx',
      label: 'nginx',
      disabled: true
    }
  ],
  onChange: (value: any) => {
    // appType.value = value
    // console.log('onChange', value)
    if(value === 'docker'){
      yumItem.value.show = true
    }
  }
})
const yumItem = ref({
  label: 'yum源',
  value: 'yum',
  rules: [{ required: true, message: '请选择yum源!' }],
  show: false,
  placeholder: '请选择yum源',
  disabled: false,
  options: [
    {
      label: '海外',
      options: [
        {
          value: 'docker',
          label: 'docker官网'
        }
      ]
    },
    {
      label: '中国',
      options: [
        {
          value: 'aliyun',
          label: '阿里云'
        },
        {
          value: 'qinghuadaxue',
          label: '清华大学'
        }
      ]
    }
  ],
  onChange: (value: any) => {
    if (value !== 'docker'){
      imageItem.value.show = true
    }
    console.log('onChange', value)
  }
})
const imageItem = ref({
  placeholder: '选择镜像源',
  disabled: false,
  show: false,
  options: [
    {
      value: 'http://hub-mirror.c.163.com',
      label: 'http://hub-mirror.c.163.com',
      disabled: false
    },
    {
      value: 'https://mirrors.tuna.tsinghua.edu.cn',
      label: 'https://mirrors.tuna.tsinghua.edu.cn',
      disabled: false
    },
    {
      value: 'http://mirrors.sohu.com',
      label: 'http://mirrors.sohu.com',
      disabled: false
    },
    {
      value: 'https://ustc-edu-cn.mirror.aliyuncs.com',
      label: 'https://ustc-edu-cn.mirror.aliyuncs.com',
      disabled: false
    },
    {
      value: 'https://ccr.ccs.tencentyun.com',
      label: 'https://ccr.ccs.tencentyun.com',
      disabled: false
    },
    {
      value: 'https://docker.m.daocloud.io',
      label: 'https://docker.m.daocloud.io',
      disabled: false
    },
    {
      value: 'https://docker.awsl9527.cn',
      label: 'https://docker.awsl9527.cn',
      disabled: false
    }
  ]
})
const formRefs: any = ref(null)
const verifyForm = (callback: any) => {
  formRefs.value.validate().then(async () => {
    callback(true)
  })
}
defineExpose({ verifyForm })
</script>
