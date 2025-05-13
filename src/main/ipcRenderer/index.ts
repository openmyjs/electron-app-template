import { ipcMain, type BrowserWindow } from 'electron'
import request from './module/request'
import puppeteer from './module/puppeteer'
import fsExtra from './module/fsExtra'
import app from './module/app'
import everyDownLoad from './module/everyDownLoad'

export default async function ipcRenderer(winMap: Map<string,BrowserWindow>) {
  // 注册 toIpcMainOnce 事件
  ipcMain.on('toIpcMainOnce', async (event, args) => {
    const { channel, type, data, winId } = args
    const win = winMap.get(winId)

    const moduleData = await moduleOnce[type](data, win)
    event.senderFrame.send(channel, moduleData)
  })
  // 注册 toIpcMainOn 事件
  ipcMain.on('toIpcMainOn', async (event, args) => {
    const { channel, type, winId } = args
    const win = winMap.get(winId)
    event.senderFrame.send(channel, {
      channel,
      data: await moduleOn[type](win)
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
