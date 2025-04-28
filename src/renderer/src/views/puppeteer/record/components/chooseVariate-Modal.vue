<template>
  <a-modal v-model:open="modelOpen" title="选择变量" :footer="null" :confirm-loading="confirmLoading" @ok="handleOk" :maskClosable="false">
    <a-list size="small" bordered :data-source="dataSource">
      <template #renderItem="{ item }">
        <a-list-item>
          <a @click="readFile(item.variate)">{{ item.type }}</a>
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
const open = (_e: any) => {
  readDir()
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}

const handleOk = () => {}
const readDir = async () => {
  const res:string = await electron.readFile('scriptFile/script/script.json')
  const toObj = JSON.parse(res)
  dataSource.value = toObj.script
}
const readFile = async (variate: string) => {
  emit('change', variate)
  close()
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
