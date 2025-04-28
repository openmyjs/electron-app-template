import { onMounted, onUnmounted, ref } from 'vue'
import { uuid } from '@openmyjs/utils';
interface Config {
  host: string
  username: string
  password: string
  port: number
  verifyType: string
}
export default  function () {
  const { electron } = window
 //宿主APP路径
  const hostPath = ref('')
  const serverStatus = ref(1)
  let config: any
  //  启动 ssh2
  function start(con: Config) {

    if (con) {
      config = con
    }

    return new Promise((resolve, _reject) => {
      electron.ipcRenderer.once('ssh2/login', (_event, args) => {
        resolve(args)
      })
      electron.ipcRenderer.send('ssh2', {
        type: 'login',
        data: con
      })
    })
  }
  // 关闭 ssh2
  function close() {
    
    //删除所有 ipcRenderer 监听
    channelList.value.forEach(channel => {
      electron.ipcRenderer.removeAllListeners(channel)
    })
    if(serverStatus.value===0){
      electron.ipcRenderer.send('ssh2', { type: 'close', data: { host: config.host } })
    }
  }
  // 单向通讯 输入命令执行
  function exec(channel:string,command: string) {
    electron.ipcRenderer.send('ssh2', {
      type: 'exec',
      data: {
        host: config.host,
        channel,
        command
      }
    })
  }


  /**
   * 输入命令行,直接得到结果,适合快速得到结果的命令
   */

  function execOnce(command: string) {
    const channel = uuid(8, 16) 
    return new Promise((resolve, _reject) => {
      electron.ipcRenderer.once(`${channel}once`, (_event, args) => {
        resolve(args)
      })
      electron.ipcRenderer.send('ssh2', {
        type: 'exec',
        data: {
          host: config.host,
          command,
          channel
        }
      })
    })
  }

/**
 * 上传文件
 * @param channel 唯一标识  electron 把处理结果返回前端的on 监听的key
 * @param localDir 本地路径
 * @param remoteDir 远程路径
 * 
 */
  function upload(param:{channel:string,localDir:string,remoteDir:string}) {
    const {channel,localDir,remoteDir} = param
    electron.ipcRenderer.send('ssh2', {
      type: 'sftp',
      data: {
        localDir, // 数组和字符串路径 均可
        remoteDir,  // 远程路径,远端路径必须存在如果不存在会报错
        host: config.host, 
        channel, // 唯一标识  electron 把处理结果返回前端的on 监听的key
      }
    })
  }
  /**
   *  channel 列表 ,主要用于页面卸载的时候 删除监听
   */
  const channelList = ref<string[]>(['ssh2','ssh2/login'])
  /**
   * 监听结果
   * @param channel 唯一标识  electron 把处理结果返回前端的on 监听的key
   * @param callback 回调函数
   */
  function on(channel:string,callback:(res:any)=>void){
    if(!channelList.value.includes(channel)){
      channelList.value.push(channel)
    }
    electron.ipcRenderer.on(channel, (_event: any, arg: any) => {
      if(typeof callback === 'function'){
        callback(arg)
      }
    })
  }
  onMounted(async() => { 
    electron.ipcRenderer.on('ssh2/login', (_event, args) => {
      // console.log('ssh2/login', args);
      serverStatus.value = args.data.status
      
    })
    hostPath.value = await electron.ipcRenderer.invoke('processCWd')
    
  })

  onUnmounted(() => {
    close()
 
  })
  return {
    start,
    exec,
    execOnce,
    upload,
    on,
    hostPath
    
  }
}
