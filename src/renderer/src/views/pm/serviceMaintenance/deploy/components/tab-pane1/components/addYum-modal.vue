<template>
  <a-modal
    v-model:open="modelOpen"
    title="添加子镜像源地址"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :maskClosable="false"
  >
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
      <a-form-item label="镜像源" name="yum" :rules="[{ required: true, message: '选择镜像源或是手动输入地址!' }]">
        <a-select
          v-model:value="formState.yum"
          mode="tags"
          :placeholder="items.placeholder"
          :disabled="items.disabled"
          :options="items.options"
          @change=""
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive, defineProps } from 'vue'
import { message, Modal } from 'ant-design-vue'
const props = defineProps({
  execTo: {
    type: Function,
    required: true
  }
})
const formRefs: any = ref(null)
const modelOpen = ref(false)
const confirmLoading = ref(false)

interface FormState {
  yum: string[]
}
const items = ref({
  placeholder: false,
  disabled: false,
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
const formState = reactive<FormState>({
  yum: []
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const open = () => {
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}
const handleOk = async () => {
  formRefs.value.validate().then(async () => {
    confirmLoading.value = true
    await props.execTo('mkdir -p /etc/docker')
    const jsonString = JSON.stringify(formState.yum, null, 4)
    const commend = `
    tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors":${jsonString}
}
EOF
    `
    console.log('handleOk', commend)
    const res = await props.execTo(commend)
    if (res.code === 0) {
      message.success('镜像源添加成功')
    } else {
      Modal.error({
        title: 'error',
        content: res.log
      })
    }
    const res2 = await props.execTo('systemctl daemon-reload')
    if (res2.code === 0) {
      message.success('重新加载配置成功')
    } else {
      Modal.error({
        title: 'error',
        content: res.log
      })
    }
    const res3 = await props.execTo('sudo systemctl restart docker')
    if (res3.code === 0) {
      message.success('docker 重启成功')
    } else {
      Modal.error({
        title: 'error',
        content: res.log
      })
    }
    confirmLoading.value = false
    close()
  })
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
