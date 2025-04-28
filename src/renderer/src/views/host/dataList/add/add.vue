<template>
  <div class="addTemplate y">
    <div style="width: 100%; height: 50px;padding-top: 10px">
      <a-form
        :ref="(el)=>formRefs.title=el"
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="数据名称" name="dataName" :rules="[{ required: true, message: '请输入名称!' }]">
          <div class="x-c-c" style="gap: 19px">
            <a-input  size="large" v-model:value="formState.dataName" allowClear />
            <a-button type="dashed" @click="save">保存</a-button>
            <div style="width: 10px;"></div>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <a-divider orientation="left">
      <a-button type="dashed" @click="refs.addData.open()" style="width: 100%">
        <PlusSquareOutlined style="font-size: 15px" />
        添加字段
      </a-button>
    </a-divider>

    <div class="f-no-scroll f-scroll-y " style="height: calc(100% - 130px)">
      <a-form
        v-if="templateList.length !== 0"
        :ref="(el)=>formRefs.from=el"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 19 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          v-for="(item, index) in templateList"
          :key="index"
          :label="item.label"
          :name="item.label"
          :rules="[{ required: true, message: `请输入${item.label}` }]"
        >
          <!--        <a-input v-model:value="item.value" v-if="item.type==='text'" :disabled="true"  placeholder="text" />-->

          <div class="x">
            <div style="width: 90%">
              <div style="width: 100%; height: 40px" v-if="item.type === 'text'">
                <a-textarea
                  allowClear
                  size="large"
                  v-model:value="formState[item.label]"
                  :placeholder="`输入${item.label}`"
                  :auto-size="{ minRows: 1, maxRows: 5 }"
                />
              </div>
              <fileList
                v-if="item.type === 'file'"
                v-model:value="formState[item.label]"
                v-model:activeKey="activeKey"
                :index="index"
                @change="fileListChange"
              >
              </fileList>

              <array
                :ref="(el)=>arrayRefs['ref_'+index] = el"
                v-if="item.type === 'array'"
                v-model:item="formState[item.label]"
                :index="index"
                :activeKey="activeKey"
                @change="arrayChange"
                @input="fileListChange"
              />
            </div>

            <div style="width: 10%">
              <div class="center" style="width: 100%; height: 40px">
                <a-popconfirm
                  placement="topRight"
                  title="确认删除"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteFrom(index)"
                >
                  <a-button type="link" size="small" shape="circle" danger title="删除">
                    <DeleteOutlined style="color: red" />
                  </a-button>
                </a-popconfirm>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-form>
      <div class="f-wh100 center" v-else>
        <a-empty  />
      </div>

    </div>

    <addDataModal :ref="(el) => (refs.addData = el)" @change="addDataModalChange" />
  </div>
</template>

<script setup lang="ts">
import addDataModal from './components/addData-modal.vue'

import fileList from './components/fileList/fileList.vue'
import array from './components/array/array.vue'
import { message } from 'ant-design-vue'
import {
  PlusSquareOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
const activeKey: any = ref('')
const refs: any = ref({
  addData: null
})
const formRefs:any = ref({
  title:null,
  from:null
})
const arrayRefs:any = ref({})
interface TemplateListItem {
  label: string
  value: string | any
  type?: string
  key: string
  activeKey?: string
  children: TemplateListItem[]
}

const templateList = ref<TemplateListItem[]>([])
interface FormState {
  dataName: string | null
}

const formState = reactive<FormState>({
  dataName: null
})

const onFinish = (_values: any) => {
  // console.log('Success:', values)
}

const onFinishFailed = (_errorInfo: any) => {
  // console.log('Failed:', errorInfo)
}

const addDataModalChange = (data: TemplateListItem) => {
  verifyArray()
  const filter = templateList.value.filter((item) => item.label === data.label)
  if (filter.length > 0) {
    message.error('重复字段名!')
    refs.addData.open(data)
    return
  }

  const keys = templateList.value.length
  const newData = {
    ...data,
    // key: keys,
  }
  formState[data.label] = data.value
  templateList.value.push(newData)
  activeKey.value = keys.toString()
}

const fileListChange = (_e: any) => {
  formRefs.value.from.validate()
}

const verifyArray = () => {
  for (const key in arrayRefs.value) {
    if(arrayRefs.value[key]){
      const verify = arrayRefs.value[key].validate()
      if(!verify){
        throw new Error('fun:verifyArray ')
      }
    }
  }

}
const save = () => {
  formRefs.value.title?.validate().then(()=>{
    formRefs.value.from?.validate().then(()=>{

      const newData = {}
      for (const key in formState) {
        if (formState[key] !== null) {
          newData[key] = formState[key]
        }
      }
      console.log('save',newData)
    }).catch(()=>{
      console.log('error')
    })
  })

}
const arrayChange = (e:any)=>{
  verifyArray()
  activeKey.value = e.key
}

const deleteFrom = (index)=>{
  if(arrayRefs.value['ref_'+index]){
    delete arrayRefs.value['ref_'+index]

  }
  formState[templateList.value[index].label] = null
  templateList.value.splice(index, 1)

}
</script>

<style scoped lang="scss">
.addTemplate {
  width: 100%;
  height: 100%;
  background-color: var(--bg-color-content);

}
</style>
