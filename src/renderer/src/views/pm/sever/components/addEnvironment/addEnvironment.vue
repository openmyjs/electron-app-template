<template>
  <div class="f-wh100 center">
    <a-button type="primary" @click="tap">添加服务器</a-button>
    <div>模式{{ MODE }}</div>
    <addEnvironmentModal ref="addEnvironmentModalRefs" :config="config" :ssh="ssh" @update:config="updateConfig" />
  </div>
</template>
<script setup lang="ts">
import addEnvironmentModal from '../../components/addEnvironment-modal/addEnvironment-modal.vue'
import { ref, defineProps } from 'vue'
defineProps({
  config: {
    type: Object,
    default: () => {
      return {}
    }
  },
  ssh: {
    type: Object,
    required: true
  }
})
const MODE = ref(import.meta.env.PROJECTPATH)
const emit = defineEmits(['update:config'])
const addEnvironmentModalRefs: any = ref(null)
const tap = () => {
  addEnvironmentModalRefs.value.open()
}
const updateConfig = (val: any) => {
  console.log('val', val)
  emit('update:config', val)
}
</script>

<style scoped lang="scss"></style>
