import { message } from 'ant-design-vue'
import { countDown } from '@renderer/utils'
interface LoadData {
  key: string
  name: string
  pc_id: string
  type: string
}
export interface FlowLogs {
  label: string;
  value: string;
  status: number;
  type: string;
  percent?: number; // 添加缺失的逗号
  children?: FlowLogs[]; // 确保每个属性之间用逗号分隔
}
interface NowIndex {
  req: number[]
  flow: number[]
  browser: number[],
  scriptList: number[]
  script: number[]
}
export default function () {
  const flowLogs = reactive<FlowLogs[]>([
    // {
    //   label: '',
    //   value:'',
    //   type: 'file',
    //   status: 2,
    //   children: [],
    // }
  ])
  // 倒计时时间
  const CountdownTime = ref(0)
  // 当前任务的下标
  const nowIndex = ref<NowIndex>({
    req: [0],
    flow: [0],
    browser: [0],
    scriptList: [0],
    script: [0]
  })
  // 登录状态
  const loginStatus = ref(false)
  /**
   * 根据下标数组获取级联选择器数据
   * @param indexes 下标数组，例如 [0, 1, 0] 表示第一级的第 0 个，第二级的第 1 个，第三级的第 0 个
   * */
  const getOptions = (indexes: number[]) => {
    let currentData: FlowLogs[] = flowLogs // 从根数据开始
    if (indexes.length === 0) {
      // 如果下标数组为空，直接返回根数据
      return currentData
    }
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i]
      if (index < 0 || index >= currentData.length) {
        // 如果下标超出范围，返回 undefined
        return undefined
      }
      const currentNode = currentData[index]
      if (i === indexes.length - 1) {
        // 如果到达最后一级，返回当前节点
        return currentNode
      }
      if (!currentNode.children || currentNode.children.length === 0) {
        // 如果当前节点没有子节点，返回 undefined
        return undefined
      }
      // 更新当前数据为当前节点的子节点
      currentData = currentNode.children
    }
    return undefined // 如果下标数组为空，返回 undefined
  }
  /**
   * 根据下标数组和属性对象修改级联选择器数据
   * @param indexes 下标数组，例如 [0, 1, 0] 表示第一级的第 0 个，第二级的第 1 个，第三级的第 0 个
   * @param updates 属性对象，键为要修改的属性名，值为对应的修改值
   * @example updateOptions([0, 1, 0], { label: 'New Label', value: 'newValue' })
   * @returns 是否修改成功
   */
  const updateOptions = (indexes: number[], updates: Partial<FlowLogs>): boolean => {
    let currentData: FlowLogs[] = flowLogs // 从根数据开始
    for (let i = 0; i < indexes.length - 1; i++) {
      const index = indexes[i]
      if (index < 0 || index >= currentData.length) {
        // 如果下标超出范围，返回 false
        return false
      }
      const currentNode = currentData[index]
      if (!currentNode.children || currentNode.children.length === 0) {
        // 如果当前节点没有子节点，返回 false
        return false
      }
      // 更新当前数据为当前节点的子节点
      currentData = currentNode.children
    }
    const lastLevelIndex = indexes[indexes.length - 1]
    if (lastLevelIndex < 0 || lastLevelIndex >= currentData.length) {
      // 如果最后一级下标超出范围，返回 false
      return false
    }
    // 修改目标节点的属性值
    const targetNode = currentData[lastLevelIndex]
    for (const key in updates) {
      if (key in targetNode) {
        targetNode[key] = updates[key as keyof FlowLogs]
      }
    }
    return true
  }

  /**
   * 根据下标数组在级联选择器数据中添加新的节点，并返回操作结果和新节点的下标位置
   * @param indexes 下标数组，例如 [0, 1, 0] 表示第一级的第 0 个，第二级的第 1 个，第三级的第 0 个
   * @param newNode 要添加的新节点
   * @returns 返回一个对象，包含 code 和 indexes 属性
   */
  function addOptions(indexes: number[], newNode: FlowLogs): { code: number; indexes?: number[] } {
    let currentData: FlowLogs[] = flowLogs // 从根数据开始
    if (indexes.length === 0) {
      // 如果下标数组为空，直接在根节点添加新节点
      currentData.push(newNode)
      return { code: 0, indexes: [currentData.length - 1] } // 返回新节点的下标位置
    }
    let currentIndexes: number[] = [] // 用于记录当前层级的下标位置

    for (let i = 0; i < indexes.length - 1; i++) {
      const index = indexes[i]
      if (index < 0 || index >= currentData.length) {
        // 如果下标超出范围，返回失败
        return { code: 1 }
      }
      currentIndexes.push(index) // 记录当前层级的下标
      const currentNode = currentData[index]
      if (!currentNode.children) {
        // 如果当前节点没有子节点，创建一个新的 children 数组
        currentNode.children = []
      }
      // 更新当前数据为当前节点的子节点
      currentData = currentNode.children
    }

    const lastLevelIndex = indexes[indexes.length - 1]
    if (lastLevelIndex < 0 || lastLevelIndex >= currentData.length) {
      // 如果最后一级下标超出范围，返回失败
      return { code: 1 }
    }

    // 获取目标节点
    const targetNode = currentData[lastLevelIndex]
    if (!targetNode.children) {
      // 如果目标节点没有子节点，创建一个新的 children 数组
      targetNode.children = []
    }

    // 将新节点添加到目标节点的子节点中
    targetNode.children.push(newNode)

    // 返回新节点的下标位置
    return { code: 0, indexes: [...currentIndexes, lastLevelIndex, targetNode.children.length - 1] }
  }
  /** 下载img to 本地路径*/
  const downImg = async (url: string, path: string, fileName: string) => {
    const addIndexes: any = addOptions(nowIndex.value.req, {
      label: fileName,
      value: path,
      type: 'file,img',
      status: 1
    }).indexes
    const res = await electron.everyDownLoad({
      fileUrl: url,
      savePath: `scriptFile/get/${path}/photo`,
      fileName: fileName,
      override: true
    })
    updateOptions(addIndexes, {
      label: fileName,
      value: res.filePath,
      status: 0
    })
    return res.filePath
  }
  const downImgToFilePathToArr = async (data: any, path: string, index: number) => {
    const arr: any = []
    for (let i = 0; i < data.length; i++) {
      const res = await downImg(data[i], path, `photo${index}-${i}.jpg`)
      arr.push(res)
    }
    return arr
  }

  const loadData = async (param: LoadData) => {
    for (const key in nowIndex.value) {
      nowIndex.value[key] = nowIndex.value.req
    }
    const filter = flowLogs.filter((item: any) => item.label === '...')
    if (filter.length === 0) {
      addOptions([], {
        label: '...',
        value: '',
        type: 'request',
        status: 1
      })
    } else {
      updateOptions(nowIndex.value.req, {
        status: 1
      })
    }

    const res = await electron.request({
      url: 'http://vtadmin.xiaotwo.cn/task/commoditylist',
      method: 'post',
      data: {
        params: JSON.parse(JSON.stringify(param))
      }
    })

    // const res: any = {
    //   code: 1,
    //   List: JSON.parse(await electron.readFile('scriptFile/get/16063/response.json'))
    // }

    nowIndex.value.req = [flowLogs.length - 1]
    switch (res.code) {
      case 1:
        loginStatus.value = true
        updateOptions(nowIndex.value.req, {
          value: res.List.commodity_id,
          label: res.List.commodity_id,
          status: 0
        })
        message.success(res.msg)
        break
      case 10001:
        loginStatus.value = true
        message.error(res.msg)
        updateOptions(nowIndex.value.req, {
          status: 3
        })
        //写个倒计时1分钟 重复执行
        countDown(60, async (res: any) => {
          // console.log(res)
          updateOptions(nowIndex.value.req, {
            label: res.time + '...',
            status: 3
          })
          if (res.state) {
            updateOptions(nowIndex.value.req, {
              label: '...',
              status: 3
            })
            await loadData(param)
          }
        })
        return
      default:
        loginStatus.value = false
        message.error(res.msg)
        updateOptions(nowIndex.value.req, {
          status: 2
        })
        throw new Error('授权失败')
    }
    // 创建json文件  脚本文件
    const reqFilePath = `scriptFile/get/${res.List.commodity_id}/`
    const reqFileName = `response.json`
    const filePath = reqFilePath + reqFileName

    const addIndexes: any = addOptions(nowIndex.value.req, {
      label: reqFileName,
      value: reqFilePath,
      type: 'file,json',
      status: 1
    }).indexes

    await electron.createFile({
      savePath: reqFilePath,
      fileName: reqFileName,
      content: JSON.stringify(res.List, null, 2),
      ensureDir: true
    })

    updateOptions(addIndexes, {
      label: reqFileName,
      value: filePath,
      status: 0
    })
    return {
      path: filePath
    }
  }

  const createFlow = async (param: any) => {
    const data: any = {
      id: param.commodity_id,
      browser: {
        group_id: '0',
        name: 'electronTest',
        remark: `${param.good_account},${param.good_password},${param.good_email}`,
        // country:"us",
        // 指纹参数
        fingerprint_config: {
          automatic_timezone: '1', //1：基于IP自动生成对应的时区(默认)；0：指定时区。
          language_switch: '0', //基于IP国家设置语言：0：关闭；1：启用。
          page_language_switch: '1', //基于[语言]匹配界面语言，0：关闭；1：启用。
          screen_resolution:'none',  //屏幕分辨率，none: 使用电脑当前分辨率; random: 随机分辨率; 自定义需要下划线分隔，宽_高。
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
          proxy_type: param.browser.dl_type,
          proxy_host: param.browser.host_add,
          proxy_port: param.browser.host_port,
          proxy_user: param.browser.host_account,
          proxy_password: param.browser.host_password
        }
      },
      script: [
        {
          type: 'open',
          wait: 0,
          variate: {
            home_wait_time: param.home_wait_time,
            website: param.website
          }
        },
        {
          type: 'login',
          wait: 0,
          variate: {
            account: param.good_account,
            password: param.good_password,
            email: param.good_email,
            username: param.vt_name
          }
        },
        {
          type: 'updateUserInfo',
          wait: 5,
          variate: {
            avatar: await downImg(param.thumb, param.commodity_id, 'avatar.jpg'),
            'Town/City': param['Town/City']
          }
        }
      ]
    }
    if (param.Holiday_mode === 1) {
      data.script.push({
        type: 'HolidayMode',
        wait: 0,
        variate: {
          Holiday_mode: param.Holiday_mode
        }
      })
    }
    const commodity = param.commodity
    for (let i = 0; i < commodity.length; i++) {
      switch (i) {
        case 0:
          data.script.push({
            type: 'commodity',
            wait: 5,
            variate: {
              ...commodity[i],
              photo: await downImgToFilePathToArr(commodity[i].photo, param.commodity_id, i)
            }
          })
          break
        default:
          data.script.push({
            type: `commodity2`,
            wait: param.waiting_time,
            variate: {
              ...commodity[i],
              photo: await downImgToFilePathToArr(commodity[i].photo, param.commodity_id, i)
            }
          })
          break
      }
    }

    // 创建json文件  脚本文件
    const jsonFilePath = `scriptFile/get/${data.id}/`
    const jsonFileName = `script.json`
    const filePath = jsonFilePath + jsonFileName

    const addIndexes: any = addOptions(nowIndex.value.req, {
      label: jsonFileName,
      value: filePath,
      type: 'file,json',
      status: 1
    }).indexes

    await electron.createFile({
      savePath: jsonFilePath,
      fileName: jsonFileName,
      content: JSON.stringify(data, null, 2),
      ensureDir: true
    })
    nowIndex.value.flow = addIndexes
    updateOptions(addIndexes, {
      label: jsonFileName,
      value: filePath,
      type: 'file,json',
      status: 0
    })

    return data
  }
  const report = async(params:{commodity_id:string,pc_id:string,key:string,status:string,ads_id:string,type:string,return_info:string}) =>{
    // console.log('report/params',params)
    const res = await electron.request({
      url:'http://vtadmin.xiaotwo.cn/task/commoditystatus',
      method:'post',
      data:{
        params:params
      }
    })
    // console.log('report/res',res)
    return res
  }


  return {
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
  }
}
