import { app, BrowserWindow, ipcMain, Tray, nativeImage,} from 'electron'
import { join } from 'path'
interface InitTrayWinConfig {
  width: number
  height: number
}
interface Options {
  icon:string,
  leftStatus?:boolean,
  preload:string
}
export class trayWindow {

  private readonly trayIcon:  string // tray icon

  private readonly leftStatus: boolean = false  // left 是否开启

  private leftParams:any

  private isMouseToTrayIcon: boolean = false // 鼠标是否有进入图标的状态

  private isMouseToTrayWindow: boolean = false  // 鼠标是否进入窗口的状态

  private initTrayWinConfig: {right:InitTrayWinConfig,left:InitTrayWinConfig} = {
    right:{
      width: 100,
      height: 200,
    },
    left:{
      width: 100,
      height: 200,
    }
  }

   constructor(options:Options) {
    const { icon,leftStatus} = options
    if(!icon) throw new Error('icon is null')
     this.leftStatus = leftStatus || false
     this.trayIcon = icon
  }
  /**
   * 异步初始化托盘
   */
  /**
   * 创建主进程窗口的系统托盘
   * */
   async init(mainWindow:BrowserWindow): Promise<Tray> {

    const appTray = new Tray(this.trayIcon)


    let flashTrayIconStatus: boolean = false

    appTray.setToolTip(mainWindow.getTitle())


    // 坐标信息
    const trayInfo = appTray.getBounds()

    const that = this
    function rightShowParams (){
      return {
        x: trayInfo.x + 5,
        y: trayInfo.y- that.initTrayWinConfig.right.height+ 10,
        width: that.initTrayWinConfig.right.width,
        height: that.initTrayWinConfig.right.height
      }
    }


    function leftShowParams (){
      return {
        x: trayInfo.x  - (that.initTrayWinConfig.left.width/2)+11,
        y: trayInfo.y - that.initTrayWinConfig.left.height ,
        width: that.initTrayWinConfig.left.width,
        height: that.initTrayWinConfig.left.height
      }
    }

    appTray.on('click', () => {
      // console.log('click',mainWindow.isVisible())
      if(flashTrayIconStatus){
        mainWindow.show()
        mainWindow.webContents.send('clickTrayIconParams', this.leftParams)
      }else {
        if(mainWindow.isVisible()){
          mainWindow.hide()
        }else {
          mainWindow.show()
        }
      }

    })

    appTray.on('right-click', () => {
      if(flashTrayIconStatus){
        leftHide()
      }
      rightShow(rightShowParams())
    })

    // 监听鼠标进入 任务栏 图标
    appTray.on('mouse-enter', () => {
      this.isMouseToTrayIcon = true
      if(this.leftStatus){
        if(flashTrayIconStatus){
          leftShow(leftShowParams())
        }
      }

    })

    // 监听鼠标离开 任务栏 图标
    appTray.on('mouse-leave', () => {
      this.isMouseToTrayIcon = false
      setTimeout(() => {
        if (!this.isMouseToTrayWindow) {
          // rightHide()
          if(this.leftStatus){
            leftHide()
          }
        }
        }, 200)
    })


    ipcMain.on('mainTrayIcon', async (_event: any, args: any) => {
      const { type, data } = args
      switch (type) {
        case 'mouseToTrayIcon': //鼠标进入和离开 tray的窗口 事件
          this.isMouseToTrayWindow = data.status
          if (data.status) {
            leftShow(leftShowParams())
          } else {
            setTimeout(() => {
              if (!this.isMouseToTrayIcon) {
                leftHide()
              }
            }, 100)
          }
          break
        case 'mouseToTrayIconRight': //鼠标进入和离开 tray的窗口 事件
          this.isMouseToTrayWindow = data.status
          // if (data.status) {
          //   rightShow(rightShowParams())
          // } else {
          //   setTimeout(() => {
          //     if (!this.isMouseToTrayIcon) {
          //       rightHide()
          //     }
          //   }, 100)
          // }
          break
        case 'closeMainTrayFlash': // 关闭托盘窗口闪烁
          flashTrayIconStatus = false
          appTray.setToolTip(mainWindow.getTitle())
          trayFlicker.stop()
          break
        case 'setRightTraySize':
          this.initTrayWinConfig.right = data
          rightSetSize(data)
          break
        case 'openMainTrayFlash': //打开托盘窗口闪烁
          // console.log('openMainTrayFlash', data)
          flashTrayIconStatus = true
          appTray.setToolTip('')
          this.leftParams = data.param
          await trayFlicker.start() //启动 闪烁
          leftSetSize(data.config) // 设置left窗口配置 宽和高
          this.initTrayWinConfig.left.height = data.config.height
          this.initTrayWinConfig.left.width = data.config.width
          break
      }
    })

    // Tray收到消息闪烁
    const trayFlicker = {
      isFlashing: false,
      flashInterval: null as NodeJS.Timeout | null,
      /**
       * 启动闪烁
       * */
      start: async () => {
        const originalIcon = this.trayIcon
        const nullImg = nativeImage.createFromPath('./resources/nullIcon.png')
        let isFlashing = trayFlicker.isFlashing
        if (isFlashing) return // 防止重复启动闪烁
        trayFlicker.isFlashing = true

        let toggle = true

        trayFlicker.flashInterval = setInterval(() => {
          appTray.setImage(toggle ? originalIcon : nullImg)
          toggle = !toggle // 切换图标
        }, 500) // 每500毫秒切换一次
      },
      /**
       * 停止闪烁
       * */
      stop: () => {
        let isFlashing = trayFlicker.isFlashing
        let flashInterval = trayFlicker.flashInterval
        // console.log('停止闪烁',isFlashing)
        if (!isFlashing) return
        trayFlicker.isFlashing = false
        if (flashInterval) {
          clearInterval(flashInterval)
        }
        appTray.setImage(this.trayIcon) // 恢复正常图标
      }
    }


    const { show: rightShow, setSize: rightSetSize } = await this.mainTrayWindow({name:'right'})
    if(!this.leftStatus)return appTray
    const { show: leftShow, hide: leftHide, setSize: leftSetSize } = await this.mainTrayWindow({name:'left'})

    return appTray
  }

  private async mainTrayWindow(params: { name: string }): Promise<MainTrayWindowRun> {
    const { name } = params
    const trayWindow = new BrowserWindow({
      show: false,
      autoHideMenuBar: true,
      // 是否边框窗口
      frame: false,
      // 窗口透明
      transparent: true,
      title: `tray-${name}`,
      // 禁止调整窗口大小
      // resizable: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      },
      skipTaskbar: true // 隐藏在任务栏中
    })

    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      const mainUrl = join(process.env['ELECTRON_RENDERER_URL'], `/tray/${name}`)
      await trayWindow.loadURL(mainUrl)
      // trayWindow.webContents.openDevTools({ mode: 'detach' })
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')
      await trayWindow.loadFile(mainUrl, {
        hash: `/tray/${name}`
      })
    }

    // 显示窗口
    const show = (param:TrayWinShowParams) => {
      trayWindow.setAlwaysOnTop(true)
      // trayWindow.setPosition(params.x, params.y)
      trayWindow.setBounds(param)
      trayWindow.focus()
      trayWindow.show()
    }

    // 隐藏窗口
    const hide = () => {
      trayWindow.setAlwaysOnTop(false)
      trayWindow.blur()
      trayWindow.hide()
    }

    // 设置窗口
    const setSize = (params: { width: number; height: number }) => {
      trayWindow.setBounds({
        width: params.width,
        height: params.height
      })
    }

    trayWindow.on('focus', () => {})
    trayWindow.on('blur', () => {
      hide()
    })

    return {
      show,
      hide,
      setSize
    }
  }
}

interface MainTrayWindowRun {
  show: (params:TrayWinShowParams) => void
  hide: () => void
  setSize: (params: { width: number; height: number }) => void
}

interface TrayWinShowParams {
  x: number
  y: number
  width: number
  height: number
}