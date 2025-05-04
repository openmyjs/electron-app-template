import { app } from 'electron'
export default async function (args: any, win: any) {
  const { type, data } = args

  return way[type](data, win)
}
// let originalBounds:any
const way = {
  version: () => {
    return app.getVersion()
  },
  exit: () => {
    app.quit()
  },
  close: (_data: any, win: any) => {
    win.close()
  },
  minimize: (_data: any, win: any) => {
    win.minimize()
  },
  maximize: (_data: any, win: any) => {
    // // 存储窗口的原始尺寸
    // originalBounds = win.getBounds()
    win.maximize()
  },
  unmaximize: (_data: any, win: any) => {
    win.unmaximize()
  },
  setSize: (data: { width: number; height: number; x?: number; y?: number }, win: any) => {
    // console.log('setSize',data)
    // win.setSize(data.width, data.height)
    // win.setBounds({
    //   // x: 100, // 窗口左上角的 X 坐标
    //   // y: 100, // 窗口左上角的 Y 坐标
    //   width: data.width, // 宽度
    //   height: data.height, // 高度
    // });
    win.setBounds(data)
  },
  hide: (_data: any, win: any) => {
    win.hide()
  },
  show: (_data: any, win: any) => {
    win.show()
  }
}
