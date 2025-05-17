import { app, BrowserWindow, ipcMain, Tray, nativeImage } from 'electron'
import { join } from 'path'

interface InitTrayWinConfig {
  width: number
  height: number
}

interface Options {
  icon: string
  preload: string
  rightConfig:{
    openDevTools:boolean,
    pathname:string,
  },
  leftConfig:{
    open:boolean,
    pathname:string,
    openDevTools:boolean,
  }
}

interface Init {
  tray: Tray
  rightTrayWindow: BrowserWindow,
  rightTrayWindow_id:  string,
  leftTrayWindow: BrowserWindow | null,
  leftTrayWindow_id: string | null
}

export class trayWindow {
  private readonly trayIcon: string // tray icon

  private readonly preload: string

  private leftParams: any

  private readonly rightConfig: Options['rightConfig'] = {
    openDevTools: false,
    pathname: 'tray.html'
  }

  private readonly leftConfig: Options['leftConfig'] = {
    open: false,
    pathname: 'tray.html',
    openDevTools: false,
  }

  private isMouseToTrayIcon: boolean = false // 鼠标是否有进入图标的状态

  private isMouseToTrayWindow: boolean = false // 鼠标是否进入窗口的状态

  private initTrayWinConfig: { right: InitTrayWinConfig; left: InitTrayWinConfig } = {
    right: {
      width: 100,
      height: 200
    },
    left: {
      width: 100,
      height: 200
    }
  }

  constructor(options: Options) {
    const {
      icon,
      rightConfig,
      leftConfig,
      preload,

    } = options
    if (!icon) throw new Error('icon is null')
    this.trayIcon = icon
    if (!rightConfig) throw new Error('rightConfig is null')
    this.rightConfig = rightConfig
    for (const key in this.rightConfig) {
      if(rightConfig[key]){
        this.rightConfig[key] = rightConfig[key]
      }
    }
    this.leftConfig = leftConfig
    for (const key in this.leftConfig) {
      if(leftConfig[key]){
        this.leftConfig[key] = leftConfig[key]
      }
    }
    this.preload = preload
  }

  /**
   * 异步初始化托盘
   */
  /**
   * 创建主进程窗口的系统托盘
   * */
  async init(mainWindow: BrowserWindow): Promise<Init> {

    const appTray = new Tray(this.trayIcon)

    let flashTrayIconStatus: boolean = false

    appTray.setToolTip(mainWindow.getTitle())

    // 坐标信息
    const trayInfo = appTray.getBounds()

    const that = this
    function rightShowParams() {

      return {
        x: trayInfo.x + 5,
        y: trayInfo.y - that.initTrayWinConfig.right.height + 10,
        width: that.initTrayWinConfig.right.width,
        height: that.initTrayWinConfig.right.height
      }

    }

    function leftShowParams() {
      return {
        x: trayInfo.x - that.initTrayWinConfig.left.width / 2 + 11,
        y: trayInfo.y - that.initTrayWinConfig.left.height,
        width: that.initTrayWinConfig.left.width,
        height: that.initTrayWinConfig.left.height
      }
    }

    appTray.on('click', () => {
      // console.log('click',mainWindow.isVisible())
      if (flashTrayIconStatus) {
        mainWindow.show()
        mainWindow.webContents.send('clickTrayIconParams', this.leftParams)
      } else {
        if (mainWindow.isVisible()) {
          mainWindow.hide()
        } else {
          mainWindow.show()
        }
      }
    })

    appTray.on('right-click', () => {
      if (flashTrayIconStatus) {
        leftHide()
      }
      rightShow(rightShowParams())
    })

    // 监听鼠标进入 任务栏 图标
    appTray.on('mouse-enter', () => {
      this.isMouseToTrayIcon = true
      if (this.leftConfig.open) {
        if (flashTrayIconStatus) {
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
          if (this.leftConfig.open) {
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
        case 'mainAndTrayToMessage':
          // console.log('mainAdminTrayMessage', data)
          this.bothWayMessage(data,{
            main: mainWindow,
            right: rightTrayWindow,
            left: leftTrayWindow
          })
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

    const trayRightId = 'trayRight'

    const {
      show: rightShow,
      setSize: rightSetSize,
      trayWindow: rightTrayWindow
    } = await this.mainTrayWindow({
      name: 'right',
      id: trayRightId,
      openDevTools: this.rightConfig.openDevTools,
      pathname:this.rightConfig.pathname +'#/right'
    })

    if (!this.leftConfig.open)
      return {
        tray: appTray,
        rightTrayWindow: rightTrayWindow,
        rightTrayWindow_id: trayRightId,
        leftTrayWindow: null,
        leftTrayWindow_id: null
      }
    const trayLeftId = 'trayLeft'
    const {
      show: leftShow,
      hide: leftHide,
      setSize: leftSetSize,
      trayWindow: leftTrayWindow
    } = await this.mainTrayWindow({
      name: 'left',
      id: trayLeftId,
      openDevTools: this.leftConfig.openDevTools,
      pathname:this.leftConfig.pathname + '#/left'
    })
    return {
      tray: appTray,
      rightTrayWindow: rightTrayWindow,
      rightTrayWindow_id: trayRightId,
      leftTrayWindow: leftTrayWindow,
      leftTrayWindow_id: trayLeftId
    }
  }

  private async mainTrayWindow(params: {
    name: string
    id: string
    openDevTools: boolean
    pathname:  string
  }): Promise<MainTrayWindowRun> {
    const { name, openDevTools, id,pathname } = params
    const trayWindow = new BrowserWindow({
      show: false,
      autoHideMenuBar: true,
      // 是否边框窗口
      frame: false,
      // 窗口透明
      transparent: true,
      title: `tray-${name}`,
      // 禁止调整窗口大小
      resizable: false,
      webPreferences: {
        preload: this.preload,
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      },
      skipTaskbar: true // 隐藏在任务栏中
    })



    const query = `?winId=${id}`
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      // const mainUrl =  process.env['ELECTRON_RENDERER_URL'] + pathname + query
      const mainUrl = `${process.env['ELECTRON_RENDERER_URL']}` + `/${pathname}/${query}`
      console.log('mainUrl--------1', mainUrl)
      await trayWindow.loadURL(mainUrl, )
      openDevTools && trayWindow.webContents.openDevTools({ mode: 'detach' })
      // trayWindow.webContents.openDevTools({ mode: 'detach' })
    } else {
      const mainUrl = join(__dirname, '../renderer/tray.html')
      await trayWindow.loadFile(mainUrl, {
        hash: `/${name}`,
        query: {
          winId: id
        }
      })
    }

    // 显示窗口
    const show = (param: TrayWinShowParams) => {
      trayWindow.setAlwaysOnTop(true)
      // trayWindow.setPosition(params.x, params.y)
      trayWindow.setBounds(param, true)
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
      setSize,
      trayWindow
    }
  }
  /**
   * tray窗口和host窗口之间相互通信
   * */
  private bothWayMessage(params: any,win:{ main: BrowserWindow; right: BrowserWindow; left: BrowserWindow}) {
    console.log('bothWayMessage', params)
    const { type, data} = params
    switch (type){
      case 'mainToRight':
        win.right.webContents.send('MainToTrayRightMessage',data)
        break
      case 'mainToLeft':
        win.left.webContents.send('MainToTrayLeftMessage',data)
        break
      case 'rightToMain':
        win.main.webContents.send('trayToMainRightMessage',data)
        break
      case 'leftToMain':
        win.main.webContents.send('trayToMainLeftMessage',data)
        break

    }
  }
}

interface MainTrayWindowRun {
  show: (params: TrayWinShowParams) => void
  hide: () => void
  setSize: (params: { width: number; height: number }) => void
  trayWindow: BrowserWindow
}

interface TrayWinShowParams {
  x: number
  y: number
  width: number
  height: number
}
