<template>
  <div>
    <a-collapse :activeKey="activeKey" accordion @change="changeTabs">
      <a-collapse-panel :key="index" header="集合列表">
        <template #extra>
          <div
            v-if="String(activeKey) === String(index)"
            class="x-c-r"
            style="width: 200px; height: 30px; gap: 20px"
            @click.stop
          >
            <a-button
              type="link"
              size="small"
              shape="circle"
              title="新增子集合"
              @click="
                () => {
                  refs.addArray.open({
                    title: `新增子集合`,
                    type: 'add',
                    data: {
                      sonArrayName: null
                    }
                  })
                }
              "
            >
              <PlusOutlined />
            </a-button>
            <a-button type="link" size="small" shape="circle" title="编辑集合">
              <EditOutlined title="编辑集合" />
            </a-button>
          </div>
        </template>
        <a-collapse :activeKey="item.activeKey" accordion @change="(e:any)=>{
          return collapseChange(e,item)
        }">
          <a-collapse-panel v-for="(itm, idx) in item.children" :key="idx" showArrow>
            <template #header>
              {{ itm.label }}
              <!--              {{item.activeKey}}-->
            </template>
            <template #extra>
              <div
                v-if="String(item.activeKey) === String(idx)"
                class="x-c-r"
                @click.stop
                style="width: 200px; height: 30px; gap: 20px"
              >
                <a-button
                  type="link"
                  size="small"
                  shape="circle"
                  title="新增字段"
                  @click="
                    () => {
                      refs.addSon.open()
                    }
                  "
                >
                  <PlusOutlined />
                </a-button>
                <a-button type="link" size="small" shape="circle" title="复制子集合">
                  <CopyOutlined />
                </a-button>
                <a-popconfirm
                  title="确认删除"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="
                    () => {
                      emit('change', {
                        type: 'delete',
                        key: props.index,
                        data: idx
                      })
                    }
                  "
                >
                  <a-button type="link" size="small" shape="circle" danger title="删除">
                    <DeleteOutlined style="color: red" />
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
            <!--            {{itm}}-->
            <div v-for="(im, ix) in itm.children" :key="ix">
              <a-form
                :ref="(el)=>formRefs['ref_'+ix] = el"
                :model="im"
                name="basic"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
                autocomplete="off"
              >
                <a-form-item
                  :label="im.label"
                  name="value"
                  :rules="[{ required: true, message: `请输入${im.label}!` }]"
                >
                  <div class="x">
                    <div style="width: 90%">
                      <div style="height: 50px"  v-if="im.type === 'text'">
                        <a-textarea
                          :key="ix"
                          allowClear
                          size="large"
                          v-model:value="im.value"
                          :placeholder="`输入${im.label}`"
                          :auto-size="{ minRows: 1, maxRows: 5 }"
                        />
                      </div>
                      <fileList
                        v-if="im.type === 'file'"
                        v-model:value="im.value"
                        v-model:activeKey="fileListActiveKey"
                        :index="ix"
                        @change="
                          (e) => {
                            return fileListChange(e, im)
                          }
                        "
                      />
                    </div>
                    <div style="width: 10%">
                      <div class="center" style="width: 100%; height: 40px;">
                        <a-popconfirm
                          title="确认删除"
                          ok-text="Yes"
                          cancel-text="No"
                          @confirm="
                            () => {
                              delete formRefs['ref_'+ix]
                              itm.children.splice(ix, itm.children.length)
                            }
                          "
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
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
    </a-collapse>
    <addArrayModal :ref="(el) => (refs.addArray = el)" @change="addArrayModalChange" />
    <addSonModal :ref="(el) => (refs.addSon = el)" @change="addSonModalChange" />
  </div>
</template>
<script setup lang="ts">
import { CopyOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import addArrayModal from './components/addArray-modal.vue'
import addSonModal from './components/addSon-modal.vue'
import fileList from '../fileList/fileList.vue'
import { ref } from 'vue'
// import { message } from 'ant-design-vue'
const emit = defineEmits(['update:activeKey', 'change', 'update:value'])
const props = defineProps({
  activeKey: {
    type: [String, Number, null],
    default: ''
  },
  item: {
    type: Object,
    default: {}
  },
  index: {
    type: [String, Number],
    default: ''
  }
})
const formRefs: any = ref({})
const fileListActiveKey = ref('0')
const refs: any = ref({
  addArray: null,
  addSon: null
})
watch(
  () => props.item,
  (newValue) => {
    console.log('newValue', newValue)
  }
)
const addArrayModalChange = (e: any) => {
  // console.log('addArrayModalChange', e)
  const { type, data } = e
  switch (type) {
    case 'add':
      const newData = {
        type: 'add',
        key: props.index,
        data: {
          label: data.sonArrayName,
          value: '',
          type: 'sonArray',
          children: []
        }
      }

      emit('change', newData)
      break
    case 'edit':
      break
  }
}
const changeTabs = (e: any) => {
  emit('update:activeKey', e)
}
const collapseChange = (e: any,_item:any) => {
  // console.log('1111111111111',item)
  const item = props.item
  const nowActiveKey = item.activeKey? JSON.parse(JSON.stringify(item.activeKey)) : item.activeKey
  if(formRefs.value){
    console.log('collapseChange---1', e)
    console.log()
    for (const Key in formRefs.value) {
      formRefs.value[Key]?.validate().then(async () => {
        item.activeKey = e
      }).catch(()=>{
        item.activeKey = nowActiveKey
      })
    }
  }else {
    console.log('collapseChange---2', e)
    item.activeKey = e
  }
  console.log('collapseChange', e)
}
const addSonModalChange = (e: any) => {
  console.log('addSonModalChange', e)
  emit('change', {
    type: 'addSon',
    key: props.index,
    data: e
  })
}
const fileListChange = (e: any, im: any) => {
  const { key, data, type } = e
  switch (type) {
    case 'delete':
      im.value.splice(data, 1)
      break
  }
}
</script>
<style scoped lang="scss"></style>
