<template>
  <div>
    <a-modal
      v-model:open="modalOpen"
      title="docker源"
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
        <a-form-item
          v-for="(item, index) in formItemList"
          :key="index"
          :label="item.label"
          :name="item.name"
          :rules="item.rules"
        >
          <a-select
            v-model:value="formState[item.select.value]"
            :placeholder="item.select.placeholder"
            :disabled="item.select.disabled"
            :options="item.select.options"
            @change="
              () => {
                if (item.name === 'type') {
                  formState.yum = null
                }
              }
            "
          >
          </a-select>
        </a-form-item>
        <!--      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">-->
        <!--        <a-button type="primary" html-type="submit">Submit</a-button>-->
        <!--      </a-form-item>-->
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, defineExpose, type Ref, computed, defineProps } from 'vue'
const formRefs: any = ref(null)
const modalOpen: Ref<boolean> = ref(false)
const confirmLoading = ref(false)
// import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
const props: any = defineProps({
  execTo: Function
})
import { reactive } from 'vue'

const formItemList = ref([
  {
    label: '类型',
    name: 'type',
    rules: [{ required: true, message: '请选择分类!' }],
    select: {
      value: 'type',
      placeholder: '请选择',
      disabled: false,
      options: [
        {
          value: 'international',
          label: '国际'
        },
        {
          value: 'china',
          label: '中国'
        }
      ]
    }
  },
  {
    label: 'yum源',
    name: 'yum',
    rules: [{ required: true, message: '请选择yum源!' }],
    select: {
      value: 'yum',
      placeholder: '请选择',
      disabled: computed(() => !formState.type),
      options: computed(() => {
        switch (formState.type) {
          case 'international':
            return [
              {
                value: 'https://download.docker.com/linux/centos/docker-ce.repo',
                label: 'docker'
              }
            ]
          case 'china':
            return [
              {
                value: 'https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo',
                label: '阿里云'
              },
              {
                value:
                  "https://download.docker.com/linux/centos/docker-ce.repo \n sed -i 's+https://download.docker.com+https://mirrors.tuna.tsinghua.edu.cn/docker-ce+' /etc/yum.repos.d/docker-ce.repo",
                label: '清华大学'
              }
            ]
          default:
            return []
        }
      })
    }
  }
])

interface FormState {
  type: string | null
  yum: string | null
}
const formState = reactive<FormState>({
  type: null,
  yum: null
})
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const open = () => {
  confirmLoading.value = false
  modalOpen.value = true
}
const close = () => {
  modalOpen.value = false
}
const configImageYum = async (yum: string) => {
  // console.log('configImageYum', yum)

  const commend = `yum-config-manager --add-repo ${yum}`
  const res = await props.execTo(commend)
  await props.execTo('sudo yum makecache fast') //更新yum，建立缓存
  console.log('configImageYum', res)
  if (res.code === 0) {
    message.success('docker源设置成功')
    close()
    return
  }
  Modal.error({
    title: 'error',
    content: res.log
  })
}
const handleOk = () => {
  formRefs.value.validate().then(async () => {
    // console.log('formState', formState)
    confirmLoading.value = true
    if (formState.yum) {
      await configImageYum(formState.yum)
    }
    confirmLoading.value = false
  })
}

defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>

<!--config-manager &#45;&#45;add-repo -->

<!--yum-config-manager &#45;&#45;add-repo https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/centos/docker-ce.repo-->
