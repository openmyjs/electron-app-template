<template>
  <div class="fileList">
    <a-collapse :activeKey="activeKey" accordion @change="(e)=>{
      emit('update:activeKey',e)
    }">
      <a-collapse-panel :key="index" header="文件列表">
        <template #extra>
          <div v-if="String(activeKey) === String(index)" @click.stop style="width: 30px; height: 100%">
            <a-button type="link" size="small" shape="circle"  title="添加" @click="chooseFIle">
              <PlusOutlined />
            </a-button>
          </div>
        </template>
        <div v-if="valueToArray" class="fileList-icon" v-for="(item, idx) in valueToArray" :key="idx" :title="item.title">
          <div class="f-button x-c-l">
            <ProfileOutlined />
            <div class="fileList-icon-txt">{{ item.name }}</div>
          </div>
          <div class="fileList-icon-left f-button center">
            <a-button type="link" size="small" shape="circle" danger title="删除" @click="deleteValue(idx)">
              <DeleteOutlined />
            </a-button>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script setup lang="ts">
import { ProfileOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { extractFileInfo } from '@renderer/utils'

const emit = defineEmits(['update:value', 'update:activeKey','change','delete'])

const props = defineProps({
  activeKey:{
    type: [String,Number, null],
    default: ''
  },
  value: {
    required: true,
    type: [String,null]
  },
  index:{
    type: [String,Number, null],
    default: ''
  }
})
const valueToArray = computed(() => {
  if (props.value){
    return props.value.split(',').map((item:any)=>{
      return extractFileInfo(item)
    }).map((item: any) => {
      return {
        title: item.filePath,
        name: item.fileNameWithExtension
      }
    })
  }
  return []
})

const chooseFIle = async () => {
  const res = await electron.chooseFile({
    title: '选择文件',
    properties: ['openFile', 'multiSelections']
  })
  if (res){
    const data = props.value? props.value.split(',') : []
    const newData = [...data, ...res].join(',')

    emit('update:value', newData)
    emit('change', newData)

    // console.log('newData', newData)
  }

}
const deleteValue = (e:any) => {
  if(props.value){
    const toArray = props.value.split(',')
    toArray.splice(e, 1)
    if (toArray.length > 0){
      emit('update:value', toArray.join(','))
    }else {
      emit('update:value', null)
    }
  }
}
</script>
<style scoped lang="scss">
.fileList {
  width: 100%;
  white-space: pre-wrap;
  flex-wrap: wrap;
  &-icon {
    height: 30px;
    border-radius: 30px;
    font-size: 15px;
    position: relative;
    // 文本超出宽度显示...

    &-txt {
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 90%;
    }

    &-left {
      position: absolute;
      right: 0;
      top: 0;
      width: 10%;
      height: 100%;
    }
  }
}
</style>
