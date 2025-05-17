import { forEach } from 'lodash'


interface MyFrom {
  myFrom: 'main-left' | 'main-right' |  'left' | 'right'
}
let onList: MyFrom['myFrom'][] = []
export const rendererBetweenMessage = (event:MyFrom) => {
  onList.push(event.myFrom)
  console.log('onList',onList)
  const {myFrom} = event
  const channel = {
    'main-left':{
      on:'trayToMainLeftMessage',
      send:'mainToLeft'
    },
    'main-right':{
      on:'trayToMainRightMessage',
      send:'mainToRight'
    },
    left:{
      on:'MainToTrayLeftMessage',
      send:'leftToMain'
    },
    right:{
      on:'MainToTrayRightMessage',
      send:'rightToMain'
    }
  }
  onMounted(()=>{
    onList = []
  })
  onUnmounted(()=>{
    onList.forEach((item:MyFrom['myFrom'])=>{
      window.electron.ipcRenderer.removeListener(channel[item].on,()=>{})
    })
  })


  return {
    on:(callback:(args:any)=>void)=>{
      window.electron.ipcRenderer.on(channel[myFrom].on, (_event, args) => {
        // console.log('MainToTrayRightMessage', args)
        if(typeof callback==='function'){
          callback(args)
        }

      })
    },
    send:(data:any)=>{
      window.electron.ipcRenderer.send('mainTrayIcon', {
        type: 'mainAndTrayToMessage',
        data: {
          type: channel[myFrom].send,
          data: data,
        },
      })
    }
  }

}