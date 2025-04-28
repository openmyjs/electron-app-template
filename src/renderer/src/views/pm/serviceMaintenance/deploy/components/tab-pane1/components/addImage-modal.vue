<template>
  <a-modal
    v-model:open="modelOpen"
    title="添加子镜像"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :maskClosable="false"
  >
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
      <a-form-item label="类型" name="type" :rules="[{ required: true, message: '请选择类型' }]">
        <div class="x">
          <a-select
            v-model:value="formState.type"
            size="large"
            :options="typeOption"
            placeholder="请选择"
            @change="
              (_e:any, item:any) => {
                formState.images = null
                formState.created = null
                selectIndex[0] = item.key
                // console.log('select', e)
              }
            "
          ></a-select>
          <div style="width: 80px">
            <!--            <a-popover title="Title" placement="right" v-if="formState.type">-->
            <!--              <template #content>-->
            <!--                <p>Content</p>-->
            <!--                <p>Content</p>-->
            <!--              </template>-->
            <!--              <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>-->
            <!--            </a-popover>-->
          </div>
        </div>
      </a-form-item>
      <a-form-item label="镜像" name="images" :rules="[{ required: true, message: '请选择镜像' }]">
        <div class="x">
          <a-select
            v-model:value="formState.images"
            size="large"
            placeholder="请选择"
            :disabled="!formState.type"
            :options="typeOption[selectIndex[0]].children"
            @change="
              (_e, item) => {
                formState.created = null
                selectIndex[1] = item.key
              }
            "
          ></a-select>
          <div style="width: 80px">
            <a-popover placement="right" v-if="formState.images">
              <template #content>
                {{ typeOption[selectIndex[0]].children[selectIndex[1]].popovers }}
              </template>
              <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
            </a-popover>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="版本" name="created" :rules="[{ required: true, message: '请选择版本' }]">
        <div class="x">
          <a-select
            v-model:value="formState.created"
            size="large"
            placeholder="请选择"
            :disabled="!formState.images"
            :options="typeOption[selectIndex[0]].children[selectIndex[1]].children"
            @change="
              (_e, item) => {
                selectIndex[2] = item.key
              }
            "
          ></a-select>
          <div style="width: 80px">
            <a-popover placement="right" v-if="formState.created">
              <template #content>
                {{ typeOption[selectIndex[0]].children[selectIndex[1]].children[selectIndex[2]].popovers }}
              </template>
              <a-button type="text" size="large" style="margin-left: 10px"><InfoCircleOutlined /> </a-button>
            </a-popover>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive, computed, type Ref, defineEmits } from 'vue'
const emit = defineEmits(['change'])
import { message, Modal } from 'ant-design-vue'
const props = defineProps({
  execTo: {
    type: Function,
    required: true
  }
})
const modelOpen = ref(false)
const formRefs: any = ref(null)
const confirmLoading = ref(false)
import { InfoCircleOutlined } from '@ant-design/icons-vue'
const verifyDisabled: Ref<string[]> = ref([])
const open = (e: any) => {
  e.forEach((item: any) => {
    verifyDisabled.value.push(item.Repository + ':' + item.Tag)
  })
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
  for (const key in formState) {
    formState[key] = null
  }
}

interface FormState {
  type: string | null
  images: string | null
  created: string | null
}

const selectIndex = ref([0, 0, 0])

const typeOption = computed(() => {
  return [
    {
      label: '数据库',
      value: 'slq',
      key: 0,
      children: [
        {
          label: 'MongoDB',
          value: 'mongo',
          key: 0,
          popovers: 'MongoDB注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              disabled: verifyDisabled.value.includes('mongo:latest'),
              key: 0,
              popovers: 'MongoDB版本注释'
            }
          ]
        },
        {
          label: 'MySQL',
          value: 'mysql',
          key: 1,
          popovers: 'MySQL注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              disabled: verifyDisabled.value.includes('mysql:latest'),
              key: 0,
              popovers: 'MySQL版本注释'
            }
          ]
        }
        // {
        //   label: 'Redis',
        //   value: 'Redis',
        //   key: 2,
        //   children: [
        //     {
        //       label: 'latest',
        //       value: 'latest',
        //       key: 0
        //     }
        //   ]
        // }
      ]
    },
    {
      label: '语言',
      value: 'Pear',
      key: 1,
      children: [
        {
          label: 'node',
          value: 'node',
          key: 0,
          popovers: 'node注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              disabled: verifyDisabled.value.includes('node:latest'),

              key: 0,
              popovers: ''
            }
          ]
        }
      ]
    },
    {
      label: 'web',
      value: 'web',
      key: 2,
      children: [
        {
          label: 'apache',
          value: 'httpd',
          key: 0,
          popovers: 'apache注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              popovers: 'apache版本注释',
              disabled: verifyDisabled.value.includes('apache:latest'),
              key: 0
            }
          ]
        },
        {
          label: 'tomcat',
          value: 'tomcat',
          key: 1,
          popovers: 'tomcat注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              popovers: 'tomcat版本注释',
              disabled: verifyDisabled.value.includes('tomcat:latest'),
              key: 0
            }
          ]
        }
      ]
    },
    {
      label: '反向代理',
      value: 'nginx',
      key: 3,
      children: [
        {
          label: 'nginx',
          value: 'nginx',
          key: 0,
          popovers: 'nginx注释',
          children: [
            {
              label: 'latest',
              value: 'latest',
              disabled: verifyDisabled.value.includes('nginx:latest'),

              key: 0,
              popovers: ''
            }
          ]
        }
      ]
    }
  ]
})

const handleOk = async () => {
  formRefs.value.validate().then(async () => {
    // console.log('formState', formState)
    confirmLoading.value = true
    // console.log('gatherString', gatherString())
    // return
    const get = await props.execTo(gatherString())
    confirmLoading.value = false
    // console.log('get', get)
    if (get.code === 0) {
      message.success('子镜像添加成功')
      close()
      emit('change', true)
    } else {
      Modal.error({
        title: 'error',
        content: get.log
      })
    }
  })
}

/** 创建linux命令*/
const gatherString = () => {
  return `docker pull ${formState.images}:${formState.created}`
}

const formState = reactive<FormState>({
  type: null,
  images: null,
  created: null
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
