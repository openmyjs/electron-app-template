<template>
  <div style="padding: 10px">
    <a-row :gutter="[10, 10]">
      <a-col :span="6">
        <a-card title="请求任务" :bordered="false"> </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="创建流程" :bordered="false">
          <template #extra>
<!--            <CheckCircleOutlined v-if="cardIconStatus.createFlow === 0" style="color: #23ff1e" />-->
<!--            <a-spin size="small" v-if="cardIconStatus.createFlow === 1" />-->
<!--            <CloseCircleOutlined v-if="cardIconStatus.createFlow === 2" style="color: #ff0000" />-->
          </template>
          <div class="f-scroll-y f-scroll-set" style="width: 100%; height: 300px" :ref="(el) => (refs.createFlow = el)">
            <div
              class="f-button"
              style="width: 100%"
              v-if="flowLogs.length !== 0"
              v-for="(item, index) in flowLogs"
              :key="index"
              @click="setVisible(true)"
            >
              <AreaChartOutlined v-if="item.type === 'file,img'" style="color: #3178c6" />
              <FontSizeOutlined v-if="item.type === 'file,json'" style="color: #3178c6" />
              {{ item.label }}
            </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="流程列表" :bordered="false">
          <template #extra>
            <CheckCircleOutlined v-if="cardIconStatus.flow === 0" style="color: #23ff1e" />
            <a-spin size="small" v-if="cardIconStatus.flow === 1" />
            <CloseCircleOutlined v-if="cardIconStatus.flow === 2" style="color: #ff0000" />
          </template>
          <div class="f-scroll-y f-scroll-set y" style="width: 100%; height: 300px" :ref="(el) => (refs.flow = el)">
            <div v-if="flowListLogs.length !== 0" class="f-wh100">
              <titleProgress :list="flowListLogs" />
            </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="事件列表" :bordered="false">
          <div class="f-scroll-y f-scroll-set y" style="width: 100%; height: 300px" :ref="(el) => (refs.incident = el)">
            <div
              v-if="scriptLogs.length !== 0"
              v-for="(item,index) in scriptLogs" :key="index"
            >
<!--              <div v-if="index===0">{{item}}</div>-->
              <div
                class="f-button"
                style="width: 100%"
                :style="{color:item.status === 0 ? '#23ff1e' : item.status === 1 ? '#0947b8' : '#ff0000'}"
              >
                <CheckCircleOutlined v-if="item.status === 0" style="color:#23ff1e " />
                <RedoOutlined spin v-if="item.status === 1" style="color:#0947b8 " />
                <CloseCircleOutlined v-if="item.status === 2" style="color:#ff0000 " />
                {{item.title}}
              </div>
             </div>
            <div v-else class="f-wh100 center">
              <a-empty />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-button @click="tap">test</a-button>
    <a-button @click="start('scriptFile/get/16108/response.json')">start</a-button>
  </div>
</template>

<script setup lang="ts">
import { AreaChartOutlined, CheckCircleOutlined, CloseCircleOutlined, FontSizeOutlined ,RedoOutlined} from '@ant-design/icons-vue'

import titleProgress from './components/titleProgress.vue'
import createFlowHooks from './hooks/createFlow'
import browser from '@renderer/views/puppeteer/hooks/browser'
const refs = ref<any>({
  createFlow: null,
  flow: null,
  incident:null
})
const { loadData, createFlow, flowLogs } = createFlowHooks()
const { startBrowser, addBrowser ,closeBrowser} = browser()
const route = useRoute()
interface QueryData {
  type: string
  formData: {
    key: string
    name: string
    pc_id: string
    type: string
  }
  filePath: string
}
interface Logs {
  type: string
  title: string
  status:1
  options: {
    type: string
    title: string
    status: number
    components?: any
  }[]
}
interface CardIconStatus{
  createFlow:number
  flow:number
}
const cardIconStatus = ref<CardIconStatus>({
  createFlow:3,
  flow:3, // 创建流程
})


const logs = ref<Logs[]>([

])
const scriptLogs:any = ref([])
const fileLogs = computed(() => {
  return logs.value.filter((item: any) => {
    return item.type === 'file,img' || item.type==='file,json'
  })
})
const flowListLogs = computed(() => {
  return logs.value.filter((item: any) => {
    return item.type === 'flow,browser' || item.type === 'flow,script'
  })
})
const visible = ref<boolean>(false)
const setVisible = (value: boolean): void => {
  console.log('setVisible', value)
  visible.value = value
}
const queryData = ref<QueryData>({
  type: '测试',  //环境
  formData: {
    key: 'z9b8t6szpr3w',
    name: '',
    pc_id: '4101513974',
    type: '1'
  },
  filePath: ''
})


// watch(flowListLogs, () => {
//   nextTick(() => {
//     scrollToBottom()
//   })
// })
// watch(scriptLogs, () => {
//   nextTick(() => {
//     scrollToBottom()
//   })
// })
// 滚动到底部方法
const scrollToBottom = () => {
  for (const Key in refs.value) {
    refs.value[Key].scrollTop = refs.value[Key].scrollHeight
  }
}

const tap = async () => {
  console.log('tap', queryData.value.formData)
  const res = await loadData(queryData.value.formData)
  console.log('res', res)
}
const browser_id = ref<string>('')
const start = async (filePath:string) => {
  logs.value = []
  scriptLogs.value = []
  // const filePath = queryData.value.filePath
  // const filePath = `scriptFile/get/16057/response.json`
  const readFile = JSON.parse(await electron.readFile(filePath))
  const flow = await createFlow(readFile)

  // browser_id.value = await browserFlow.addBrowser(flow.browser)
  // const ws = await browserFlow.startBrowser(browser_id.value)
  // const flowWs = await scriptFlow.updateScriptAddWsUrl(flow,ws)
  // await scriptFlow.startScript(flowWs)
}
const browserFlow = {
  error: async (sign: string[]) => {
    cardIconStatus.value.flow = 2
    const filter:any = logs.value.filter((item:any)=>item.type===sign[0])
    filter[0].status = 2
    const filter_0 = filter[0].options
    const filter2:any = filter_0.filter((item:any)=>item.type===sign[1])
    filter2[0].status = 2
    filter2[0].components.percent = 100
    filter2[0].components.status = 'exception'
    throw new Error()
  },
  next: async (sign: string[],endSign:boolean=false) => {
    const filter:any = logs.value.filter((item:any)=>item.type==='flow,browser')
    const filter_0 = filter[0].options
    const filter2:any = filter_0.filter((item:any)=>item.type===sign[0])
    filter2[0].status = 1
    filter2[0].components.percent = 100
    filter2[0].components.status = 'success'
    //结束完成标识
    if(endSign){
      filter[0].status = 0
    }
    await nextTick(() => {
      scrollToBottom()
    })
  },
   addBrowser:async (browserInfo:any) => {
    // 创建流程icon 状态
    cardIconStatus.value.createFlow = 0
    // 流程列表icon 状态
    cardIconStatus.value.flow = 1
    // 添加流程日志
    logs.value.push({
      type: 'browser',
      title: '浏览器',
      status: 1,
      options:[
        {
          type: 'addBrowser',
          title: '创建浏览器',
          status: 1,
        },
      ]
    })
    const add = await addBrowser(browserInfo)
     if(add.code !==0){
       await browserFlow.error(['flow,browser','addBrowser'])
     }
     await browserFlow.next(['addBrowser'])
     // cardIconStatus.value.flow = 0
     return add.data.id
  },
  startBrowser: async (browser_id: any) => {
    const filter:any = logs.value.filter((item:any)=>item.type==='flow,browser')
    filter[0].options.push({
        type: 'startBrowser',
        title: '启动浏览器',
        status: 1,
        components:{
          type:"progress",
          num: 1,
          percent: 0,
          status: 'active'
        }
    })
    const res = await startBrowser(browser_id)
    if(res.code !==0){
      await browserFlow.error(['browser','startBrowser'])
      throw new Error()
    }
    await browserFlow.next(['startBrowser'],true)
    return res.data.ws.puppeteer
  },

}

const scriptFlow = {
  // 更新脚本脚本 添加变量 ws地址  //并 更新创建script.json文件
  updateScriptAddWsUrl: async (flow: any,ws: string) => {
    let script =flow.script
    const filter = script.filter((item: any) => item.type==='open')
    filter[0].variate.ws = ws
    // 创建json文件
    const jsonFilePath = `scriptFile/get/${flow.id}/`
    const jsonFileName = `script.json`
    await electron.createFile({
      savePath: jsonFilePath,
      fileName: jsonFileName,
      content: JSON.stringify(flow, null, 2),
      ensureDir: true
    })
    return {
      id: flow.id,
      script,
    }
  },
  startScript:async(data:any)=>{
    const { id,script} = data
    logs.value.push({
      type: 'flow,script',
      title: '脚本列表',
      status: 1,
      options:[]
    })
    await electron.puppeteer.start()
    electron.puppeteer.send({
      type: 'scriptLineUp',
      data: script
    })
  }
}


onMounted(() => {
  // console.log('route', route.query)
  const {type,filePath,formData } =  queryData.value
  switch (type){
    case '生产':
      queryData.value = JSON.parse(route.query.data as string)
      start(filePath)
      break
  }
})
onMounted(() => {
  electron.puppeteer.on(async (args: any) => {
    // console.log('收到消息了', args)
    const { type, data } = args
    switch (type) {
      case "scriptLineUp" :
        // logs.value.unshift(args)
        const filter = logs.value.filter((item: any) => item.type === 'flow,script')
        const filter_0 = filter[0].options.filter((item: any) => item.type === data.type)
        if (filter_0.length === 0) {
          filter[0].options.push(args.data)

        } else {
          for (const key in filter_0[0]) {
            filter_0[0][key] = args.data[key]
          }
        }
        if(data.status===0){
          scriptLogs.value = []
        }
        if (data.end) {
          await closeBrowser(browser_id.value)
          // console.log('等待60秒执行')
          await new Promise((resolve) => setTimeout(resolve, 60000))
          const res = await loadData(queryData.value.formData)
          if(res){
            logs.value = []
            scriptLogs.value = []
            await start(res.path)
          }

        }
        break
      case "lineUp" :
        const lineUpFilter: any = scriptLogs.value.filter((item: any) => item.index === data.index)
        if (lineUpFilter.length === 0) {
          scriptLogs.value.push(data)
        } else {
          for (const key in lineUpFilter[0]) {
            lineUpFilter[0][key] = data[key]
          }
        }

        //
        break
    }

  })
})
</script>
