

<template>
<div class="chooseFile y">
  <a-button
    type="dashed"
    style="width: 80px;height:80px"
    @click="tap"
  >
    <PlusOutlined style="font-size: 30px" />
  </a-button>
  <div class="y chooseFile-list">
    <a v-for="(item,index) in list" :key="index" style="font-size: 15px" :title="item.filePath">
      {{item.fileNameWithExtension}}
    </a>
  </div>

</div>
</template>

<script setup lang="ts">
import { PlusOutlined }from '@ant-design/icons-vue';
import {extractFileInfo} from '@renderer/utils'
const emit = defineEmits(['update:value'])
const props = defineProps({
  value:{
    type:[String,null],
    default:''
  }
})

const list = computed(() =>{
  if(props.value&&props.value.length>0){
    return props.value.split(',').map(extractFileInfo)
  }
  return []
})

const tap =async ()=>{

 const res = await electron.chooseFile({
    title:'选择文件',
   properties: ['openFile', 'multiSelections']
 }) && []
  const data = props.value? props.value.split(',') : []
  const newData = [...data,...res]
  console.log('newData',newData)
  emit('update:value',newData.join(','))
}

</script>

<style scoped lang="scss">
.chooseFile{
  width: 100%;
  //gap: 20px;
  &-list{
    flex-wrap:wrap;
    gap: 3px;
  }
}
</style>
