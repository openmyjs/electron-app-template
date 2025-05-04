import { ipcMain, type BrowserWindow } from 'electron'
import request from './module/request'
import puppeteer from './module/puppeteer'
import fsExtra from './module/fsExtra'
import app from './module/app'
import everyDownLoad from './module/everyDownLoad'

export default async function ipcRenderer(winList: { id: string; win: BrowserWindow }[]) {
  // 注册 toIpcMainOnce 事件
  ipcMain.on('toIpcMainOnce', async (event, args) => {
    const { channel, type, data, winId } = args
    const filter = winList.filter((item) => item.id === winId)
    const moduleData = await moduleOnce[type](data, filter[0].win)
    event.senderFrame.send(channel, moduleData)
  })
  // 注册 toIpcMainOn 事件
  ipcMain.on('toIpcMainOn', async (event, args) => {
    const { channel, type, winId } = args
    const filter = winList.filter((item) => item.id === winId)
    event.senderFrame.send(channel, {
      channel,
      data: await moduleOn[type](filter[0].win)
    })
  })
}
const moduleOnce = {
  request,
  fsExtra,
  everyDownLoad,
  app
}
const moduleOn = {
  puppeteer
}
