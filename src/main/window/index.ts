import { BrowserWindow, powerSaveBlocker, ipcMain, session, shell, Menu, Tray, app, nativeImage } from 'electron'
import { join ,resolve} from 'path'
import { is } from '@electron-toolkit/utils'
import ipcRenderer from '../ipcRenderer'
import { uuid } from '@openmyjs/utils';
// import nodeFetch from 'node-fetch'
// import TrayWindow from 'electron-tray-window'
interface MainTrayWindowConfig {
  width: number
  height: number
}
export class createWindow {
  // private nowShowWinId: string = ''
  private readonly winList: { id: string; win: BrowserWindow }[] = []

  private mainTrayWindowConfig: MainTrayWindowConfig = {
    width: 200,
    height: 500
  }

  constructor() {}

  /**
   * 创建主窗口
   * */
  public async main() {
    if (this.winList.length >= 1) {
      throw new Error('mainWindow is exist')
    }

    const winID = 'win_'+ uuid(10, 16)
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
      width: 800,
      height: 400,
      show: false,
      autoHideMenuBar: true,
      frame: false, // 是否边框窗口
      transparent: true, // 窗口透明
      // backgroundColor: '#00000000', // 背景颜色完全透明
      title: 'script tools',
      resizable: false, // 禁止调整窗口大小
      // ...(process.platform === 'linux' ? { icon } : {}),
      icon: resolve(__dirname, '../../resources/yiyang.ico'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      }
    })

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })
    //

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    const query = `?winId=${winID}`
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const mainUrl =process.env['ELECTRON_RENDERER_URL'] +query
      console.log('mainUrl', mainUrl)
      await mainWindow.loadURL(mainUrl)
      mainWindow.webContents.openDevTools({ mode: 'detach' })  //detach  //right
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')
      await mainWindow.loadFile(mainUrl,{
        query: {
          winId: winID
        },
      })
    }

    this.winList.push({
      id: winID,
      win: mainWindow
    })

    // 注册 createWindow 事件  其他位置可以调用 创建新的窗口
    ipcMain.on('createWindow', async (_event, args) => {
      console.log('createWindow', args)
    })

    // // 监听窗口获得焦点事件
    mainWindow.on('focus', () => {
      // focusedWindow = mainWindow;
    });

    // 监听窗口失去焦点事件
    mainWindow.on('blur', () => {
      // console.log('Main window blurred',winId);
      mainWindow.hide()
    });

    const minWidth = mainWindow.getMinimumSize()[0];
    const minHeight = mainWindow.getMinimumSize()[1];
    console.log(`最小宽度: ${minWidth}, 最小高度: ${minHeight}`);

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

    const trayIcon = resolve(__dirname, '../../resources/yiyang.ico')

    const appTray = new Tray(trayIcon)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示',
        icon: (() => {
          // --->注释
          const icon = nativeImage.createFromPath('resources/icon.png')
          // 调整图标大小（如果需要，但注意这可能不会影响菜单中的显示）
          // 通常菜单图标大小由系统决定，这里只是为了展示如何操作 nativeImage
          return icon.resize({ width: 16, height: 16 }) // 调整大小（可能不会在菜单中生效）
        })(),
        click: () => {
          mainWindow.show()
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])

    appTray.setToolTip(mainWindow.getTitle())
    // Call this again for Linux because we modified the context menu
    appTray.setContextMenu(contextMenu)

    console.log('appTray', appTray.getBounds())
    const trayInfo = appTray.getBounds()
    const trayWindow = new BrowserWindow({
      show: false,
      autoHideMenuBar: true,
      frame: false, // 是否边框窗口
      transparent: true, // 窗口透明
      title: 'trayWindow',
      // resizable: false, // 禁止调整窗口大小
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

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const mainUrl = join(process.env['ELECTRON_RENDERER_URL'], '/tray')
      await trayWindow.loadURL(mainUrl)
      // TrayWindow.webContents.openDevTools({ mode: 'right' })
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')
      await trayWindow.loadFile(mainUrl, {
        hash: '/tray'
      })
    }

    // 显示窗口
    const setTrayWindowShow = () => {
      trayWindow.setAlwaysOnTop(true)
      trayWindow.setSize(this.mainTrayWindowConfig.width, this.mainTrayWindowConfig.height)
      trayWindow.setPosition(trayInfo.x-(this.mainTrayWindowConfig.width/2), trayInfo.y - 500)
      trayWindow.focus()
      trayWindow.show()
    }

    // 隐藏窗口
    const setTrayWindowHide = () => {
      trayWindow.setAlwaysOnTop(false)
      trayWindow.blur()
      trayWindow.hide()
    }
    // 鼠标是否有进入窗口的状态
    let isMouseToTrayWindowStatus: boolean = false
    // 鼠标是否有进入图标的状态
    let isMouseToTrayIcon: boolean = false

    let messageStatus: boolean = false
    // 监听点击事件
    appTray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })

    // 监听鼠标进入 任务栏 图标
    appTray.on('mouse-enter', () => {
      if(messageStatus){
        isMouseToTrayIcon = true
        if (!isMouseToTrayWindowStatus) {
          setTrayWindowShow()
        }
      }
    })
    // 监听鼠标离开 任务栏 图标
    appTray.on('mouse-leave', () => {
      // console.log('mouse-leave')
      // TrayWindow.hide();
      if(messageStatus){
        isMouseToTrayIcon = false
        setTimeout(() => {
          if (!isMouseToTrayWindowStatus) {
            setTrayWindowHide()
          }
        }, 100)
      }
    })

    // Tray收到消息闪烁
    const trayFlicker = {
      isFlashing:false,
      flashInterval: null as NodeJS.Timeout | null,
      /**
       * 启动闪烁
       * */
       start:async () => {
         const originalIcon = trayIcon
        const nullImg = nativeImage.createFromPath('resources/nullIcon.png')
        let isFlashing = trayFlicker.isFlashing
        if (isFlashing) return; // 防止重复启动闪烁
        isFlashing = true;

        let toggle = true;

        // // 从网络加载图片
        // const response = await fetch(originalIcon);
        // if (!response.ok) {
        //   throw new Error(`Failed to load image: ${response.statusText}`);
        // }
        //
        // // 使用 arrayBuffer() 获取图片数据
        // const arrayBuffer = await response.arrayBuffer();
        //
        // // 将 ArrayBuffer 转换为 Buffer
        // const buffer = Buffer.from(arrayBuffer);
        //
        // // 使用 nativeImage 创建图片
        // const image = nativeImage.createFromBuffer(buffer);

        trayFlicker.flashInterval = setInterval(() => {
          appTray.setImage(toggle ? originalIcon : nullImg);
          toggle = !toggle; // 切换图标
        }, 500); // 每500毫秒切换一次
      },
      /**
       * 停止闪烁
       * */
      stop: () => {
        let isFlashing = trayFlicker.isFlashing
        let flashInterval = trayFlicker.flashInterval
        if (!isFlashing) return;
        isFlashing = false;
        if(flashInterval){
          clearInterval(flashInterval);
        }
        appTray.setImage(trayIcon); // 恢复正常图标
      }
    }
    //renderer tray  to main tray 统一通讯
    ipcMain.on('mainTrayWindow', async(_event, args) => {
      const { type, data } = args
      switch (type) {
        case 'mouseToWindow': //鼠标进入和离开 tray的窗口 事件
          isMouseToTrayWindowStatus = data.status
          if (data.status) {
            setTrayWindowShow()
          } else {
            setTimeout(() => {
              if (!isMouseToTrayIcon) {
                setTrayWindowHide()
              }
            }, 100)
          }
          break
        case 'messageToMainTrayWindow':  //消息到主窗口的托盘图标
          messageStatus = true
          this.mainTrayWindowConfig = data.config // 设置窗口配置 宽和高
          await trayFlicker.start()  //启动 闪烁
          break
        case 'messageToMainTrayWindowHide':
          messageStatus = false
          trayFlicker.stop()
          setTrayWindowHide()
      }
    })


    // //创建 window 系统的提示消息 类似与推送消息的弹窗样式
    // appTray.displayBalloon({
    //   title: '新消息',
    //   content: '您有一条新消息，请查看！',
    // });
  }

  private async newWindow (router: string): Promise<void> {

    if (this.winList.length >= 1) {
      throw new Error('mainWindow is exist')
    }
    const winID = 'win_' + uuid(16,16)
    // Create the browser window.
    const newWindow = new BrowserWindow({
      width: 800,
      height: 400,
      show: false,
      autoHideMenuBar: true,
      frame: false, // 是否边框窗口
      transparent: true, // 窗口透明
      // backgroundColor: '#00000000', // 背景颜色完全透明
      title: 'script tools',
      resizable: false, // 禁止调整窗口大小
      // ...(process.platform === 'linux' ? { icon } : {}),
      icon: resolve(__dirname, '../../resources/yiyang-256X256.ico'),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        contextIsolation: true, // 启用上下文隔离
        nodeIntegration: false, // 禁用 Node.js 集成
        webSecurity: true // 启用 Web 安全
        // devTools: false
      }
    })

    newWindow.on('ready-to-show', () => {
      newWindow.show()
    })
    //

    newWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    const query = `?winId=${winID}`
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const newWindowUrl = join(process.env['ELECTRON_RENDERER_URL'],router, query)
      await newWindow.loadURL(newWindowUrl)
      newWindow.webContents.openDevTools({ mode: 'detach' })  //detach  //right
    } else {
      const mainUrl = join(__dirname, '../renderer/index.html')
      await newWindow.loadFile(mainUrl,{
        query: {
          winId: winID
        },
        hash:router
      })
    }

    this.winList.push({
      id: winID,
      win: newWindow
    })



  }
}
