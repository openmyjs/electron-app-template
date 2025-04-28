<template>
  <div class="deployTab1 x" style="height: calc(100% - 80px)">
    <div class="y">
      <a-tooltip v-for="(item, index) in cmdCodeList" :key="index" :title="item.code" placement="right">
        <a-button
          class="deployTab1-button"
          type="primary"
          :disabled="item.disabled"
          :loading="item.loading"
          size="small"
          @click="tap({ index, code: item.code })"
        >
          {{ item.name }}
        </a-button>
      </a-tooltip>
      <a-button class="deployTab1-button" type="primary" size="small" @click="emit('execEnd')"> 终止执行 </a-button>
      <a-button class="deployTab1-button" type="primary" size="small" @click="emit('removeExecLog')">
        清除日志
      </a-button>
    </div>
    <div class="f-scroll-y f-scroll-set" style="width: 100%; height: 100%; font-size: 10px">
      <p class="f-container">{{ log }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue'
const emit = defineEmits(['change', 'execEnd', 'removeExecLog'])
// 使用接口定义 props 类型

// 定义 props 并使用 withDefaults 设置默认值（如果需要）
// const props = withDefaults(defineProps<Props>(), {
//   log: '',
//   execState: false
// })
const props = defineProps({
  log: String,
  execState: Boolean
})
const cmdCodeList: any = ref([
  {
    name: 'MongoDB最新镜像',
    code: 'docker search mongo',
    loading: false,
    disabled: false
  },
  {
    name: '取最新版的 MongoDB 镜像',
    code: 'docker pull mongo:latest',
    loading: false,
    disabled: false
  }
])

const tap = (e: { index: number; code: string }) => {
  // console.log('installDocker')
  cmdCodeList.value[e.index].loading = true
  cmdCodeList.value.forEach((item, index) => {
    item.disabled = index !== e.index
  })
  emit('change', { type: 'exec', data: e.code })
}
watch(
  () => props.execState,
  () => {
    if (props.execState) {
      endButtonState()
    }
  }
)
/** 恢复button正常状态*/
const endButtonState = () => {
  cmdCodeList.value.forEach((item: any) => {
    item.disabled = false
    item.loading = false
  })
}
onMounted(() => {})
</script>
<style scoped lang="scss">
.deployTab1 {
  //background-color: #3178c6;
  width: 100%;
  position: relative;
  &-button {
    width: 150px;
    margin-top: 15px;
  }
}
</style>
