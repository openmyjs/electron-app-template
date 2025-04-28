
export default function () {
  const wsURL:any = ref<string>('')
  /*启动浏览器*/
  const startBrowser = async (id:string) => {
    const res = await electron.request({
      url: 'http://localhost:50325/api/v1/browser/start',
      method: 'get',
      data: {
        params: {
          user_id: id,
          launch_args:['--start-maximized']
        },
      },
    })
    // console.log('startBrowser', res)
    wsURL.value = res.data.ws.puppeteer
    return  res

  }
  /** 清理缓存*/
  const deleteCache = async () => {
    return electron.request({
      url: 'http://localhost:50325/api/v1/user/delete-cache',
      method: 'post',
      data:{}
    })
  }
  /*API接口状态*/
  const BrowserApiStatus = async () => {
    return electron.request({
      url: 'http://localhost:50325/status',
      method: 'get',
      data: {
        params: {
          user_id: 'kunhas0',
        },
      },
    }).then((_res: any) => {
      // console.log('response', res)
    })

  }
  /*查询环境*/
  const getBrowserInfo = async () => {
    return electron.request({
      url: 'http://localhost:50325/api/v1/user/list',
      method: 'get',
      data: {
        params: {
          group_id: 0,
          page: 1,
          page_size: 15,
        },
      },
    })
  }

  /*检查启动状态*/
  const getStartStatus = async () => {
    return electron.request({
      url: 'http://localhost:50325/api/v1/browser/active',
      method: 'get',
    }).then((_res: any) => {
      // console.log('response', res)
    })
  }
  /**
   * 添加浏览器
   * */
  const addBrowser = async (data:any) => {
    // console.log('addBrowser--------5555', typeof data)
    const res = await electron.request({
      url: 'http://localhost:50325/api/v1/user/create',
      method: 'post',
      data: {
        body:data
        //   {
        //   group_id:'0',
        //   name:'electronTest',
        //   // country:"us",
        //   // 指纹参数
        //   fingerprint_config:{
        //     "automatic_timezone": "1", //1：基于IP自动生成对应的时区(默认)；0：指定时区。
        //     "language_switch":"0", //基于IP国家设置语言：0：关闭；1：启用。
        //     "page_language_switch":"1", //基于[语言]匹配界面语言，0：关闭；1：启用。
        //     "language":["en"],
        //     "flash": "block", //
        //     "fonts":["all"],
        //     "webrtc":"disabled",
        //     "random_ua":{
        //       // "ua_browser":["chrome","firefox"],
        //       // "ua_version":["80"],
        //       "ua_system_version":["Windows 10","Windows 11"]
        //     }
        //   },
        //   // 环境代理参数
        //   user_proxy_config: {
        //     "proxy_soft":"other", //no_proxy/other
        //     "proxy_type":"socks5",
        //     "proxy_host":"195.123.212.28",
        //     "proxy_port":"59715",
        //     "proxy_user":"18060096519",
        //     "proxy_password":"hvk2cjfDsi"
        //   }
        //
        // }
      },
    })
    // console.log('addBrowser', res)
    return  res
  }
  const closeBrowser = async (id:string) => {
    return electron.request({
      url: 'http://localhost:50325/api/v1/browser/stop',
      method: 'get',
      data: {
        params: {
          user_id: id
        },
      },
    })
  }

  onUnmounted(()=>{
    electron.puppeteer.off()
  })
  return {
    startBrowser,
    addBrowser,
    BrowserApiStatus,
    getBrowserInfo,
    getStartStatus,
    deleteCache,
    wsURL,
    closeBrowser
  }
}