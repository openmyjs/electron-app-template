<template>
  <div class="development">
    <a-tabs :activeKey="activeKey" style="width: 100%" @change="changeTabas">
      <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.tab" style="width: 100%"> </a-tab-pane>
    </a-tabs>

    <swiper :current="activeKey" :duration="300">
      <swiper-item>
        <tabPane0 :exec="exec" :startServer="startServer" />
      </swiper-item>
      <swiper-item>
        <tabPane1 :exec="exec" :keys="1" :activeKey="activeKey" :serverConfig="serverConfig" />
      </swiper-item>
      <swiper-item>
        <tabPane2 :exec="exec" :keys="2" :activeKey="activeKey" />
      </swiper-item>
    </swiper>

    <!--    <tabPane3 v-if="activeKey === 3" :log="execLog" @execEnd="execEnd" @change="exec" :execState="execState" />-->
    <!--    <context-holder />-->
  </div>
</template>
<script setup lang="ts">
import swiper from '@renderer/components/swiper/swiper.vue'
import swiperItem from '@renderer/components/swiper/swiper-item.vue'
import tabHooks from './hooks/tab'
import serverHooks from './hooks/server'
// import dockerHooks from './hooks/docker'
import tabPane0 from './components/tab-pane0/tab-pane0.vue'
import tabPane1 from './components/tab-pane1/tab-pane1.vue'
import tabPane2 from './components/tab-pane2/tab-pane2.vue'
// import tabPane3 from './components/tab-pane3.vue'
// import { InfoCircleOutlined } from '@ant-design/icons-vue'

// import { message } from 'ant-design-vue'
// import { computed, watch } from 'vue'
// const [messageApi, contextHolder] = message.useMessage()

const { tabList, activeKey } = tabHooks()
const { exec, startServer, serverConfig } = serverHooks()
const changeTabas = (e: number) => {
  // console.log('changeTabas', e)
  // if (serverState.value) {
  //   activeKey.value = e
  //   return
  // }
  activeKey.value = e
  // messageApi.error('服务器未连接')
}
const onSwiper = (swiper) => {
  console.log(swiper)
}
const onSlideChange = () => {
  console.log('slide change')
}
</script>
<style scoped lang="scss">
.development {
  width: 100%;
  height: 100%;
}
</style>
