import { app, BrowserWindow, powerSaveBlocker, ipcMain, session, shell, Tray, nativeImage } from 'electron'
import { join, resolve } from 'path'
import ipcRenderer from '../ipcRenderer'
import { uuid } from '@openmyjs/utils'
// import nodeFetch from 'node-fetch'
// import TrayWindow from 'electron-tray-window'
interface InitTrayWinConfig {
  width: number
  height: number
}

export class createWindow {
  // private nowShowWinId: string = ''
  private readonly winList: { id: string; win: BrowserWindow }[] = []
  private mainWindowShowStatus: boolean = true //  main 窗口显示状态

  private isMouseToTrayIcon: boolean = false // 鼠标是否有进入图标的状态
  private initTrayWinConfig: {left:InitTrayWinConfig,right:InitTrayWinConfig} = {
    left:{
      width: 100,
      height: 200,
    },
    right:{
      width: 100,
      height: 100,
    }
  }

  constructor() {}

  /**
   * 创建主窗口
   * */
  public async main() {
    if (this.winList.length >= 1) {
      throw new Error('mainWindow is exist')
    }

    const winID = 'win_main'

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content - Security - Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
          ]
        }
      })
    })

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 805,
      height: 380,
      show: false,
      autoHideMenuBar: true,
      frame: false, // 是否边框窗口
      transparent: true, // 窗口透明
      // backgroundColor: '#00000000', // 背景颜色完全透明
      title: 'script tools',
      resizable: false, // 禁止调整窗口大小
      // ...(process.platform === 'linux' ? { icon } : {}),
      icon: resolve(__dirname, '../../resources/logo.ico'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      }
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    const query = `?winId=${winID}`
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      const mainUrl = process.env['ELECTRON_RENDERER_URL'] + query
      console.log('mainUrl', mainUrl)
      await mainWindow.loadURL(mainUrl)
      mainWindow.webContents.openDevTools({ mode: 'detach' }) //detach  //right
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')
      await mainWindow.loadFile(mainUrl, {
        query: {
          winId: winID
        }
      })
    }

    // 注册 createWindow 事件  其他位置可以调用 创建新的窗口
    ipcMain.on('createWindow', async (_event, args) => {
      console.log('createWindow', args)
      await this.newWindow(args, mainWindow)
    })

    // // 监听窗口获得焦点事件
    mainWindow.on('focus', () => {
      // focusedWindow = mainWindow;
    })

    // 监听窗口失去焦点事件
    mainWindow.on('blur', () => {
      // console.log('Main window blurred',winId);
      if (this.isMouseToTrayIcon) {
        return
      }
      this.mainWindowShowStatus = false
      mainWindow.hide()
    })

    mainWindow.on('ready-to-show', () => {
      this.winList.push({
        id: winID,
        win: mainWindow
      })
      mainWindow.show()
    })

    // const minWidth = mainWindow.getMinimumSize()[0]
    // const minHeight = mainWindow.getMinimumSize()[1]
    // console.log(`最小宽度: ${minWidth}, 最小高度: ${minHeight}`)

    // mainWindow.setOverlayIcon(nativeImage.createFromPath('resources/icon.png'), 'Description for overlay')

    // ipcMain.on('ipcMessage', (_, args) => {
    //   mainWindow.webContents.send('ipcMessage', args)
    //   console.log('我在main收到msg:', args)
    // })

    // console.log('modules', modules)
    // await oneWayApi((res) => {
    //   mainWindow.webContents.send(res.channel, res.data)
    // })
    //  await ipcRenderer(mainWindow,winId)
    // await ipcRenderer(mainWindow,this.winId)

    // 阻止系统休眠

    powerSaveBlocker.start('prevent-app-suspension')

    await ipcRenderer(this.winList)

    await this.mainTray(mainWindow)
  }
  /**
   * 创建主进程窗口的系统托盘
   * @param mainWindow
   * */
  private async mainTray(mainWindow: BrowserWindow) {
    const trayIcon = resolve(__dirname, '../../resources/logo.ico')

    const appTray = new Tray(trayIcon)

    let isMouseToTrayIconStatus: boolean = false  //  鼠标是否有进入图标的状态
    let flashTrayIconStatus: boolean = false

    appTray.setToolTip(mainWindow.getTitle())

    const trayInfo = appTray.getBounds()

    const { show: leftShow, hide: leftHide ,setSize: leftSetSize} = await this.mainTrayWindow({
      name: 'left',
      // config: {
      //   width: this.initTrayWinConfig.left.width,
      //   height: this.initTrayWinConfig.left.height,
      //   x: trayInfo.x,
      //   y: trayInfo.y - this.initTrayWinConfig.left.height
      // }
    })
    const leftShowParams = {
      x: trayInfo.x-(this.initTrayWinConfig.left.width/2)+15,
      y: trayInfo.y - this.initTrayWinConfig.left.height
    }

    const { show: rightShow, hide: rightHide ,setSize: rightSetSize} = await this.mainTrayWindow({
      name: 'right',
    })

    appTray.on('click', () => {
      // console.log('click', this.mainWindowShowStatus)
      // mainWindow.isVisible()
      if (this.mainWindowShowStatus) {
        // mainWindow.blur()
        mainWindow.hide()
      } else {
        // mainWindow.focus()
        mainWindow.show()
      }
      this.mainWindowShowStatus = !this.mainWindowShowStatus
    })

    const rightShowParams = {
      x: trayInfo.x+20,
      y: trayInfo.y - this.initTrayWinConfig.right.height + 10
    }
    appTray.on('right-click', () => {
      leftHide()
      rightSetSize({
        width: this.initTrayWinConfig.right.width,
        height: this.initTrayWinConfig.right.height,
      })
      rightShow(rightShowParams)
    })

    // Tray收到消息闪烁
    const trayFlicker = {
      isFlashing: false,
      flashInterval: null as NodeJS.Timeout | null,
      /**
       * 启动闪烁
       * */
      start: async () => {
        const originalIcon = trayIcon
        const nullImg = nativeImage.createFromPath('resources/nullIcon.png')
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
        console.log('停止闪烁',isFlashing)
        if (!isFlashing) return
        trayFlicker.isFlashing = false
        if (flashInterval) {
          clearInterval(flashInterval)
        }
        appTray.setImage(trayIcon) // 恢复正常图标
      }
    }

    // 监听鼠标进入 任务栏 图标
    appTray.on('mouse-enter', () => {
      this.isMouseToTrayIcon = true
      if(flashTrayIconStatus){
        leftShow(leftShowParams)
      }
    })

    // 监听鼠标离开 任务栏 图标
    appTray.on('mouse-leave', () => {
      this.isMouseToTrayIcon = false

      // 延时触发 用户鼠标没有进入 leftWindow  执行 关闭leftWindow
      setTimeout(() => {if (!isMouseToTrayIconStatus) {leftHide()}}, 500)
    })

    ipcMain.on('mainTrayIcon', async (_event:any, args:any) => {
      console.log('mainTrayIcon', args)
      const { type, data } = args
      switch (type) {
        case 'mouseToTrayIcon': //鼠标进入和离开 tray的窗口 事件
          isMouseToTrayIconStatus = data.status
          if (data.status) {
            leftShow(leftShowParams)
          } else {
            setTimeout(() => {
              if (!this.isMouseToTrayIcon) {
                leftHide()
              }
            }, 100)
          }
          break
        case 'mouseToTrayIconRight': //鼠标进入和离开 tray的窗口 事件
          isMouseToTrayIconStatus = data.status
          if (data.status) {
            rightShow(rightShowParams)
          } else {
            setTimeout(() => {
              if (!this.isMouseToTrayIcon) {
                rightHide()
              }
            }, 100)
          }
          break
        case 'openMainTrayFlash': //打开托盘窗口闪烁
          // console.log('openMainTrayFlash', data)
          flashTrayIconStatus = true
          appTray.setToolTip('')
          await trayFlicker.start() //启动 闪烁
          leftSetSize(data.config) // 设置left窗口配置 宽和高
          break
        case 'closeMainTrayFlash': // 关闭托盘窗口闪烁
          flashTrayIconStatus = false
          appTray.setToolTip(mainWindow.getTitle())
          trayFlicker.stop()
          break
        case 'setMainTrayLeftWin':
          leftSetSize(data)
          break
        case 'setMainTrayRightWin':
          rightSetSize(data)
          break

      }
    })

    // //创建 window 系统的提示消息 类似与推送消息的弹窗样式
    // appTray.displayBalloon({
    //   title: '新消息',
    //   content: '您有一条新消息，请查看！',
    // });
  }
  // private async mainTrayLeft (mainWindow:BrowserWindow) {
  //   const trayIcon = resolve(__dirname, '../../resources/yiyang.ico')
  //
  //   const appTray = new Tray(trayIcon)
  //
  //   appTray.setToolTip(mainWindow.getTitle())
  //   // Call this again for Linux because we modified the context menu
  //   // appTray.setContextMenu(contextMenu)
  //   const trayInfo = appTray.getBounds()
  //   const trayWindowLeft = new BrowserWindow({
  //     show: false,
  //     autoHideMenuBar: true,
  //     // 是否边框窗口
  //     frame: false,
  //     // 窗口透明
  //     transparent: true,
  //     title: 'trayWindowLeft',
  //     // 禁止调整窗口大小
  //     // resizable: false,
  //     webPreferences: {
  //       preload: join(__dirname, '../preload/index.js'),
  //       sandbox: false,
  //       contextIsolation: true, // 启用上下文隔离
  //       nodeIntegration: false, // 禁用 Node.js 集成
  //       webSecurity: true // 启用 Web 安全
  //       // devTools: false
  //     },
  //     skipTaskbar: true // 隐藏在任务栏中
  //   })
  //
  //   if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
  //     const mainUrl = join(process.env['ELECTRON_RENDERER_URL'], '/tray/left')
  //     await trayWindowLeft.loadURL(mainUrl)
  //     // TrayWindow.webContents.openDevTools({ mode: 'right' })
  //   } else {
  //     const mainUrl = join(__dirname, '../renderer/index.html')
  //     await trayWindowLeft.loadFile(mainUrl, {
  //       hash: '/tray/left'
  //     })
  //   }
  //
  //   // 显示窗口
  //   const setTrayWindowShow = () => {
  //     trayWindowLeft.setAlwaysOnTop(true)
  //     trayWindowLeft.setSize(this.mainTrayWindowConfig.width, this.mainTrayWindowConfig.height)
  //     trayWindowLeft.setPosition(trayInfo.x - this.mainTrayWindowConfig.width / 2, trayInfo.y - 500)
  //     trayWindowLeft.focus()
  //     trayWindowLeft.show()
  //   }
  //
  //   // 隐藏窗口
  //   const setTrayWindowHide = () => {
  //     trayWindowLeft.setAlwaysOnTop(false)
  //     trayWindowLeft.blur()
  //     trayWindowLeft.hide()
  //   }
  //   // 鼠标是否有进入窗口的状态
  //   let isMouseToTrayWindowStatus: boolean = false
  //
  //
  //   let messageStatus: boolean = false
  //   // 监听点击事件
  //   appTray.on('click', () => {
  //     console.log('click',mainWindow.isVisible())
  //     // mainWindow.isVisible()
  //     if (this.mainWindowShowStatus) {
  //       // mainWindow.blur()
  //       mainWindow.hide()
  //     }else {
  //       // mainWindow.focus()
  //       mainWindow.show()
  //     }
  //     this.mainWindowShowStatus = !this.mainWindowShowStatus
  //   })
  //
  //
  //   // 监听鼠标进入 任务栏 图标
  //   appTray.on('mouse-enter', () => {
  //     this.isMouseToTrayIcon = true
  //     if (messageStatus) {
  //       if (!isMouseToTrayWindowStatus) {
  //         setTrayWindowShow()
  //       }
  //     }
  //   })
  //   // 监听鼠标离开 任务栏 图标
  //   appTray.on('mouse-leave', () => {
  //     // console.log('mouse-leave')
  //     // TrayWindow.hide();
  //     this.isMouseToTrayIcon = false
  //     if (messageStatus) {
  //
  //       setTimeout(() => {
  //         if (!isMouseToTrayWindowStatus) {
  //           setTrayWindowHide()
  //         }
  //       }, 100)
  //     }
  //   })
  //
  //   // Tray收到消息闪烁
  //   const trayFlicker = {
  //     isFlashing: false,
  //     flashInterval: null as NodeJS.Timeout | null,
  //     /**
  //      * 启动闪烁
  //      * */
  //     start: async () => {
  //       const originalIcon = trayIcon
  //       const nullImg = nativeImage.createFromPath('resources/nullIcon.png')
  //       let isFlashing = trayFlicker.isFlashing
  //       if (isFlashing) return // 防止重复启动闪烁
  //       isFlashing = true
  //
  //       let toggle = true
  //
  //       // // 从网络加载图片
  //       // const response = await fetch(originalIcon);
  //       // if (!response.ok) {
  //       //   throw new Error(`Failed to load image: ${response.statusText}`);
  //       // }
  //       //
  //       // // 使用 arrayBuffer() 获取图片数据
  //       // const arrayBuffer = await response.arrayBuffer();
  //       //
  //       // // 将 ArrayBuffer 转换为 Buffer
  //       // const buffer = Buffer.from(arrayBuffer);
  //       //
  //       // // 使用 nativeImage 创建图片
  //       // const image = nativeImage.createFromBuffer(buffer);
  //
  //       trayFlicker.flashInterval = setInterval(() => {
  //         appTray.setImage(toggle ? originalIcon : nullImg)
  //         toggle = !toggle // 切换图标
  //       }, 500) // 每500毫秒切换一次
  //     },
  //     /**
  //      * 停止闪烁
  //      * */
  //     stop: () => {
  //       let isFlashing = trayFlicker.isFlashing
  //       let flashInterval = trayFlicker.flashInterval
  //       if (!isFlashing) return
  //       isFlashing = false
  //       if (flashInterval) {
  //         clearInterval(flashInterval)
  //       }
  //       appTray.setImage(trayIcon) // 恢复正常图标
  //     }
  //   }
  //
  //   //renderer tray  to main tray 统一通讯
  //   ipcMain.on('mainTrayWindow', async (_event, args) => {
  //     const { type, data } = args
  //     switch (type) {
  //       case 'mouseToWindowLeft': //鼠标进入和离开 tray的窗口 事件
  //         isMouseToTrayWindowStatus = data.status
  //         if (data.status) {
  //           setTrayWindowShow()
  //         } else {
  //           setTimeout(() => {
  //             if (!this.isMouseToTrayIcon) {
  //               setTrayWindowHide()
  //             }
  //           }, 100)
  //         }
  //         break
  //       case 'messageToMainTrayWindow': //消息到主窗口的托盘图标
  //         messageStatus = true
  //         this.mainTrayWindowConfig = data.config // 设置窗口配置 宽和高
  //         await trayFlicker.start() //启动 闪烁
  //         break
  //       case 'messageToMainTrayWindowHide':
  //         messageStatus = false
  //         trayFlicker.stop()
  //         setTrayWindowHide()
  //     }
  //   })
  // }

  private async mainTrayWindow(params: {
    name: string
  }): Promise<{ show: (params:{x:number,y:number}) => void; hide: () => void;setSize: (params:{width:number,height:number}) => void }> {
    const { name } = params
    const trayWindow = new BrowserWindow({
      show: false,
      autoHideMenuBar: true,
      // 是否边框窗口
      frame: false,
      // 窗口透明
      transparent: true,
      title: `trayWindow-${name}`,
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
    const show = (params:  { x: number; y: number }) => {
      trayWindow.setAlwaysOnTop(true)
      trayWindow.setPosition(params.x, params.y)
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
        height: params.height,
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
  /**
   * 新窗口
   * @param params {NewWindow}
   *
   * @param mainWin {BrowserWindow}
   * */
  private async newWindow(params: NewWindow, mainWin: BrowserWindow): Promise<void> {
    let { router, config } = params
    if (router) {
      if (typeof router === 'string') {
        router = {
          path: router,
          query: null
        }
      }
    } else {
      throw new Error('router is null')
    }

    const winID = 'win_' + uuid(16, 16)

    const defConfig: any = {
      width: 1000,
      height: 800,
      show: false,
      autoHideMenuBar: true,
      frame: false, // 是否边框窗口
      transparent: true, // 窗口透明
      // backgroundColor: '#00000000', // 背景颜色完全透明
      title: 'script tools',
      resizable: false // 禁止调整窗口大小
    }
    const newConfig = {
      ...defConfig,
      ...config,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      }
    }

    // Create the browser window.
    const newWindow = new BrowserWindow(newConfig)

    newWindow.webContents.on('did-finish-load', () => {
      if (typeof router === 'object' && router?.query) {
        newWindow.webContents.send('window-query', router.query)
      }
    })

    newWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    const query = `?winId=${winID}`

    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      const newWindowUrl = join(process.env['ELECTRON_RENDERER_URL'], router.path, query)
      await newWindow.loadURL(newWindowUrl)
      newWindow.webContents.openDevTools({ mode: 'detach' }) //detach  //right
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')

      await newWindow.loadFile(mainUrl, {
        query: {
          winId: winID
        },
        hash: router.path
      })
    }

    newWindow.on('ready-to-show', () => {
      this.winList.push({
        id: winID,
        win: newWindow
      })

      newWindow.show()
    })

    newWindow.on('closed', () => {
      const index = this.winList.findIndex((item) => item.id === winID)
      this.winList.splice(index, 1)
      if (this.winList.length === 1) {
        mainWin.show()
      }
    })
  }
}

interface NewWindow {
  router: { path: string; query?: any } | string
  config: BrowserWindow
}
