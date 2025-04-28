<template>
  <a-collapse :activeKey="activeKey" accordion @change="collapseChange">
    <template #expandIcon="{ isActive }">
      <div class="center" style="position: absolute; width: 25px; height: 100%; top: 0; left: 0">
        <CaretRightOutlined :rotate="isActive ? 90 : 0" />
      </div>
    </template>
    <a-collapse-panel :key="index">
      <template #header>
        <div style="width: 250px" @click.stop>
          <a-select
            v-model:open="selectItems.open"
            @click.stop
            :ref="(el) => (selectRefs = el)"
            v-if="selectItems.options.length > 0"
            :value="formState.value"
            :placeholder="selectItems.placeholder"
            :disabled="!(String(props.activeKey)===String(props.index))"
            @dropdownVisibleChange="selectItems.dropdownVisibleChange"
            @change="selectItems.change"
          >
            <!--            <div>1111111</div>-->
            <a-select-option
              v-for="(item, index) in selectItems.options"
              :key="index"
              :value="item.label"
              style="width: 100%"
            >
              <div class="x-c-l" style="position: relative">
                {{ item.label }}
                <div
                  class="center f-button"
                  v-if="selectItems.open"
                  @click.stop="selectItems.delete(index)"
                  style="width: 30px; height: 100%; position: absolute; right: 0; top: 0"
                >
                  <DeleteOutlined style="color: red" />
                </div>
              </div>
            </a-select-option>

            <template #dropdownRender="{ menuNode: menu }">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <a-space style="padding: 4px 8px">
                <a-input ref="inputRef" v-model:value="selectItems.inputName" placeholder="输入子集合名称" />
                <a-button type="text" @click="selectItems.selectAdd(selectItems.inputName)">
                  <template #icon>
                    <plus-outlined />
                  </template>
                 添加
                </a-button>
              </a-space>
            </template>
          </a-select>
          <div v-else @click.stop>
            <a-input
              :disabled="!(String(props.activeKey)===String(props.index))"
              ref="inputRef"
              v-model:value="selectItems.inputName"
              placeholder="输入子集合名称"
            />
            <a-button
              v-if="String(props.activeKey)===String(props.index)"
              type="link"
              size="small"
              shape="circle"
              style="width: 50px"
              @click="selectItems.add(selectItems.inputName)"
            >
              <SaveOutlined title="保存" />
            </a-button>
          </div>
        </div>
      </template>
      <template #extra>
        <div
          class="x-c-r"
          style="width: 30px; height: 30px; gap: 20px"
          v-if="(String(props.activeKey)===String(props.index))&&selectItems.options.length === 1"
          @click.stop >
          <a-button

            type="link"
            size="small"
            shape="circle"
            title="添加数据"
            @click="
              () => {
                refs.addSon.open()
              }
            "
          >
            <PlusOutlined />
          </a-button>
          <!--          <a-button type="link" size="small" shape="circle" >-->
          <!--            <EditOutlined title="编辑" />-->
          <!--            <SaveOutlined title="编辑保存" />-->
          <!--          </a-button>-->
        </div>
      </template>
<!--      {{ optionsMap }}-->

      <div v-for="(im, ix) in optionsMap" :key="ix" v-if="optionsMap.length!==0">
        <a-form
          :ref="(el)=>refsFrom['refs'+ix]=el"
          :model="im"
          name="basic"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 21 }"
          autocomplete="off"
        >
          <a-form-item
            :label="im.label"
            name="value"
            :rules="[{ required: true, message: `请输入${im.label}!` }]"
          >
            <div class="x" style="width: 100%">
              <div style="width: 90%">
                <a-textarea
                  v-if="im.type === 'text'"
                  :key="ix"
                  allowClear
                  size="large"
                  v-model:value="im.value"
                  :placeholder="`输入${im.label}`"
                  :auto-size="{ minRows: 1, maxRows: 5 }"
                />
                <fileList
                  v-if="im.type === 'file'"
                  v-model:value="im.value"
                  v-model:activeKey="fileListActiveKey"
                  :index="ix"
                  @change="()=>{
                    refsFrom['refs'+ix].validate()
                  }"
                />
              </div>
              <div
                class="center"
                style="width: 10%;height: 40px"
                v-if="(String(props.activeKey)===String(props.index))&&selectItems.options.length === 1"
              >
                <a-popconfirm
                  placement="topRight"
                  title="确认删除"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="selectItems.deleteSon(ix)"
                >
                  <a-button type="link" size="small" shape="circle" danger title="删除" >
                    <DeleteOutlined style="color: red" />
                  </a-button>
                </a-popconfirm>

              </div>
            </div>

          </a-form-item>
        </a-form>
      </div>
      <a-empty v-else description="暂无字段数据" />
    </a-collapse-panel>
  </a-collapse>
  <addSonModal :ref="(el) => (refs.addSon = el)" @change="addSonModalChange" />
</template>
<script lang="ts" setup>
import { PlusOutlined, CaretRightOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import addSonModal from './components/addSon-modal.vue'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import fileList from '../fileList/fileList.vue'
const emit = defineEmits(['update:activeKey','change','update:item','input'])
const props = defineProps({
  activeKey: {
    type: [String, null, Array],
    default: ''
  },
  item: {
    type: [null, Array],
    default: {}
  },
  index: {
    type: [String, Number],
    default: ''
  },
})

const fileListActiveKey = ref('0')
const refs: any = ref({
  addSon: null
})
const refsFrom:any = ref({})
const selectRefs: any = ref(null)
interface FormState {
  value: string | null
}
const formState = reactive<FormState>({
  value: null
})

const selectItems: any = ref({
  nowKey: null,
  open: false,
  placeholder: '选择',
  disabled: false,
  inputName: null,
  options:computed(()=>{
    if(props.item){
      return props.item
    }
    return []
  }),
  // 下拉框change显示
  dropdownVisibleChange: (e: boolean) => {
    selectItems.value.open = e
  },
  change: (value: any, option: any) => {
    if(selectItems.value.options.length>1){
      const verify = selectItems.value.verifyForm()
      if(!verify){
        return
      }
    }

    selectItems.value.nowKey = option.key
    formState.value = value
    // console.log('verify',verify)




  },
  // 验证集合中的表单
  verifyForm: () => {
    const key = selectItems.value.nowKey;
    const options = selectItems.value.options;

    if (key === null || !options[key]?.children) {
      message.error('请选择或是添加有效的集合/字段');
      return false;
    }

    if (options[key].children.length === 0) {
      message.error('集合没有字段');
      return false;
    }

    // 使用 some 检查是否有字段为空
    const hasEmptyField = options[key].children.some((item: any, index: number) => {
      if (!item.value) {
        refsFrom.value[`refs${index}`]?.validate();
        message.error('字段数值不能为空');
        return true; // 提前退出
      }
      return false;
    });

    return !hasEmptyField;

     // 如果没有空字段，则返回 true
  },
  selectAdd: (e: any) => {
    if(selectItems.value.verifyForm()){
      selectItems.value.add(e)
    }
  },
  add: (e: any) => {
    const filter = selectItems.value.options.filter((item: any) => {
      return item.label === e
    })

    if(filter.length > 0){
      message.error('该名称已存在')
      return
    }
    if (e) {
      const key = selectItems.value.options.length
      selectItems.value.nowKey = key
      let copyChildren:any = []
      if(key!==0){
        copyChildren = JSON.parse(JSON.stringify(selectItems.value.options[0].children))
        copyChildren.forEach((item:any) => {
          item.value = null
          if(item.children.length!==0){
            item.children.forEach((item:any) => {
              item.value = null
            })
          }
        })
      }

      selectItems.value.options.push({
        label: e,
        type:'array',
        disabled: false,
        children: copyChildren
      })
      selectItems.value.inputName = null
      formState.value = e
      emit('input')
    }
  },
  // 删除options下拉框 的 index
  delete: (e: number) => {
    selectItems.value.options.splice(e, 1)
    formState.value = null
    selectItems.value.nowKey = null
  },
  deleteSon: (e: number) => {
    const key = selectItems.value.nowKey
    selectItems.value.options[key].children.splice(e, 1)
  }
})
// watch(() => selectItems.value.options, (newValue) => {
//   console.log('newValue', newValue)
//   emit('update:item', newValue)
// })
const optionsMap = computed(() => {
  if (selectItems.value.nowKey !== null) {
    const key = selectItems.value.nowKey
    return selectItems.value.options[key].children
  }
  return []
})

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true
    }
  },
  render() {
    // 使用 h 函数渲染内容
    return this.vnodes
  }
})

const addSonModalChange = (e: any) => {

  const key = selectItems.value.nowKey
  const filter = selectItems.value.options[key].children.filter((item: any) => {
    return item.label === e.label
  })
  if(filter.length > 0){
    message.error('该名称已存在')
    setTimeout(() => {
      refs.value.addSon.open(e)
    },100)
    return
  }
  selectItems.value.options[key].children.push(e)
}

const collapseChange = (e: any, _item: any) => {
  emit('change', {
    type: 'collapse',
    key:e,
  })
  emit('update:activeKey', e)

}

//触发验证表单
const validate = () => {
  return  selectItems.value.verifyForm()
}
defineExpose({validate})
</script>
