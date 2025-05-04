// utils/api.js
import { OpenDialogOptions } from 'electron'
import { toIpcMainOnce, toIpcMainOn } from './IpcMain'
import { uuid } from '@openmyjs/utils'
export const electron = {
  /**
   * 选择文件
   * url: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogwindow-options
   * @param options 选项
   * @return 文件路径
   * @example
   *  electron.chooseFile({
   *    properties: ['openFile', 'multiSelections'],
   *    filters: [{ name: 'Images',
   *    extensions: ['jpg', 'png', 'gif'] }],
   *  })
   * */
  chooseFile: async (options: OpenDialogOptions) => {
    return await toIpcMainOnce('fsExtra', {
      type: 'chooseFile',
      data: options
    })
  },
  /**
   * 读取文件
   * url: https://www.electronjs.org/zh/docs/latest/api/dialog#dialogshowopendialogwindow-options
   * @param filePath 文件路径
   * @return 文件内容
   * @example
   *  electron.readFile('filePath')
   * */
  readFile: async (filePath: string): Promise<string> => {
    return await toIpcMainOnce('fsExtra', {
      type: 'readFile',
      data: filePath
    })
  },
  /** 新增文件
   * @param args.savePath 文件路径
   * @param args.fileName 文件名
   * @param args.content 文件内容
   * @param args.ensureDir 是否创建目录 确保路径存在
   * @example
   * await electron.createFile( { savePath: '/path/to/file.txt', content: 'Hello, world!' });
   * */
  createFile: async (args: { savePath: string; fileName: string; content: string; ensureDir?: boolean }) => {
    return await toIpcMainOnce('fsExtra', {
      type: 'createFile',
      data: args
    })
  },
  /**
   * 判断路径是否存在
   * @param path 路径
   * @return boolean
   * @example
   *  electron.exists('/path/to/file.txt')
   * */
  async exists(path: string): Promise<boolean> {
    return await toIpcMainOnce('fsExtra', {
      type: 'exists',
      data: path
    })
  },
  /**
   * 读取路径下所有目录和文件
   * @param path 路径
   * */
  readDir: async (path: string) => {
    return await toIpcMainOnce('fsExtra', {
      type: 'readDir',
      data: path
    })
  },
  /** main request 主进程使用axios请求
   * @param data 请求数据
   * @example
   *  electron.request({
   *    url: 'https://www.baidu.com/api',
   *    method: 'post',
   *    body: {}
   *    params: {}
   *  })
   * */
  request: async (data: { url: string; method: string; data?: any }) => {
    const res: any = await toIpcMainOnce('request', data)
    if (res.status) {
      return res.data
    } else {
      console.log('src/utils/electronAPI/index.ts/electron.request', res)
    }
  },
  /**
   * puppeteer
   * @example
   *  electron.puppeteer.start()
   *  electron.puppeteer.send({
   *    type:'newPageGoto',
   *    data:{}
   *  })
   * */
  puppeteer: {
    // 启动puppeteer
    start: async (): Promise<any> => {
      const res: any = await toIpcMainOn('puppeteer')
      return res.data
    },
    // 发送消息
    send: (data: { type: string; data?: any }): void => {
      window.electron.ipcRenderer.send('puppeteer', data)
    },
    // 监听消息
    on: (callback: (args: any) => void): void => {
      window.electron.ipcRenderer.on('puppeteer', (_event, args) => {
        callback(args)
      })
    },
    // 监听一次消息
    once: (callback: (args: any) => void): void => {
      window.electron.ipcRenderer.once('puppeteer', (_event, args) => {
        callback(args)
      })
    },
    // 监听一次消息 等到响应后移除监听
    handle: (data: { type: string; data?: any }): Promise<any> => {
      const channel = uuid(8, 16)
      return new Promise((resolve) => {
        window.electron.ipcRenderer.once(channel, (_event, args) => {
          resolve(args)
        })
        window.electron.ipcRenderer.send('puppeteerOnce', {
          channel,
          data
        })
      })
    },
    // 移除监听
    off: () => {
      window.electron.ipcRenderer.send('puppeteer', {
        type: 'off'
      })
      window.electron.ipcRenderer.removeAllListeners('puppeteer')
    }
  },
  /**
   * 下载文件
   * @param param.fileUrl 文件地址
   * @param param.savePath 保存路径
   * @param param.fileName 文件名
   * @param param.override 是否覆盖
   * @example
   *  electron.everyDownLoad({
   *    fileUrl: 'https://www.baidu.com/img/bd_logo1.png',
   *    savePath: '/Users/admin/Desktop/',
   *    fileName: 'baidu.png',
   })
    */
  async everyDownLoad(param: {
    fileUrl: string
    savePath: string
    fileName: string
    override?: boolean
  }): Promise<any> {
    const res = await toIpcMainOnce('everyDownLoad', param)
    // console.log('everyDownLoad',res)
    return res
  },
  /**
   * 获取版本号
   * @example
   *  electron.getVersion()
   * */
  async getVersion(): Promise<string> {
    return await toIpcMainOnce('app', {
      type: 'version'
    })
  },
  async close() {
    await toIpcMainOnce('app', {
      type: 'close'
    })
  },
  async exit() {
    await toIpcMainOnce('app', {
      type: 'exit'
    })
  },
  async minimize() {
    await toIpcMainOnce('app', {
      type: 'minimize'
    })
  },
  async maximize() {
    await toIpcMainOnce('app', {
      type: 'maximize'
    })
  },
  async unmaximize() {
    await toIpcMainOnce('app', {
      type: 'unmaximize'
    })
  },
  async setSize(data: { width: number; height: number; x?: number; y?: number }) {
    await toIpcMainOnce('app', {
      type: 'setSize',
      data
    })
  },
  async hide() {
    return await toIpcMainOnce('app', {
      type: 'hide'
    })
  }
}
