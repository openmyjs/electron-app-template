/** 与main IPC进程通讯 统一封装 Inter-Process Communication */

// import {IpcMain} from 'electron'
import { uuid } from '@openmyjs/utils';
/**
 * 单向通讯模拟双向通讯  类似 axios请求方式
 * 适用于 调用 node api
 * @param type // 指定分类函数
 * @param data  // 传入的数据
 * @example ipcMainOnce('request',data)
 * */
export function toIpcMainOnce(type: string,data: any):any {
  // 生成一个随机频道
  const channel = uuid(8, 16)
  return new Promise(async(resolve, _reject) => {
    // 获取当前窗口id
    const winId = sessionStorage.getItem('win-id')
    // 先创建一个单次监听事件
    window.electron.ipcRenderer.once(channel, (_event, args) => {
      resolve(args)
    })
    // 发送消息
    window.electron.ipcRenderer.send(`toIpcMainOnce`,{
      channel,
      type,
      data,
      winId
    })
  })
}
/**
 * 专门用启动用 send和on 单向通讯需要配合的方法
 * 原理是 先发送消息，启动一个方法 这个方法下需要使用到send和on
 * */
export function toIpcMainOn(type: string){
  // 生成一个随机频道
  const channel = uuid(8, 16)
  return new Promise(async(resolve, _reject) => {
    // 获取当前窗口id
    const winId = sessionStorage.getItem('win-id')
    // 先创建一个单次监听事件
    window.electron.ipcRenderer.once(channel, (_event, args) => {
      resolve(args)
    })
    // 发送消息
    window.electron.ipcRenderer.send(`toIpcMainOn`,{
      channel,
      type,
      winId
    })
  })
}

