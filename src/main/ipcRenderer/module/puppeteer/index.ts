import { type BrowserWindow, ipcMain } from 'electron'
import puppeteer from 'puppeteer-core'
import _ from 'lodash'
import fsExtra from '../fsExtra'
import {
  AutoSelect,
  Click,
  Connect,
  Input,
  MouseClick,
  NewPageGoto,
  Returns,
  UpLoadFile,
  Radio,
  Select,
  GetElementData
} from './index.type'
import { uuid } from '@openmyjs/utils';
let winEvent: any = null
let ps: puppeteerScript | null = null
let status: boolean = false
export default async function (win: BrowserWindow): Promise<{ code: number; type: string; msg: string }> {
  if (status)
    return {
      code: 0,
      type: 'puppeteer',
      msg: '重复启动'
    }
  status = true
  // 统一发送消息到renderer进程方法
  winEvent = (data: any) => {
    win.webContents.send('puppeteer', data)
    return data
  }
  // 创建puppeteer对象
  ps = new puppeteerScript()
  // 监听ipcRenderer消息
  ipcMain.on('puppeteer', async (_Event, args: any) => {
    // console.log('main/puppeteer/on,收到消息', args)
    const { type, data } = args
    if (ps && type in ps) {
      ps[type](data)
    } else {
      winEvent({
        code: 1,
        type: 'puppeteer',
        msg: `未找到方法[${type}]`
      })
    }
  })
  ipcMain.on('puppeteerOnce', async (_Event, args: { channel: string; data: any }) => {
    // console.log('main/puppeteer/once,收到消息', args)
    const { channel, data: data2 } = args
    const { type, data } = data2
    if (ps && type in ps) {
      win.webContents.send(channel, await ps[type](data))
    } else {
      win.webContents.send(channel, {
        code: 1,
        type: 'puppeteer',
        msg: `未找到方法[${type}]`
      })
    }
  })
  return {
    code: 0,
    type: 'puppeteer',
    msg: 'success'
  }
}

/**
 * puppeteer脚本封装
 *
 * */
class puppeteerScript {
  // 浏览器连接类型
  connectType: any = null
  // 浏览器对象
  browser: any = null
  // 页面对象
  page: any[] = []
  // 当前页签索引
  lastTab: number = 0
  // 变量
  variateData: any = {}

  async getVariate(variate: any) {
    this.variateData = variate
    return {
      code: 0,
      status: true
    }
  }
  /** 使用ws连接browser
   * @param data.value ws地址
   * @param data.valueType data.value的类型 text||variate
   * @returns {Returns}
   * */
  async connect(data: Connect): Promise<Returns> {
    // console.log('connect', data)
    const { value, valueType } = data

    let typeValue: any = value
    if (Array.isArray(value)) {
      typeValue = valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }

    try {
      this.browser = await puppeteer.connect({
        // 浏览器WebSocket端点，需要替换为实际的WebSocket端点
        browserWSEndpoint: typeValue,
        // 默认视图窗口设置，可以设置为 null ++++++以保持原始窗口大小
        defaultViewport: null
      })
      // 获取所有标签页
      const pages = await this.browser.pages()
      for (const page of pages) {
        this.page.push(page)
      }
      this.connectType = 'ws'
      // console.log('连接成功')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        code: 0,
        status: true
      }
    } catch (error: any) {
      // console.log('连接失败---1', error)
      return {
        code: 1,
        status: false,
        error: error
      }
    }
  }
  /**
   * 新建页面并导航到目标网页
   * */
  async newPageGoto(data: NewPageGoto): Promise<Returns> {
    // console.log('进入newPageGoto')
    const { value, recordScript = false, valueType } = data
    let typeValue = value
    if (Array.isArray(value)) {
      typeValue = valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }
    try {
      // 创建新页面
      const pages = await this.browser.newPage()
      // await pages.setViewport({ width: 1600, height: 1080 })

      // 设置窗口大小为屏幕分辨率
      // const { width, height } = await pages.evaluate(() => {
      //   return {
      //     width: window.screen.width,
      //     height: window.screen.height
      //   };
      // });
      // await pages.setViewport({ width, height });

      // 暴露一个函数给页面上下文，用于处理点击事件
      await pages.exposeFunction('onPageClick', async (eventInfo: any) => {
        // console.log('Page clicked:', eventInfo)
        winEvent({
          code: 0,
          type: 'onPage',
          data: eventInfo
        })
      })

      //是否开启记录点击事件
      if (recordScript) {
        // 在页面加载时注入自定义的 JavaScript 代码
        await pages.evaluateOnNewDocument(() => {
          // 添加一个全局的点击事件监听器
          document.addEventListener('click', (event: any) => {
            // 调用暴露的函数，将事件信息发送到 Node.js 环境
            // console.log('Page clicked:', event.target)
            const attributes = JSON.parse(
              JSON.stringify(
                Array.from(event.target.attributes).map((attr: any) => {
                  return `${attr.name}="${attr.value}"`
                })
              )
            )
            const selector = event.target.tagName.toLowerCase() + attributes.map((attr: any) => `[${attr}]`).join('')
            const eventInfo = {
              tagName: event.target.tagName,
              attributes: attributes,
              id: event.target.id,
              className: event.target.className,
              textContent: event.target.textContent,
              clientX: event.clientX,
              clientY: event.clientY,
              selector: selector
            }
            if (window.onPageClick) {
              window.onPageClick(eventInfo)
            }
          })
        })
      }

      //
      try {
        await pages.goto(typeValue, { waitUntil: 'networkidle2', timeout: this.variateData.home_wait_time * 1000 })
      } catch (err) {
        // console.log('newPageGoto/goto 报错',err)
        return {
          code: 1,
          status: false,
          error: err
        }
      }
      // 监听页面的 console 事件
      // pages.on('console', (msg:any) => {
      //   console.log('页面控制台输出:', msg.text());
      // });
      // pages.on('pageerror', (error:any) => {
      //   console.log('页面错误:', error);
      // })
      // try {
      //   await pages.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
      // } catch (error) {
      //   return {
      //     code: 1,
      //     status: false,
      //     error
      //   }
      // }

      this.page.push(pages)
      this.lastTab = this.page.length - 1
      return {
        code: 0,
        status: true
      }
    } catch (error) {
      return {
        code: 1,
        status: false,
        error
      }
    }
  }
  /**
   * 获取元素数量
   * @param data 元素选择器
   * @param data.value selector
   * @param tab 页签索引
   * */
  async getSelector(
    data: { value: string },
    tab = this.lastTab
  ): Promise<{ code: number; status: boolean; data: any }> {
    const { value } = data
    const res = await this.page[tab].$$(value)
    const get = await getElementData(this.page[tab], value)
    // console.log('getSelector', res)
    return {
      code: 0,
      status: true,
      data: {
        number: res.length,
        elementData: get
      }
    }
  }
  /**
   * 点击元素
   * @param data 元素选择器
   * @param data.selector 延迟时间（以毫秒为单位）
   * @param tab 页签索引
   * */
  async click(data: Click, tab: number = this.lastTab): Promise<Returns> {
    const { selector, wait, goOn = false, index = 0 } = data
    // console.log('click', data)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // 获取所有匹配的元素
    const elements = await this.page[tab].$$(selector)
    // console.log('elements', elements)
    if (elements.length === 0) {
      try {
        // console.log('元素不存在,开始等待元素出现')
        await this.page[tab].waitForSelector(selector, { timeout: 10000 })
      } catch (error) {
        if (goOn) {
          return {
            code: 0,
            status: false,
            error: '等待元素超时'
          }
        }

        return {
          code: 1,
          status: false,
          error: '等待元素超时'
        }
      }
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const elements2 = await this.page[tab].$$(selector)
      await elements2[index].click()
    } catch (error) {
      return {
        code: 1,
        status: false,
        error: '点击元素报错'
      }
    }

    if (wait) {
      try {
        await this.page[tab].waitForNavigation({ waitUntil: 'networkidle2' , timeout: 60000})
      } catch (error) {
        // console.log('等待元素报错', error)
        return {
          code: 1,
          status: false,
          error: '等待页面超时'
        }
      }
    }
    return {
      code: 0,
      status: true
    }
  }
  /**
   * 鼠标点击
   * @param data 鼠标位置
   * @param data.x 鼠标点击位置的x坐标
   * @param data.y 鼠标点击位置的y坐标
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.mouse.click
   * @example mouseClick({ x: 100, y: 200}, 0)
   * */
  async mouseClick(data: MouseClick, tab: number = this.lastTab): Promise<Returns> {
    // console.log('mouseClick', data)
    const { x, y, wait = false } = data
    try {
      await this.page[tab].mouse.click(x, y)
      if (wait) {
        await this.page[tab].waitForNavigation({ waitUntil: 'networkidle2' })
      }
      return {
        code: 0,
        status: true
      }
    } catch (error) {
      return {
        code: 1,
        status: false,
        error: error
      }
    }
  }

  /**
   * 输入文本
   * @param data
   * @param data.selector 元素选择器
   * @param data.value 输入的值
   * @param data.timeOut 延时执行时间（以毫秒为单位）
   * @param data.delay 输入延迟时间（以毫秒为单位）
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.page.type
   *
   * */
  async input(data: Input, tab: number = this.lastTab): Promise<Returns> {
    // console.log('input', data)
    const { selector, value, delay = 800, valueType } = data

    try {
      const elements = await this.page[tab].$$(selector)
      if (elements.length === 0) {
        await this.page[tab].waitForSelector(selector, { timeout: 10000 })
      }
    } catch (error) {
      // console.log('等待的元素没有出现', error)
      return {
        code: 1,
        status: false,
        error: error
      }
    }

    let typeValue = value
    if (Array.isArray(value)) {
      typeValue = valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      // 清空输入框
      // await this.page[tab].$eval(selector, (el: any) => (el.value = ''))
      const input = await this.page[tab].$(selector);
      await input.click({ clickCount: 3 }); // 三击选中全部内容
      await this.page[tab].keyboard.press('Backspace'); // 按退格键清空内容

      await new Promise((resolve) => setTimeout(resolve, 1000))
      // 输入文本
      await this.page[tab].type(selector, typeValue, { delay })
      return {
        code: 0,
        status: true
      }
    } catch (error) {
      console.log('输入文本报错', error)
      return {
        code: 1,
        status: false,
      }
    }
  }
  /**
   * 上传文件
   * @param data
   * @param data.selector 元素选择器
   * @param data.value 文件路径
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.page.uploadfile
   * */
  async upLoadFile(data: UpLoadFile, tab: number = this.lastTab): Promise<Returns> {
    // console.log('upLoadFile', data)
    const { selector, value } = data

    let typeValue = value
    if (Array.isArray(value)) {
      typeValue = data.valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }
    try {
      const inputFile = await this.page[tab].$(selector)
      if (Array.isArray(typeValue)) {
        // // 上传文件
        await inputFile.uploadFile(...typeValue) // 替换为实际文件路径
      } else {
        await inputFile.uploadFile(typeValue) // 替换为实际文件路径
      }
    } catch (error) {
      console.log('上传文件报错', error)
      return {
        code: 1,
        status: false,
      }
    }

    return {
      code: 0,
      status: true
    }
  }
  /** 选择器
   * @param data
   * @param data.selector.title 标题选择器
   * @param data.selector.option 选项选择器
   * @param data.value 选项值
   * @param tab 页签索引
   * */
  async select(data: Select, tab: number = this.lastTab): Promise<Returns> {
    const { selector, value } = data

    try {
      await this.page[tab].waitForSelector(selector.title, { timeout: 20000 })
    } catch (error) {
      // console.log('等待的元素没有出现', error)
      return {
        code: 1,
        status: false,
        error: error
      }
    }

    let typeValue: any = value
    if (Array.isArray(value)) {
      typeValue = data.valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }
    try {
      // 清空输入框
      await this.page[tab].$eval(selector.title, (el: any) => (el.value = ''))
      // 点击标题元素
      await this.page[tab].click(selector.title)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      // 清空输入框
      await this.page[tab].$eval(selector.title, (el: any) => (el.value = ''))

      await this.page[tab].waitForSelector(selector.option, { timeout: 5000 })

      //获取选项元素
      const toArray = typeValue.split(',')
      for (let i = 0; i < toArray.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const getElementOption = await getElementData(this.page[tab], selector.option)
        const filterGetElementOption = getElementOption.filter((item: any) => item.textContent === toArray[i])
        const elementOption = filterGetElementOption[0]
        const options = await this.page[tab].$$(elementOption.selector)
        if (options.length === 1) {
          await this.page[tab].click(elementOption.selector)
        } else {
          await options[elementOption.index].click()
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // 模拟键盘 ESC键 关闭下拉框
      await this.page[tab].keyboard.press('Escape')
      // console.log('getElementOption', getElementOption)
    } catch (error){
      console.log('select报错', error)
      return {
        code: 1,
        status: false,
      }
    }

    return {
      code: 0,
      status: true
    }
  }
  /** 带搜索的选择器
   * @param data
   * @param data.selector.title 标题选择器
   * @param data.selector.option 选项选择器
   * @param data.value 选项值
   * @param tab 页签索引
   * */
  async selectSearch(data: Select, tab: number = this.lastTab): Promise<Returns> {
    // console.log('selectSearch', data)
    // const data = {
    //   selector: {
    //     title: 'div[class="web_ui__Card__card web_ui__Card__overflowVisible"] label[class="c-input__title"]',
    //     option: 'div[class="web_ui__Card__card web_ui__Card__overflowVisible"] div[class="web_ui__Cell__title"]'
    //   },
    //   value: { title:'Brand',value:'Shein' },
    //   valueType: 'text',
    //   remark: ''
    // }
    let { selector, value, valueType } = data

    try {
      await this.page[tab].waitForSelector(selector.title, { timeout: 10000 })
    } catch (error) {
      // console.log('等待的元素没有出现', error)
      return {
        code: 1,
        status: false,
        error: error
      }
    }
    let typeValue: any = value
    if (Array.isArray(value) && valueType === 'variate') {
      typeValue = _.get(this.variateData, typeValue.join('.'))
    }
    try {
      // 点击标题元素
      await this.page[tab].click(selector.title)
      await new Promise((resolve) => setTimeout(resolve, 4000))


      // 清空输入框
      await this.page[tab].$eval(selector.title, (el: any) => (el.value = ''))

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 输入搜索内容
      await this.page[tab].type(selector.title, typeValue, { delay: 200 })

      // 获取选项元素
      await new Promise((resolve) => setTimeout(resolve, 2000))

      await this.page[tab].waitForSelector(selector.option, { timeout: 5000 })

      const getElementOption = await getElementData(this.page[tab], selector.option)

      const filterGetElementOption = getElementOption.filter((item: any) => item.textContent === typeValue)

      const elementOption = filterGetElementOption[0]

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const options = await this.page[tab].$$(elementOption.selector)

      await options[elementOption.index].click()

    } catch (error) {
      console.log('selectSearch报错', error)
      return {
        code: 1,
        status: false,
      }
    }


    return {
      code: 0,
      status: true
    }
  }

  /**
   * 根据autoSelect.json 文件进行匹配选择 对应的select 类型
   * @param data
   * @param data.value 输入的值
   * @param data.remark 备注
   * @param data.valueType value值的类型
   * @returns {Promise<Returns>}
   * */
  async autoSelect(data: AutoSelect): Promise<Returns> {
    // console.log('activitySelect', data)

    // const data = {
    //   value:{
    //     "Category": "Women,Clothing,Dresses,Long dresses",
    //     "Brand": "Shein",
    //     "Size": "M / 38 / 10",
    //     "Condition": "Very good",
    //     "Colours": "Cream,Multi"
    //   },
    //   valueType: 'text',
    // }

    const { value, valueType } = data

    let typeValue: any = value
    if (Array.isArray(value) && valueType === 'variate') {
      typeValue = _.get(this.variateData, typeValue.join('.'))
    }

    // 对象参数转成array
    const valueToArray = Object.entries(typeValue).map(([title, values]) => {
      return {
        title: title,
        value: values
      }
    })

// 获取自定义的select 列表
    const get = await fsExtra({ type: 'readFile', data: `scriptFile/common/autoSelect.json` })

    const autoSelect = JSON.parse(get)

    // console.log('valueToArray', valueToArray)
    for (let i = 0; i < valueToArray.length; i++) {
      const titles = valueToArray[i].title

      const filter = autoSelect.filter((item: any) => item.title === titles)

      // console.log('filter',i, filter)
      const { type, selector } = filter[0]

      if (ps) {
       await ps[type]({
          selector: selector,
          value: valueToArray[i].value,
          valueType: 'text'
        })

        if(titles === 'Brand'){
          await new Promise((resolve) => setTimeout(resolve, 2000))
          await this.eventCheck({ value: 'commodity,Brand,modal' })
        }
      }
    }
    return {
      code: 0,
      status: true
    }
  }
  async verifySelect (data: { value: any, valueType: any}, tab: number = this.lastTab): Promise<Returns> {
    const { value ,valueType} = data


    let typeValue: any = value
    if (Array.isArray(value) && valueType === 'variate') {
      typeValue = _.get(this.variateData, typeValue.join('.'))
    }

    // 对象参数转成array
    const valueToArray:any = Object.entries(typeValue).map(([title, values]) => {
      return {
        title: title,
        value: values
      }
    })
    // 获取自定义的select 列表
    const get = await fsExtra({ type: 'readFile', data: `scriptFile/common/autoSelect.json` })
    const autoSelect = JSON.parse(get)
    for (let i = 0; i < valueToArray.length; i++) {
      const filter  = autoSelect.filter((item: any) => item.title === valueToArray[i].title)

      const inputValue = await this.page[tab].$eval(filter[0].selector.title, el => el.value)
      let getStatus: boolean = false
      switch (filter[0].title){
        case 'Category':
          const s = valueToArray[i].value.split(',')
          getStatus = inputValue=== s[s.length-1]
          break
        case 'Colours':
          getStatus = inputValue.replace(/ /g, "")=== valueToArray[i].value
          break
        default:
          getStatus = inputValue=== valueToArray[i].value
          break
      }
      console.log('getStatus',getStatus,valueToArray[i].value,inputValue)
      if(!getStatus){
        return await this.autoSelect(data)
      }
    }
    return {
      code: 0,
      status: true
    }
  }
  /**
   * 单选
   * @param data
   * @param {object} data.selector 元素选择对象表
   * @param data.value 值
   * @param  data.valueType value值类型
   * @param tab 页签索引
   * */
  async radio(data: Radio, tab: number = this.lastTab): Promise<Returns> {
    // console.log('radio', data)
    const { selector, value, valueType } = data
    let typeValue: any = value
    if (Array.isArray(value)) {
      typeValue = valueType === 'variate' ? _.get(this.variateData, value.join('.')) : value
    }
    return await this.click(
      {
        selector: selector[typeValue],
        wait: false,
        remark: 'radio/click',
        goOn: false
      },
      tab
    )
  }
  /** 任务列队
   * @param script 任务列队
   * @param msgType 通知类型
   * */
  async lineUp(script: any[], msgType: string = 'lineUp') {
    // console.log('任务列队', script)
    for (let i = 0; i < script.length; i++) {
      // 通知开始执行
      winEvent({
        type: msgType,
        data: {
          label: script[i].data.remark, //名称
          value: i, //在队列中的位置
          status: 1, //当前状态 0 成功 1 执行中 2 执行失败
          type: false, // 是否结束
          percent: Math.trunc(((100 / script.length) * (i + 1)) / 2), // 进度
          more: {
            scriptInfo: script[i].data // 脚本信息
          },
          children: []
        }
      })

      const res = await ps?.[script[i].type](script[i].data)
      let info: any = {
        type: msgType,
        data: {
          label: script[i].data.remark, //名称
          value: i, //在队列中的位置
          status: 1, //当前状态 0 成功 1 执行中 2 执行失败
          type: false, // 是否结束
          percent: Math.trunc(((100 / script.length) * (i + 1)) / 2), // 进度
          more: {
            scriptInfo: script[i].data // 脚本信息
          }
        }
      }
      info.data.status = res.status ? 0 : 2
      const end: boolean = i + 1 === script.length
      switch (script[i].type) {
        case 'connect':
        case 'newPageGoto':
          break
        default:
          info.data.more.pageInfo = {
            // 页面信息
            url: await this.page[this.lastTab].url(),
            title: await this.page[this.lastTab].title()
          }
          info.data.type = end
          break
      }
      if (res.code === 0) {
        winEvent(info)
        if (end) {
          return {
            code: 0,
            msg: '脚本执行完成'
          }
        }
      } else {
        winEvent(info)
        return {
          code: 1,
          msg: '脚本执行失败'
        }
      }
    }
    return
  }
  /**
   * 脚本列队
   * @param script
   * */
  async scriptLineUp(script: any[]) {
    for (let i = 0; i < script.length; i++) {
      this.variateData = script[i].variate
      const scriptData = await fsExtra({ type: 'readFile', data: `scriptFile/script/list/${script[i].type}.json` })

      const json = JSON.parse(scriptData)
      winEvent({
        type: 'scriptLineUp',
        data: {
          label: script[i].type, //名称
          value: i, //在队列中的位置
          status: 1, //当前状态 0 成功 1 执行中 2 执行失败
          type: false, // 是否结束
          percent: Math.trunc(((100 / json.length) * (i + 1)) / 2), // 进度
          children: []
        }
      })
      // await new Promise((resolve) => setTimeout(resolve, script[i].wait * 1000))
      await new Promise(async (resolve) => {
        const timeSign = 100 / script[i].wait
        let time = 0
        if (script[i].wait <= 5) {
          setTimeout(() => {
            resolve(true)
          }, script[i].wait * 1000)
          return
        } else {
          countDown(script[i].wait, (res) => {
            time += timeSign
            if (res.state) {
              time = 0
              resolve(true)
            }
            winEvent({
              type: 'countDown',
              data: time
            })
          })
        }
      })
      const res: any = await this.lineUp(json)
      if (res.code !== 0) {
        winEvent({
          type: 'scriptLineUp',
          data: {
            label: script[i].type, //名称
            value: i, //在队列中的位置
            status: 2, //当前状态 0 成功 1 执行中 2 执行失败
            type: true, // 是否结束
            percent: 100
          }
        })
        return
      } else {
        const end: boolean = script.length - 1 === i
        winEvent({
          type: 'scriptLineUp',
          data: {
            label: script[i].type, //名称
            value: i, //在队列中的位置
            status: 0, //当前状态 0 成功 1 执行中 2 执行失败
            type: end, // 是否结束
            percent: 100
          }
        })
        if (end) {
          await this.off()
        }
      }
    }
  }
  async execute() {}
  /**
   * 使用evaluate和document.querySelectorAll
   * 获取页面所有元素,根据[selector] 遍历页面是否存在[selector],
   * 判断是否全部存在, 有一个是false 返回false
   * */
  async hasElement(params: { selector: string; text: string }[], tab = this.lastTab) {
    // console.log('params',params)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    for (let i = 0; i < params.length; i++) {
      const selector = params[i].selector
      const text = params[i].text
      const list = await getElementData(this.page[tab], selector)
      if (!list.length) {
        return false
      }
      const filter = list.filter((item: any) => item.textContent === text)
      if (!filter.length) {
        return false
      }
    }
    return true
  }

  /** 事件检查*/
  async eventCheck(data: { value: string; valueType?: string }) {
    const { value } = data
    // console.log('eventCheck',value)
    try {
      const checkData = await fsExtra({ type: 'readFile', data: `scriptFile/common/checkElement.json` })
      const json = JSON.parse(checkData)
      const get = json.filter((item: any) => item.type === value)
      const verifyData = get[0].verify
      const scriptData = get[0].script
      // console.log('eventCheck---2get',get)
      const check = await this.hasElement(verifyData)

      if (check) {
        // console.log('eventCheck----1',)
        if (scriptData.length === 0) {
          // console.log('eventCheck----2',)
          return {
            code: 1,
            status: false
          }
        }
        // console.log('eventCheck----3',)
        await this.lineUp(scriptData, 'eventCheck')
        return {
          code: 0,
          status: true
        }
      }
    } catch (error) {
      return {
        code: 1,
        status: false
      }
    }
    // console.log('eventCheck----4',)
    return {
      code: 0,
      status: true
    }
  }
  /**
   * 等待元素加载
   * @param data
   * @param data.selector 元素选择器
   * @param data.timeout 超时时间（以毫秒为单位）
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.page.waitforselector
   *
   * */
  async waitForSelector(
    data: { selector: string; timeout?: number },
    tab?: number
  ): Promise<{ code: number; msg: string; error?: any }> {
    const { selector, timeout } = data
    const timeouts = timeout || 30000
    const tabs = tab || this.lastTab

    try {
      await this.page[tabs].waitForSelector(selector, { timeout: timeouts })
      return {
        code: 0,
        msg: '等待成功'
      }
    } catch (error) {
      console.log('等待失败', error)
      return {
        code: 1,
        msg: '等待失败',
        error
      }
    }
  }

  /**
   * 关闭浏览器
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * */
  async endBrowser(): Promise<{ code: number; msg: string; error?: any }> {
    try {
      await this.browser.close()
      return {
        code: 0,
        msg: '关闭成功'
      }
    } catch (error) {
      return {
        code: 1,
        msg: '关闭失败',
        error
      }
    }
  }
  async getHtml(tab?: number): Promise<{ code: number; msg: string; html?: string; error?: any }> {
    const tabs = tab || this.lastTab
    try {
      const html = await this.page[tabs].content()
      return {
        code: 0,
        msg: '获取html成功',
        html
      }
    } catch (error) {
      return {
        code: 1,
        msg: '获取html失败',
        error
      }
    }
  }

  /**
   * 切换页签 将页面置于前面（激活选项卡）
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.page.bringtofront
   * */
  async toTab(tab?: number): Promise<{ code: number; msg: string; error?: any }> {
    const tabs = tab || this.lastTab
    try {
      await this.page[tabs].bringToFront()
      return {
        code: 0,
        msg: '切换成功'
      }
    } catch (error) {
      return {
        code: 1,
        msg: '切换失败',
        error
      }
    }
  }

  /** 截图
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * @URL https://pptr.nodejs.cn/api/puppeteer.screenshotoptions/
   * */
  async screenshot(tab?: number): Promise<{ code: number; msg: string; error?: any }> {
    const imgName = Date.now() + '.png'
    const tabs = tab || this.lastTab
    try {
      await this.page[tabs].screenshot({ path: imgName })
      return {
        code: 0,
        msg: '截图成功'
      }
    } catch (error) {
      return {
        code: 1,
        msg: '截图失败',
        error
      }
    }
  }
  /**
   * 返回上一页
   * @param tab 页签索引
   * @returns {Promise<{ code:number,msg:string,error?:any}>}
   * */
  async goBack(tab?: number): Promise<{ code: number; msg: string; error?: any }> {
    const tabs = tab || this.lastTab
    try {
      await this.page[tabs].goBack()
      // 等待页面导航完成

      return {
        code: 0,
        msg: '返回成功'
      }
    } catch (error) {
      return {
        code: 1,
        msg: '返回失败',
        error
      }
    }
  }
  /** 关闭puppeteer
   *
   * */
  async off() {
    //删除监听监听事件
    ipcMain.removeAllListeners('puppeteer')
    ipcMain.removeAllListeners('puppeteerOnce')
    ps = null
    winEvent = null
    status = false
  }
}

/**
 * 根据指定的selector 遍历获取元素信息
 * @param page 页签
 * @param selector 选择器
 * @returns {GetElementData['returns']}
 * @example
 * getElementData(this.page[tab], selector)
 * */
const getElementData = async (page: any, selector: string): Promise<GetElementData['returns']> => {
  // 使用page.evaluate()获取页面元素
  return await page.evaluate(async (selector: any) => {
    // 使用选择器获取所有 的标题元素
    const elements = document.querySelectorAll(selector)

    // if (elements.length===0) {
    //   // 如果元素不存在，等待一段时间后重试
    //   await new Promise((resolve) => setTimeout(resolve, 3000))
    //   return await getElementData(page, selector)
    // }
    // 将 NodeList 转换为数组，并提取每个元素的信息
    return Array.from(elements).map((element, index) => {
      // 提取元素的所有属性，格式化为字符串数组
      const attributes = Array.from(element.attributes).map((attr: any) => {
        return `${attr.name}="${attr.value}"`
      })

      // 获取元素的位置信息
      const boundingRect = element.getBoundingClientRect()

      // 构建包含所有信息的对象
      return {
        tagName: element.tagName.toLowerCase(), // 标签名
        attributes: attributes, // 属性字符串
        id: element.id, // 元素的 id
        className: element.className, // 元素的类名
        textContent: element.textContent.trim(), // 文本内容，去除多余空白
        clientX: boundingRect.x, // 元素的水平位置
        clientY: boundingRect.y, // 元素的垂直位置
        selector: element.tagName.toLowerCase() + attributes.map((attr: any) => `[${attr}]`).join(''),
        index
      }
    })
  }, selector)
}

let interval: any = {}
/**
 * 倒计时
 * @example示例 countDown(time:number,callback:function)
 * @ck 回调 callback({state:boolean,time:number})
 * @explain注释 countDown(倒计时总时间,每次触发的回调函数)
 * @net https://www.openmyapp.com
 * */
export const countDown = (time: number, callback: (params: { state: boolean; time: null | number }) => void): void => {
  if (typeof callback !== 'function') return
  let name: string = uuid(10, 16)
  interval[name] = {}
  if (typeof interval[name].state !== 'boolean') {
    interval[name].state = false
    interval[name].time = time
    interval[name].sign = name
  }
  if (interval[name].state) return
  interval[name].sign = setInterval(function () {
    interval[name].time -= 1
    callback({
      state: false,
      time: interval[name].time
    })
    if (interval[name].time <= 0) {
      clearInterval(interval[name].sign)
      // interval[name].state = false
      callback({
        state: true,
        time: null
      })
    }
  }, 1000)
}
