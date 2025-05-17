import { app, BrowserWindow, powerSaveBlocker, ipcMain, session, shell } from 'electron'
import { join, resolve } from 'path'
import ipcRenderer from '../ipcRenderer'
import { uuid } from '@openmyjs/utils'
// import nodeFetch from 'node-fetch'
// import TrayWindow from 'electron-tray-window'
// import { trayWindow } from '@openmyjs/electron/tray/main'
import { trayWindow } from '../tray/tray'
export class createWindow {

  private readonly winMap:Map<string, BrowserWindow> = new Map()

  private isMouseToTrayIcon: boolean = false // 鼠标是否有进入图标的状态

  constructor() {}

  /**
   * 创建主窗口
   * */
  public async main() {
    if (this.winMap.get('main')) {
      // console.log('mainWindow is exist',this.winMap.get('main'))
      throw new Error('mainWindow is exist')
    }

    const winID = 'main'

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
      mainWindow.webContents.openDevTools({ mode: 'right' }) //detach  //right
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

    })

    mainWindow.on('ready-to-show', () => {
      this.winMap.set(winID,mainWindow)
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

    await ipcRenderer(this.winMap)

    // await this.mainTray(mainWindow)
    const tray = new trayWindow({
      icon:resolve(__dirname, '../../resources/logo.ico'),
      preload:join(__dirname, '../preload/index.js'),
      rightConfig:{
        openDevTools:true,
        pathname:'tray.html',
      },
      leftConfig:{
        open:true,
        pathname:'tray.html',
        openDevTools:false,
      }
    })
    const {
      // tray: mainTray,
      rightTrayWindow,
      rightTrayWindow_id,
      leftTrayWindow,
      leftTrayWindow_id,
    } = await tray.init(mainWindow)

    this.winMap.set(rightTrayWindow_id,rightTrayWindow)

    if(leftTrayWindow_id&&leftTrayWindow){
      this.winMap.set(leftTrayWindow_id,leftTrayWindow)
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
      this.winMap.set(winID,newWindow)
      newWindow.show()
    })

    newWindow.on('closed', () => {
      this.winMap.delete(winID)
      if (this.winMap.get('main')) {
        mainWin.show()
      }
    })
  }
}

interface NewWindow {
  router: { path: string; query?: any } | string
  config: BrowserWindow
}
