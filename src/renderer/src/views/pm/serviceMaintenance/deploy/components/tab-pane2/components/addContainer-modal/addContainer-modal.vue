<template>
  <a-modal
    v-model:open="modelOpen"
    title="添加容器"
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
      <a-form-item label="选择镜像" name="images" :rules="[{ required: true, message: '请选择镜像' }]">
        <div class="x">
          <a-cascader
            v-model:value="formState.images"
            size="large"
            placeholder="请选择[镜像/版本号]"
            :options="typeOption"
            @change="cascaderChange"
            @clear="clearChange"
          />
        </div>
      </a-form-item>
    </a-form>
    <dataBase v-if="verifyDbAndBackSign === 'db'" ref="dataBaseRefs" v-model:formState="formState" />
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose, reactive, defineProps, defineEmits } from 'vue'
import dataBase from './components/dataBase.vue'
import { message, Modal } from 'ant-design-vue'
const emit = defineEmits(['change'])
const modelOpen = ref(false)
const formRefs: any = ref(null)
const dataBaseRefs: any = ref(null)
const confirmLoading = ref(false)
// import { InfoCircleOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  execTo: {
    type: Function,
    required: true
  }
})

const verifyDbAndBackSign: any = ref(null)
const open = () => {
  loadData()
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
  for (const key in formState) {
    formState[key] = null
  }
}
const loadData = async () => {
  typeOption.value = []

  const get = await props.execTo(' docker images  --format "{{json .}},"')
  const getList = parseTable(get.log).map((item: any) => {
    return {
      ...item
    }
  })
  console.log('getList', getList)

  imageOption.value.forEach((item: any) => {
    const tag = getList.filter((e: any) => {
      return item.value === e.Repository
    })
    if (tag.length > 0) {
      item.children = tag.map((e: any) => {
        return {
          label: e.Tag,
          value: e.Tag
        }
      })
      typeOption.value.push(item)
    }
  })

  console.log('get', typeOption.value)
}

const imageOption = ref([
  {
    label: 'mongoDB',
    value: 'mongo',
    disabled: false,
    children: [],
    recommendInfo: {
      ports1: 27017,
      ports2: 27017,
      containerName: 'my-mongo-container',
      verifyMode: 'accountPassword',
      account: 'root'
    }
  },
  {
    label: 'MySQL',
    value: 'mysql',
    disabled: false,
    children: [],
    recommendInfo: {
      ports1: 3306,
      ports2: 3306,
      containerName: 'my-mysql-container',
      verifyMode: 'accountPassword',
      account: 'root'
    }
  },
  {
    label: 'Nginx',
    value: 'nginx',
    disabled: false,
    children: [],
    recommendInfo: {
      ports1: 8080,
      ports2: 80,
      containerName: 'my-nginx-container',
      account: 'root'
    }
  },
  {
    label: 'nodejs',
    value: 'node',
    disabled: false,
    children: [],
    recommendInfo: {
      ports1: 8080,
      ports2: 80,
      containerName: 'my-nginx-container',
      account: 'root'
    }
  }
])

const typeOption = ref<any[]>([])

const handleOk = () => {
  const command: string | null = ToCommand(formState)
  if (!command) return
  console.log('command', command)
  formRefs.value.validate().then(async () => {
    dataBaseRefs.value.verifyForm(async () => {
      confirmLoading.value = true
      console.log('formState', formState)
      const get = await props.execTo(command)
      console.log('get', get)
      if (get.code === 0) {
        message.success('容器启动成功')
        close()
        emit('change', true)
      } else {
        Modal.error({
          title: 'error',
          content: get.log
        })
      }
      confirmLoading.value = false
    })
  })
}
interface FormState {
  images: [string, string] | null
  containerName: string | null
  ports1: number | null
  ports2: number | null
  account: string | null
  password: string | null
  containerId: string | null
  verifyMode: string | null
  remember: boolean
}
const formState: any = reactive<FormState>({
  images: null,
  containerName: null,
  ports1: null,
  ports2: null,
  account: null,
  password: null,
  containerId: null,
  verifyMode: null,
  remember: true
})
const ToCommand = (param: FormState) => {
  if (param.images) {
    switch (param.images[0]) {
      case 'mongo':
        return `docker run --name ${param.containerName} -e MONGO_INITDB_ROOT_USERNAME=${param.account} -e MONGO_INITDB_ROOT_PASSWORD=${param.password} -p ${param.ports1}:${param.ports2} -d ${param.remember ? ' --restart=always' : ''} ${param.images[0]}:${param.images[1]} --auth`
      case 'mysql':
        return `docker run --name ${param.containerName} -e MYSQL_ROOT_PASSWORD=${param.password} -p ${param.ports1}:${param.ports2} ${param.remember ? '-d' : ''} ${param.images[0]}:${param.images[1]}`
      default:
        return null
    }
  }
  return null
}
/** linux字符串表格转成json表格*/
function parseTable(tableString: string) {
  const str = tableString.substring(0, tableString.length - 2)

  const TOJSOINSTR = `[${str}]`
  return JSON.parse(TOJSOINSTR)
}
const onFinish = (values: any) => {
  console.log('Success:', values)
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const cascaderChange = (value: any) => {
  if (value) {
    switch (value[0]) {
      case 'mongo':
      case 'mysql':
        verifyDbAndBackSign.value = 'db'
        break
      default:
        verifyDbAndBackSign.value = null
        break
    }
    const filter = imageOption.value.filter((item: any) => {
      return item.value === value[0]
    })
    if (filter.length > 0) {
      for (const key in formState) {
        if (filter[0].recommendInfo[key]) {
          formState[key] = filter[0].recommendInfo[key]
        }
      }
    }
  }
  console.log('selectChange', value)
}
const clearChange = () => {
  console.log('清空')
  verifyDbAndBackSign.value = null
}

defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
