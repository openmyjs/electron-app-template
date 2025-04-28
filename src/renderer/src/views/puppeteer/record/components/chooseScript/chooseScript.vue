<template>
  <a-modal v-model:open="modelOpen" title="选择脚本" :footer="null" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
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
const emit = defineEmits(['change'])
const modelOpen = ref(false)
const confirmLoading = ref(false)
const dataSource:any = ref<string[]>([])
const open = (e: any) => {
  readDir()
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}

const handleOk = () => {}
const readDir = async () => {
  dataSource.value = await electron.readDir('scriptFile/script/list/')
}
const readFile = async (fileName: string) => {
  const res:any = await electron.readFile(`scriptFile/script/list/${fileName}`)
  emit('change', JSON.parse(res))
  close()
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
