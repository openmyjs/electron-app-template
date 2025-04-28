<template>
  <div>
    <a-collapse  v-model:activeKey="activeKey" :bordered="false" accordion>
      <a-collapse-panel v-for="(item, index) in listData" :key="index" :header="item.label">
        <template #extra>
<!--          成功状态-->
          <CheckCircleOutlined v-if="item.status === 0" style="color: #23ff1e" />
<!--          // 加载状态-->
          <RedoOutlined v-if="item.status === 1" spin style="color: #3178c6" />
<!--          错误状态-->
          <CloseCircleOutlined v-if="item.status === 2" style="color: #ff0000" />
        </template>
        <div v-for="(itm, idx) in item.children" :key="idx" class="f-button y">
          <div>
            {{ itm.label }}
          </div>
          <a-progress
            :percent="itm.percent"
            :status="(()=>{
              switch (itm.status) {
                case 0:
                  return 'success'
                case 1:
                  return 'active'
                case 2:
                  return 'exception'
                default:
                  return 'active'
              }
            })()"
            :show-info="false"
          />
        </div>
      </a-collapse-panel>
    </a-collapse>
    <!--  <a-progress :percent="70"  status="exception" />-->
    <!--  <a-progress :percent="100"  status="success" />-->
  </div>
</template>
<script setup lang="ts">
import { CheckCircleOutlined, RedoOutlined, ArrowRightOutlined ,CloseCircleOutlined} from '@ant-design/icons-vue'
import {FlowLogs} from '@renderer/views/puppeteer/dataV/hooks/createFlow'

// 明确 props 类型
const props = defineProps<{
  list: FlowLogs[]
}>()

const listData =computed(() =>{

  return  props.list
})
watch(props.list, () => {
  nextTick(() => {
    activeKey.value = [props.list.length - 1]
  })
})
const activeKey = ref([0])



// const list  = ref<Item[]>([
//   {
//     title: 'title',
//     percent: 100,
//     status: 'active'
//   },
//   {
//     title: 'title',
//     percent: 70,
//     status: 'active'
//   },
// ])
</script>
<style scoped lang="scss"></style>
