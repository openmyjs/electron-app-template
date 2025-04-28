<template>
  <a-modal v-model:open="modelOpen" title="保存脚本" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
    <a-input v-model:value="scriptFileName" placeholder="请输入脚本名称" allowClear />
    <a-list size="small" bordered :data-source="dataSource">
      <template #renderItem="{ item }">
        <a-list-item>
          <a @click="readFile(item)">{{ item }}</a>
        </a-list-item>
      </template>
    </a-list>
  </a-modal>
</template>
<script setup lang="tsx">
// import {uuid} from '@renderer/utils'
const dataSource:any = ref<string[]>([])
const modelOpen = ref(false)
const confirmLoading = ref(false)
const scriptData:any = ref([])
const open = (e: any) => {
  scriptData.value = [...e]
  readDir()
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}

const readDir = async () => {
  dataSource.value = await electron.readDir('scriptFile/script/list/')
  console.log(' dataSource.value',  dataSource.value)
}
const readFile = async (fileName: string) => {
  scriptFileName.value = fileName

}
const scriptFileName = ref('')
const handleOk =async () => {
  // 保持脚本到本地
  const fileName = scriptFileName.value
  await electron.createFile({
    savePath: 'scriptFile/script/list',
    fileName: fileName,
    content: JSON.stringify(scriptData.value, null, 2),
    ensureDir:true
  })
  close()
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
