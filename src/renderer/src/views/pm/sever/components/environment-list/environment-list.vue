<template>
  <div class="development">
    <a-button type="primary" @click="tap">新增环境</a-button>
    <a-tabs :activeKey="activeKey" style="width: 100%" @change="changeTabas">
      <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.tab"> </a-tab-pane>
    </a-tabs>
    <swiper :current="activeKey" :duration="300">
      <swiper-item> </swiper-item>
      <swiper-item> </swiper-item>
      <swiper-item> </swiper-item>
    </swiper>
    <addEnvironmentModal ref="addEnvironmentModalRefs" />
  </div>
</template>
<script setup lang="tsx">
import swiper from '@renderer/components/swiper/swiper.vue'
import swiperItem from '@renderer/components/swiper/swiper-item.vue'
import tabHooks from './hooks/tab'
import { ref } from 'vue'
// import { Button } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import addEnvironmentModal from '../../components/addEnvironment-modal/addEnvironment-modal.vue'
const addEnvironmentModalRefs: any = ref(null)
const router = useRouter()

const { tabList, activeKey } = tabHooks()
const changeTabas = (e: number) => {
  // console.log('changeTabas', e)
  // if (serverState.value) {
  //   activeKey.value = e
  //   return
  // }
  activeKey.value = e
  // messageApi.error('服务器未连接')
}
const tap = () => {
  addEnvironmentModalRefs.value.open()
}
</script>
<style scoped lang="scss">
.development {
  width: 100%;
  height: 100%;
}
</style>
