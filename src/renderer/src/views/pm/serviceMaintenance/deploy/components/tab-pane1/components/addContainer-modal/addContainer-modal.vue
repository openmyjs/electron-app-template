<template>
  <a-modal
    v-model:open="modelOpen"
    title="创建容器"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    :maskClosable="false"
  >
    <mongoFrom
      :ref="(el) => (FromRefs.mongo = el)"
      v-if="refsIndex === 'mongo'"
      :execTo="execTo"
      :tag="imageInfo.tag"
      @confirmLoading="(state) => (confirmLoading = state)"
    />
    <mysqlFrom
      :ref="(el) => (FromRefs.mysql = el)"
      v-if="refsIndex === 'mysql'"
      :execTo="execTo"
      :tag="imageInfo.tag"
      @confirmLoading="(state) => (confirmLoading = state)"
    />
    <customFrom
      :ref="(el) => (FromRefs.custom = el)"
      v-if="refsIndex === 'custom'"
      :execTo="execTo"
      :imageInfo="imageInfo"
      @confirmLoading="(state) => (confirmLoading = state)"
    />
    <httpdFrom
      :ref="(el) => (FromRefs.httpd = el)"
      v-if="refsIndex === 'httpd'"
      :execTo="execTo"
      :imageInfo="imageInfo"
      @confirmLoading="(state) => (confirmLoading = state)"
    />
  </a-modal>
</template>
<script setup lang="tsx">
import { ref, defineExpose } from 'vue'
import mongoFrom from './components/mongo.vue'
import mysqlFrom from './components/mysql.vue'
import customFrom from './components/custom.vue'
import httpdFrom from './components/httpd.vue'
defineProps({
  execTo: {
    type: Function,
    required: true
  }
})
const modelOpen = ref(false)
const confirmLoading = ref(false)
const FromRefs: any = ref({
  mongo: null,
  mysql: null,
  custom: null,
  httpd: null
})
const imageInfo: any = ref()
const refsIndex: any = ref()
const open = (param: { imageName: string; tag: string }) => {
  console.log('param', param)
  imageInfo.value = param
  refsIndex.value = param.imageName
  if (!(param.imageName in FromRefs.value)) {
    refsIndex.value = 'custom'
  }
  modelOpen.value = true
}
const close = () => {
  modelOpen.value = false
}
const handleOk = async () => {
  await FromRefs.value[refsIndex.value].verifyForm(() => {
    close()
  })
}
defineExpose({ open, close })
</script>
<style scoped lang="scss"></style>
