<template>
  <div class="y">
    <a-flex wrap="wrap" gap="small">
<!--      <a-button type="primary" @click="addBrowser">add browser</a-button>-->
<!--      <startBrowserButton v-model:BrowserNum="BrowserNum" :getBrowserInfo="getBrowserInfo" />-->
<!--      <a-button type="primary" @click="startBrowser(BrowserNum)">start:{{ BrowserNum }}</a-button>-->
<!--      <a-button type="primary" @click="localVariate()">local variate</a-button>-->
<!--      <a-button type="primary" @click="connect()">connect</a-button>-->
<!--      <a-button type="primary" @click="savaScript()">sava script</a-button>-->
<!--      <a-button type="primary" @click="chooseScript()">choose script</a-button>-->
<!--      <a-button type="primary" @click="testGroupScript()">start test group</a-button>-->
      <a-button type="primary" @click="createBrowser">新增环境</a-button>
      <startBrowserButton v-model:BrowserNum="BrowserNum" :getBrowserInfo="getBrowserInfo" />
      <a-button type="primary" @click="openBrowser(BrowserNum)">启动环境:{{ BrowserNum }}</a-button>
      <a-button type="primary" @click="chooseVariate">选择变量</a-button>
      <a-button type="primary" @click="chooseScript">选择脚本</a-button>
      <a-button type="primary" @click="savaScript">保存脚本</a-button>
      <a-button type="primary" @click="startSubScript(scriptList)">执行子脚本</a-button>
      <a-button type="primary" @click="test()">调试启动</a-button>
      <a-button type="primary" @click="tap()">测试调试</a-button>

      <div class="x" style="width: 100%">
        <a-input v-model:value="searchValue" placeholder="请输入搜索内容" allowClear />
        <a-button type="primary" @click="getSelector(searchValue)">查询元素</a-button>
      </div>
    </a-flex>
    <div class="x">
      <div class="scriptCmd f-scroll-y">
        <a-list size="small" :split="true" :data-source="logs" >
          <template #renderItem="{ item }">
            <a-list-item>
              <a class="listButton" @click="listItemTap('add',item)">{{ item.data.tagName }} : {{ item.data.textContent }}</a>
              <a class="listButton" @click="getSelector(item.data)">查询元素</a>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div class="scriptCmd f-scroll-y">
        <a-list size="small" :split="true">
          <a-list-item v-for="(item,index) in scriptList" :key="index" >
            <div style="width: 100%">
              <a-row justify="start">
                <a-col :span="18" :order="1">
                  <a @click="listItemTap('edit',item,index)" style="overflow:hidden; ">
                    {{ item.data.remark }}
                  </a>
                </a-col>
                <a-col :span="3" :order="1">
                  <a @click="testScript(item)">
                    <CaretRightOutlined style="font-size: 25px" />
                  </a>
                </a-col>
                <a-col :span="3" :order="2">
                  <a-popconfirm
                    title="Are you sure？"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="scriptList.splice(index, 1)"
                  >
                    <a href="#">Delete</a>
                  </a-popconfirm>
                </a-col>

              </a-row>
            </div>

          </a-list-item>
        </a-list>
      </div>
    </div>
    <listClickModal :ref="(el)=>refs.listClick=el" @change="listClickModalChange" />
    <chooseScriptModal :ref="(el)=>refs.chooseScript=el" @change="chooseScriptChange" />
    <savaScriptModal :ref="(el)=>refs.savaScript=el" />
    <chooseVariateModal :ref="(el)=>refs.chooseVariate=el" @change="chooseVariateChange" />
  </div>
</template>

<script setup lang="ts">
import browser from '@renderer/views/puppeteer/hooks/browser'
import savaScriptModal from './components/savaScript/savaScript.vue'
import chooseScriptModal from './components/chooseScript/chooseScript.vue'
import startBrowserButton from './components/startBrowser-button.vue'
import { CaretRightOutlined } from '@ant-design/icons-vue'
import listClickModal from './components/list-click-modal/list-click-modal.vue'
import chooseVariateModal from './components/chooseVariate-Modal.vue'
const {
  startBrowser,
  addBrowser,
  // deleteCache,
  // BrowserApiStatus,
  getBrowserInfo
} = browser()
const refs:any = ref({
  listClick:null,
  chooseScript:null,
  savaScript:null,
  chooseVariate:null,
})
onMounted(async() => {
  // await openBrowser('kviw6ai')
})
const tap = () => {

  electron.puppeteer.send({
    type:'autoSelect',
    data:{
      "value": {
        "Category": "Women,Clothing,Dresses,Long dresses",
        "Brand": "Shein",
        "Size": "M / 38 / 10",
        "Condition": "Very good",
        "Colours": "Cream,Multi"
      },
      "valueType": "text"
    }
  })


}
const searchValue = ref("")
const BrowserNum:any = ref("kv6sva4")
const scriptList = ref<any[]>([])
const logs = ref<any[]>([
  // {
  //   code: 0,
  //   type: 'onPage',
  //   data: {
  //     tagName: 'A',
  //     attributes: [
  //       // 'id="search_text"',
  //       'placeholder="Search for items"',
  //       'data-testid="search-text--input"',
  //       'class="web_ui__InputBar__value"',
  //       'autocomplete="off"',
  //       'maxlength="5000"',
  //       'aria-labelledby="search-item"',
  //       'name="search_text"',
  //       'value=""'
  //     ],
  //     id: '',
  //     className: 'nav-links',
  //     textContent: 'Men',
  //     clientX: 281,
  //     clientY: 73
  //   }
  // }
])
const variateData: any = ref({})

const chooseVariate =async ()=>{
  refs.value.chooseVariate.open()

}
const testScript = async (item:any) => {
  console.log('testScript------1', item)
  electron.puppeteer.send({
    type: 'lineUp',
    data: [
      JSON.parse(JSON.stringify(item))
    ]
  })
}
const savaScript = async () => {
  refs.value.savaScript.open(scriptList.value)
}
const chooseScript = () => {
  refs.value.chooseScript.open()
}
const listClickModalChange =async (data: any) => {
  switch (data.type){
    case 'add':
      scriptList.value.push(data.data)
      break
    case 'edit':
      scriptList.value.splice(data.index, 1, data.data)
      break
  }

  // 保持脚本到本地
  //  await electron.createFile({
  //   path: 'script.json',
  //   content: JSON.stringify(scriptList.value)
  // })
}

const listItemTap = (type:string,item: any,index?:number) => {
  refs.value.listClick.open(type,item,variateData.value,index)
}
const chooseScriptChange = (data: any) => {
  scriptList.value = data
}
const chooseVariateChange = (data: any) => {
  variateData.value = data
  electron.puppeteer.send({
    type: 'getVariate',
    data: JSON.parse(JSON.stringify(variateData.value))
  })
}
const startSubScript =async (data:any)=>{
  const start = await electron.puppeteer.start()
  console.log('start', start)
  if(start.code === 0){
    setTimeout(()=>{
      electron.puppeteer.send({
        type: 'getVariate',
        data: JSON.parse(JSON.stringify(variateData.value))
      })
    },1000)
    setTimeout(()=>{
      electron.puppeteer.send({
        type: 'lineUp',
        data: JSON.parse(JSON.stringify(data))
      })
    },2000)
  }
}
const createBrowser = async () => {

  const res: any = await electron.readFile('scriptFile/script/script.json')
  const toObj = JSON.parse(res)
  await addBrowser(toObj.browser)
}
const openBrowser = async (data:string) => {
  const res = await startBrowser(data)
  // console.log('openBrowser------------2', res.data.ws.puppeteer)
  const file:any = await electron.readFile('scriptFile/script/script.json')
  let toObj = JSON.parse(file)
  const filter = toObj.script.filter((item: any) => item.type==='open')
  filter[0].variate.ws = res.data.ws.puppeteer
  await electron.createFile({
    savePath: 'scriptFile/script',
    fileName: 'script.json',
    content: JSON.stringify(toObj, null, 2),
    ensureDir: true
  })
  return
}
const getSelector = async (data: any) => {

   const res  = await electron.puppeteer.handle({
    type: 'getSelector',
    data: {
      value: JSON.parse(JSON.stringify(data))
    }
  })
  console.log('getSelector', res.data)

}
const test =async ()=>{

  // kv6sva4
  const res = await startBrowser('kv6sva4')
  await electron.puppeteer.start()
  await new Promise((resolve)=>setTimeout(()=>resolve(1),1000))
  electron.puppeteer.send({
    type: 'lineUp',
    data: [
      { "type": "connect",
        "data": {
        "value": res.data.ws.puppeteer,
          "valueType": "text",
          "remark": "连接浏览器"
      }
      },
      {
        "type": "newPageGoto",
        "data": {
          "value": 'https://www.vinted.es/items/new',
          "valueType": "text",
          "recordScript": true,
          "remark": ""
        }
      }
    ]
  })
}

onMounted(() => {
  electron.puppeteer.on((args: any) => {
    console.log('收到消息了', args)
    if (args.type === 'onPage') {
      logs.value.unshift(args)
    }
  })
})

</script>

<style scoped lang="scss">
.scriptCmd {
  width: 50%;
  height: 300px;
  background-color: #535353;
  color: #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 10px;
  &-txt {
    line-height: 15px;
    font-size: 12px;
  }
}
</style>
