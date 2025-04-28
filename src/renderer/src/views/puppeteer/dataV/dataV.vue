<template>
  <div  style="padding: 10px; width: 100%; height: 100%; position: relative">
    <a-row :gutter="[10, 10]" v-if="loginStatus" >
      <a-col :span="6">
        <a-card title="请求任务" :bordered="false">
          <template #extra>
            <!--            <a-progress-->
            <!--              v-if="CountdownTime !== 0"-->
            <!--              :size="20"-->
            <!--              type="circle"-->
            <!--              :stroke-color="{-->
            <!--                '0%': '#108ee9',-->
            <!--                '100%': '#87d068'-->
            <!--              }"-->
            <!--              :percent="CountdownTime"-->
            <!--            />-->
            <div v-if="CountdownTime !== 0" class="center" style="width: 30px; height: 100%; color: #23ff1e">
              {{ CountdownTime }}
            </div>
            <!--            <a-progress :steps="4" :percent="80" :size="10" />-->
          </template>
          <div class="f-scroll-y f-no-scroll" style="width: 100%; height: 300px" :ref="(el) => (refs.req = el)">
            <div v-for="(item, index) in flowLogs" :key="index" class="f-button">
              <div class="x">
<!--                <ArrowRightOutlined v-if="item.status === 0 && flowLogs.length - 1 === index" style="color: #ff0000" />-->
                <RedoOutlined spin v-if="item.status === 0 && flowLogs.length - 1 === index" style="color: #0947b8" />
                <SwapOutlined v-if="item.status === 0 && flowLogs.length - 1 !== index"  style="color: #23ff1e" />
                <SyncOutlined v-if="item.status === 1" style="color: #5187e8" spin />
                <CloseCircleOutlined v-if="item.status === 2" style="color: #ff0000" />
                <HourglassOutlined v-if="item.status === 3" style="color: #741baf" />
                <div>{{ item.label }}</div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="创建流程" :bordered="false" style="border-radius: 10px">
          <template #extra>
            <!--            <CheckCircleOutlined v-if="cardIconStatus.createFlow === 0" style="color: #23ff1e" />-->
            <!--            <a-spin size="small" v-if="cardIconStatus.createFlow === 1" />-->
            <!--            <CloseCircleOutlined v-if="cardIconStatus.createFlow === 2" style="color: #ff0000" />-->
          </template>
          <div class="f-scroll-y f-no-scroll" style="width: 100%; height: 300px" :ref="(el) => (refs.createFlow = el)">
            <div
              class="f-button"
              style="width: 100%"
              v-if="createFlowList.length !== 0"
              v-for="(item, index) in createFlowList"
              :key="index"
              @click="setVisible(true)"
            >
              <div class="x">
                <AreaChartOutlined v-if="item.type === 'file,img' && item.status === 0" style="color: #23ff1e" />
                <FontSizeOutlined v-if="item.type === 'file,json' && item.status === 0" style="color: #23ff1e" />
                <SyncOutlined v-if="item.status === 1" style="color: #5187e8" spin />
                <div style="width: 3px"></div>

                <downTimeIcon v-if="item.status === 1" />
                <div style="width: 3px"></div>
                <span > {{ item.label }}</span>
              </div>
            </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="流程列表" :bordered="false" style="border-radius: 10px">
          <template #extra>
            <!--            <CheckCircleOutlined v-if="cardIconStatus.flow === 0" style="color: #23ff1e" />-->
            <!--            <a-spin size="small" v-if="cardIconStatus.flow === 1" />-->
            <!--            <CloseCircleOutlined v-if="cardIconStatus.flow === 2" style="color: #ff0000" />-->
            <a-progress
              v-if="backCountdownTime !== 0"
              :size="20"
              type="circle"
              :stroke-color="{
                '0%': '#108ee9',
                '100%': '#87d068'
              }"
              :percent="backCountdownTime"
            />
            <!--            <p v-if="backCountdownTime !== 0"> {{backCountdownTime}}</p>-->
          </template>
          <div class="f-scroll-y f-no-scroll y" style="width: 100%; height: 300px" :ref="(el) => (refs.flow = el)">
            <div v-if="flowList.length !== 0" class="f-wh100">
              <titleProgress :list="flowList" />
            </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="事件列表" :bordered="false" style="border-radius: 10px">
          <div class="f-scroll-y f-no-scroll y" style="width: 100%; height: 300px" :ref="(el) => (refs.incident = el)">
            <div v-if="scriptList.length !== 0" v-for="(item, index) in scriptList" :key="index">
              <!--              <div v-if="index===0">{{item}}</div>-->
              <div
                class="f-button"
                style="width: 100%"
              >
                <div class="x">
                  <CheckCircleOutlined v-if="item.status === 0" style="color: #23ff1e" />
                  <RedoOutlined spin v-if="item.status === 1" style="color: #0947b8" />
                  <CloseCircleOutlined v-if="item.status === 2" style="color: #ff0000" />
                  <div style="width: 3px"></div>
                  <downTimeIcon v-if="item.status === 1" />
                  <div style="width: 3px"></div>
                  <div v-if="item.status === 1" style="color: #5187e8">{{ item.label }}</div>
                  <div v-else>{{ item.label }}</div>
<!--                  <span v-if="item.status === 1" style="color: #23ff1e"> {{ item.label }}</span>-->
<!--                  <span v-else> {{ item.label }}</span>-->
                </div>
              </div>
            </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <Form v-else @change="FormChange"></Form>

        <a-button @click="start('scriptFile/get/16108/response.json')">start</a-button>
        <a-button @click="stop()">test</a-button>
        <a-button @click="tap()">tap</a-button>
        <a-button @click="record()">record</a-button>
        <div class="x" style="width: 100%">
          <a-input v-model:value="searchValue" placeholder="请输入搜索内容" allowClear />
          <a-button type="primary" @click="getSelector(searchValue)">查询元素</a-button>
        </div>
    <div style="width: 100%; height: 20px; position: absolute; bottom: 10px;color: #e0e0e0" class="center">
      {{ version }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AreaChartOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  FontSizeOutlined,
  SyncOutlined,
  HourglassOutlined,
  CheckCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons-vue'

import titleProgress from './components/titleProgress.vue'
import createFlowHooks from './hooks/createFlow'
import browser from '@renderer/views/puppeteer/hooks/browser'
import { countDown } from '@renderer/utils'
import Form from './components/form.vue'
import downTimeIcon from './components/downTimeIcon.vue'
const refs = ref<any>({
  createFlow: null,
  flow: null,
  incident: null,
  req: null
})
const searchValue = ref('')
const getSelector = async (data: any) => {
  const res = await electron.puppeteer.handle({
    type: 'getSelector',
    data: {
      value: JSON.parse(JSON.stringify(data))
    }
  })
  console.log('getSelector', res.data)
}
const {
  loadData,
  createFlow,
  flowLogs,
  addOptions,
  updateOptions,
  getOptions,
  nowIndex,
  CountdownTime,
  loginStatus,
  report
} = createFlowHooks()
const { startBrowser, addBrowser, closeBrowser } = browser()
const backCountdownTime = ref(0)
const version = ref<string>('')

interface CardIconStatus {
  createFlow: number
  flow: number
}

const createFlowList: any = computed(() => {
  // 根据[0,1,2] 的下标 获取flowLogs[0].children[1].children[2].children 列表
  if (!flowLogs[nowIndex.value.req[0]]?.children) {
    return []
  }
  return flowLogs[nowIndex.value.req[0]]?.children
})
const router = useRouter()
const record = () => {
  router.push('/puppeteer/record')
}
const stop = () => {
  loginStatus.value = false
}
const tap = async () => {
  const get: any = getOptions(nowIndex.value.script)
  console.log('tap', get)
  console.log('tap', get.children[get.children.length - 1].label)
}
watch(flowLogs, () => {
  nextTick(() => {
    if (loginStatus.value) {
      scrollToBottom()
    }
  })
})

const flowList: any = computed(() => {
  // 根据[0,1,2] 的下标 获取flowLogs[0].children[1].children[2].children 列表
  const firstLevel = flowLogs[nowIndex.value.flow[0]]?.children
  if (!firstLevel || !Array.isArray(firstLevel)) return []

  const secondLevel = firstLevel[nowIndex.value.flow[1]]?.children
  if (!secondLevel || !Array.isArray(secondLevel)) return []

  nextTick(() => {
    scrollToBottom()
  })
  return secondLevel
})
const scriptList: any = computed(() => {
  // 根据[0,1,2] 的下标 获取flowLogs[0].children[1].children[2].children 列表
  const firstLevel = flowLogs[nowIndex.value.script[0]]?.children
  if (!firstLevel || !Array.isArray(firstLevel)) return []

  const secondLevel = firstLevel[nowIndex.value.script[1]]?.children
  if (!secondLevel || !Array.isArray(secondLevel)) return []

  const thirdlyLevel = secondLevel[nowIndex.value.script[2]]?.children
  if (!thirdlyLevel || !Array.isArray(thirdlyLevel)) return []

  const fourthlyLevel = thirdlyLevel[nowIndex.value.script[3]]?.children
  if (!fourthlyLevel || !Array.isArray(fourthlyLevel)) return []

  nextTick(() => {
    scrollToBottom()
  })
  return fourthlyLevel
})
const cardIconStatus = ref<CardIconStatus>({
  createFlow: 3,
  flow: 3 // 创建流程
})

const visible = ref<boolean>(false)
const setVisible = (value: boolean): void => {
  // console.log('setVisible', value)
  visible.value = value
}

// watch(flowListLogs, () => {
//   nextTick(() => {
//     scrollToBottom()
//   })
// })
// watch(flowLogs, () => {
//   nextTick(() => {
//     scrollToBottom()
//   })
// })

// 滚动到底部方法
const scrollToBottom = () => {
  for (const Key in refs.value) {
    if (!refs.value[Key]) return
    refs.value[Key].scrollTop = refs.value[Key].scrollHeight
  }
}

const browser_id = ref<string>('')
const serial_number = ref<number>(0)
const start = async (filePath: string) => {
  const readFile = JSON.parse(await electron.readFile(filePath))
  // 创建流程
  const flow = await createFlow(readFile)
  // 新增浏览器
  browser_id.value = await browserFlow.addBrowser(flow.browser)
  // 启动浏览器
  const ws = await browserFlow.startBrowser(browser_id.value)
  // const ws = await browserFlow.startBrowser('kw30htp')
  // 更新脚本的wsUrl
  const flowWs = await scriptFlow.updateScriptAddWsUrl(flow, ws)
  // 启动脚本
  await scriptFlow.startScript(flowWs)
}
const browserFlow = {
  addBrowser: async (browserInfo: any) => {
    // 创建流程icon 状态
    cardIconStatus.value.createFlow = 0
    // 流程列表icon 状态
    cardIconStatus.value.flow = 1
    // 添加流程日志
    const addIndex: any = addOptions(nowIndex.value.flow, {
      label: '浏览器',
      value: 'browser',
      type: 'browser',
      status: 1
    }).indexes
    nowIndex.value.browser = addIndex
    const addIndexes: any = addOptions(addIndex, {
      label: '创建浏览器',
      value: browserInfo,
      type: 'AddBrowser',
      status: 1,
      percent: 50
    }).indexes

    const add = await addBrowser(browserInfo)
    if (add?.code !== 0) {
      updateOptions(addIndexes, {
        status: 2,
        percent: 100
      })
      throw new Error()
    }
    updateOptions(addIndexes, {
      status: 0,
      percent: 100
    })
    // cardIconStatus.value.flow = 0
    serial_number.value = add.data.serial_number
    return add.data.id
  },
  startBrowser: async (browser_id: any) => {
    const addIndexes: any = addOptions(nowIndex.value.browser, {
      label: '启动浏览器',
      value: browser_id,
      type: 'startBrowser',
      status: 1,
      percent: 50
    }).indexes
    const res = await startBrowser(browser_id)
    if (res.code !== 0) {
      updateOptions(addIndexes, {
        status: 2,
        percent: 100
      })
      throw new Error()
    }
    updateOptions(nowIndex.value.browser, {
      status: 0
    })
    updateOptions(addIndexes, {
      status: 0,
      percent: 100
    })
    return res.data.ws.puppeteer
  }
}

const scriptFlow = {
  // 更新脚本脚本 添加变量 ws地址  //并 更新创建script.json文件
  updateScriptAddWsUrl: async (flow: any, ws: string) => {
    let script = flow.script
    const filter = script.filter((item: any) => item.type === 'open')
    filter[0].variate.ws = ws
    // 创建json文件
    const jsonFilePath = `scriptFile/get/${flow.id}/`
    const jsonFileName = `script.json`
    // const filePath = jsonFilePath + jsonFileName

    await electron.createFile({
      savePath: jsonFilePath,
      fileName: jsonFileName,
      content: JSON.stringify(flow, null, 2),
      ensureDir: true
    })
    return {
      id: flow.id,
      script
    }
  },
  startScript: async (data: any) => {
    // const { id, script } = data
    const { script } = data
    const addIndexes: any = addOptions(nowIndex.value.flow, {
      label: '脚本列表',
      value: 'scriptList',
      type: 'scriptList',
      status: 1,
      children: []
    }).indexes
    nowIndex.value.scriptList = addIndexes
    await electron.puppeteer.start()
    electron.puppeteer.send({
      type: 'scriptLineUp',
      data: script
    })
  }
}

onMounted(async () => {
  version.value = await electron.getVersion()
})

onMounted(() => {
  electron.puppeteer.on(async (args: any) => {
    // console.log('收到消息了', args)
    // const { type, index, data } = args
    const { type, data } = args
    switch (type) {
      case 'scriptLineUp':
        nowIndex.value.script = [...nowIndex.value.scriptList, data.value]
        // logs.value.unshift(args)
        const get: any = getOptions(nowIndex.value.scriptList)
        const filter = get.children.filter((item: any) => item.value === data.value)
        if (filter.length === 0) {
          addOptions(nowIndex.value.scriptList, data)
        } else {
          updateOptions([...nowIndex.value.scriptList, data.value], data)
        }
        if (data.type) {
          const get: any = getOptions(nowIndex.value.script)
          await report({
            ...formData.value,
            commodity_id: flowLogs[flowLogs.length - 1].label,
            ads_id: serial_number.value,
            return_info: get.children[get.children.length - 1]?.label,
            status: get.children[get.children.length - 1]?.status === 0 ? '3' : '4'
          })

          // console.log('等待60秒执行')
          const time = 1
          countDown(60, async (res) => {
            CountdownTime.value += Math.trunc(time)

            if (res.state) {
              await closeBrowser(browser_id.value)
              CountdownTime.value = 0
              const res = await loadData(formData.value)
              if (res) {
                await start(res.path)
              }
            }
          })
        }
        break
      case 'lineUp':
        const get_1: any = getOptions(nowIndex.value.script)

        const filter_1 = get_1.children.filter((item: any) => item.value === data.value)
        if (filter_1.length === 0) {
          addOptions(nowIndex.value.script, data)
        } else {
          updateOptions([...nowIndex.value.script, data.value], data)
        }
        updateOptions(nowIndex.value.script, {
          percent: data.percent
        })
        break
      case 'countDown':
        backCountdownTime.value = data
        break
    }
  })
})
const formData: any = ref({})
const FormChange = async (data: any) => {
  // console.log('FormChange', data)
  formData.value = data

  const res = await loadData(data)
  if (res) {
    await start(res.path)
  }
}
</script>
<style scoped lang="scss">
:deep(.ant-card) {
  background: rgb(255, 255, 255, 0.5); /* 半透明背景 */
  border-radius: 10px;
}
div {
  font-size: 13px;
}

.slit-out-horizontal-dataV {
  animation: slit-out-horizontal 0.5s ease-in reverse both;
}
/* ----------------------------------------------
 * Generated by Animista on 2025-4-2 1:16:39
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slit-out-horizontal
 * ----------------------------------------
 */
@keyframes slit-out-horizontal-dataV {
  0% {
    transform: translateZ(0) rotateX(0);
    opacity: 1;
  }
  54% {
    transform: translateZ(-160px) rotateX(87deg);
    opacity: 1;
  }
  100% {
    transform: translateZ(-800px) rotateX(90deg);
    opacity: 0;
  }
}

</style>