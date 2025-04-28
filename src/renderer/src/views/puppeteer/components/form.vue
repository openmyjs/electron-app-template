<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 2 }"
    :wrapper-col="{ span: 22 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item label="秘钥" name="key" :rules="[{ required: true, message: '请输入启动秘钥!' }]">
      <a-input v-model:value="formState.key" allowClear placeholder="启动秘钥" @change="inputChange" />
    </a-form-item>

    <a-form-item label="商品名" name="name" :rules="[{ required: false, message: '请输入商品名称!' }]">
      <a-input v-model:value="formState.name" allowClear placeholder="商品名(可选)" @change="inputChange" />
    </a-form-item>
    <a-form-item label="类型" name="type" :rules="[{ required: false, message: '请输入类型!' }]">
      <a-input v-model:value="formState.type" allowClear placeholder="类型(可选)" @change="inputChange" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 18, span: 6 }">
      <a-button type="primary" html-type="submit">启动</a-button>
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import { message } from 'ant-design-vue'
import browser from '@renderer/views/puppeteer/hooks/browser'
import { ClientJS } from 'clientjs'
import createFlowHooks from '@renderer/views/puppeteer/dataV/hooks/createFlow'
// 创建 ClientJS 实例
const client = new ClientJS()
const { loadData } = createFlowHooks()
onMounted(() => {
  loadFingerprint()
})
// 加载指纹的方法
const loadFingerprint = () => {
  const fp = client.getFingerprint() // 获取指纹
  formState.pc_id = JSON.stringify(fp)
  // console.log('生成的指纹:', fp)
}
const {
  startBrowser,
  addBrowser
  // deleteCache,
  // BrowserApiStatus,
  // getStartStatus
} = browser()
const emit = defineEmits(['change'])
// const props = defineProps({
//   formState:{
//     required:true,
//     type:Object
//   }
// })
interface FormState {
  key: string //工作室唯一秘钥
  name: string //商品名
  pc_id: string //设备唯一识别码
  type: string //商品类型
}
//
let formState = reactive<FormState>({
  key: 'z9b8t6szpr3w',
  name: '',
  pc_id: '',
  type: '1'
})
const inputChange = () => {
  nextTick(()=>{
    let obj = {}
    for (const Key in formState) {
      obj[Key] = formState[Key]
    }
    localStorage.setItem('FormStateData', JSON.stringify(obj))
  })
}
onMounted(async() => {

  // localStorage.setItem('FormStateData', '{"code":0}')
  const get:any =  localStorage.getItem('FormStateData')
  if(get){
    const jsonGet = JSON.parse(get)
    for (const sKey in formState) {
      formState[sKey] = jsonGet[sKey]
    }
  }
})


const getData = async (param: { key: string; name: string; pc_id: string; type: string }) => {
  const res = await electron.request({
    url: 'http://vtadmin.xiaotwo.cn/task/commoditylist',
    method: 'post',
    data: {
      params: param
    }
  })
  // console.log('getTask', res)
  if (res.code !== 1) {
    message.error('授权失败')
    setTimeout(() => {
      message.error(res.msg)
    }, 500)
    // 抛出错误
    throw new Error('授权失败')
  }
  message.success('授权成功')
  message.info('开始下载静态资源')
  const data = {
    browser: {
      group_id: '0',
      name: 'electronTest',
      remark:`${res.List.good_account},${res.List.good_password},${res.List.good_email}`,
      // country:"us",
      // 指纹参数
      fingerprint_config: {
        automatic_timezone: '1', //1：基于IP自动生成对应的时区(默认)；0：指定时区。
        language_switch: '0', //基于IP国家设置语言：0：关闭；1：启用。
        page_language_switch: '1', //基于[语言]匹配界面语言，0：关闭；1：启用。
        language: ['en'],
        flash: 'block', //
        fonts: ['all'],
        webrtc: 'disabled',
        random_ua: {
          // "ua_browser":["chrome","firefox"],
          // "ua_version":["80"],
          ua_system_version: ['Windows 10', 'Windows 11']
        }
      },
      // 环境代理参数
      user_proxy_config: {
        // "proxy_soft":"other", //no_proxy/other
        // "proxy_type":"socks5",
        // "proxy_host":"195.123.212.28",
        // "proxy_port":"59715",
        // "proxy_user":"18060096519",
        // "proxy_password":"hvk2cjfDsi"
        proxy_soft: 'other',
        proxy_type: res.List.browser.dl_type,
        proxy_host: res.List.browser.host_add,
        proxy_port: res.List.browser.host_port,
        proxy_user: res.List.browser.host_account,
        proxy_password: res.List.browser.host_password
      }
    },
    script: [
      {
        type: 'open',
        wait: 0,
        variate: {
          website: res.List.website
        }
      },
      {
        type: 'login',
        wait: 0,
        variate: {
          account: res.List.good_account,
          password: res.List.good_password,
          email: res.List.good_email,
          username: res.List.vt_name
        }
      },
      {
        type: 'updateUserInfo',
        wait: 5,
        variate: {
          avatar: await downImg(res.List.thumb, 'avatar.jpg'),
          "Town/City": res.List["Town/City"]
        }
      }
    ]
  }
  const commodity = res.List.commodity
  for (let i = 0; i < commodity.length; i++) {
    switch (i){
      case 0 :
        data.script.push({
          type: 'commodity',
          wait: 5,
          variate: {
            ...commodity[i],
            photo: await downImgToFilePathToArr(commodity[i].photo, i)
          }
        })
        break
      default :
        data.script.push({
          type: 'commodity2',
          wait: res.List.waiting_time,
          variate: {
            ...commodity[i],
            photo: await downImgToFilePathToArr(commodity[i].photo, i)
          }
        })
        break
    }
  }
  return JSON.parse(JSON.stringify(data))
}

const downImgToFilePathToArr = async (data: any, index: number) => {
  const arr: any = []
  for (let i = 0; i < data.length; i++) {
    const res = await downImg(data[i], `${index}photo${i}.jpg`)
    arr.push(res)
  }
  return arr
}

/** 下载img to 本地路径*/
const downImg = async (url: string, fileName: string) => {
  const res = await electron.everyDownLoad({
    fileUrl: url,
    savePath: './scriptFile/photo',
    fileName: fileName,
    override: true
  })

  return res.filePath
}
const router = useRouter()
const onFinish = async (values: any) => {
  // console.log('Success:', values);
  const filePath =  await loadData({...formState})
  if(filePath){
    await router.push({
      path: '/puppeteer/dataV',
      query: {
        data: JSON.stringify({
          type:'生产',
          filePath: filePath?.path,
          formData:{
            ...formState
          }
        })
      }
    })
  }
}

const createBrowser = async (data: any) => {
  console.log('data-------4444444', data)
  const add = await addBrowser(data)
  console.log('add', add)
  if (add.code !== 0) {
    message.error('浏览器创建失败')
    throw new Error()
  }
  message.success('浏览器创建成功')

  const start = await startBrowser(add.data.id)
  if (start.code !== 0) {
    message.error('浏览器启动失败')
    throw new Error()
  }
  message.success('浏览器启动成功')

  return start.data.ws.puppeteer
}
const onFinishFailed = async (_errorInfo: any) => {}
</script>
<style scoped lang="scss"></style>
