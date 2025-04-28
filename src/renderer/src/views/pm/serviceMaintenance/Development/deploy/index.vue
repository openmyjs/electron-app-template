<template>
  <div class="development">
    <a-tabs :activeKey="serverState ? activeKey : 0" style="width: 100%" @change="changeTabas">
      <a-tab-pane v-for="(item, index) in tabList" :key="index" :tab="item.tab" style="width: 100%"> </a-tab-pane>
    </a-tabs>
    <!--    <div class="y f-wh100" style="width: 100%" v-if="activeKey === 0">-->
    <!--      <a-button-->
    <!--        v-if="!serverState"-->
    <!--        type="primary"-->
    <!--        size="small"-->
    <!--        style="width: 100px; margin-left: 10px"-->
    <!--        @click="serverStart"-->
    <!--      >-->
    <!--        启动服务器-->
    <!--      </a-button>-->
    <!--      <a-button-->
    <!--        v-if="serverState"-->
    <!--        type="primary"-->
    <!--        size="small"-->
    <!--        style="width: 100px; margin-left: 10px"-->
    <!--        @click="serverClose"-->
    <!--      >-->
    <!--        退出服务器-->
    <!--      </a-button>-->
    <!--      <a-button type="primary" size="small" style="width: 100px; margin-top: 10px" @click="serverStart">-->
    <!--        安装docker-->
    <!--      </a-button>-->
    <!--      <p class="f-container">{{ serverLog }}</p>-->
    <!--    </div>-->
    <tabPane0
      v-if="activeKey === 0"
      :log="execLog"
      @removeExecLog="removeExecLog"
      @execEnd="execEnd"
      @change="exec"
      :execState="execState"
    />
    <tabPane1
      v-if="activeKey === 1"
      :log="execLog"
      @removeExecLog="removeExecLog"
      @execEnd="execEnd"
      @change="exec"
      :execState="execState"
    />
    <tabPane2
      v-if="activeKey === 2"
      :log="execLog"
      @removeExecLog="removeExecLog"
      @execEnd="execEnd"
      @change="exec"
      :execState="execState"
    />
    <tabPane3 v-if="activeKey === 3" :log="execLog" @execEnd="execEnd" @change="exec" :execState="execState" />
    <context-holder />
  </div>
</template>
<script setup lang="ts">
import tabHooks from './hooks/tab'
import sshHooks from './hooks/ssh'
// import dockerHooks from './hooks/docker'
import tabPane0 from './components/tab-pane0.vue'
import tabPane1 from './components/tab-pane1/tab-pane1.vue'
import tabPane2 from './components/tab-pane2/tab-pane2.vue'
import tabPane3 from './components/tab-pane3.vue'
// import { InfoCircleOutlined } from '@ant-design/icons-vue'

import { message } from 'ant-design-vue'
// import { computed, watch } from 'vue'
const [messageApi, contextHolder] = message.useMessage()

const { tabList, activeKey } = tabHooks()
const {
  serverLog,
  serverStart,
  serverClose,
  serverState,
  execLog,
  exec,
  execState,
  execSuccess,
  execEnd,
  removeExecLog
} = sshHooks()

// const { dockerLog, dockerState,, dockerUninstall } = dockerHooks()
const changeTabas = (e: number) => {
  // console.log('changeTabas', e)
  if (serverState.value) {
    activeKey.value = e
    return
  }
  messageApi.error('服务器未连接')
}
</script>
<style scoped lang="scss">
.development {
  width: 100%;
  height: 100%;
}
</style>
