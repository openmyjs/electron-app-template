<template>
  <div class="rightWindow y-b-c">
    <div
      class="rightWindow-title f-button center"
      v-for="(item,index) in list" :key="index" @click="item.click"
    >
      {{item.title}}
    </div>
  </div>
</template>

<script setup lang="ts">

const list = ref([
  {
    title: 'show',
    click: () => {
      console.log('show')

      window.electron.ipcRenderer.send('mainTrayIcon', {
        type: 'mainAndTrayToMessage',
        data: {
          message: 'my from tray message',
        },
      })
    },
  },
  {
    title: 'exit',
    click: async() => {
      console.log('exit')
      await electron.exit()
    },
  },
])

interface MyFrom {
  myFrom: 'main' |  'left' | 'right'
}
const rendererBetweenMessage = (event:MyFrom) => {
  const channel = {
    main:{
      on:'MainToTrayMessage',
      send:''
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
  return {
    on:(callback:(event:any,args:any)=>void)=>{
      window.electron.ipcRenderer.on('MainToTrayRightMessage', (event, args) => {
        console.log('MainToTrayRightMessage', args)
        if(typeof callback==='function'){
          callback(event,args)
        }
      })
    },
    send:(data:any)=>{
      window.electron.ipcRenderer.send('mainTrayIcon', {
        type: 'MainToTrayRightMessage',
        data,
      })
    }
  }
}

onMounted(async () => {
  window.electron.ipcRenderer.send('mainTrayIcon', {
    type: 'setRightTraySize',
    data: {
      width:80,
      height:list.value.length * 30 + 10
    },
  })
})

</script>

<style scoped lang="scss">
.rightWindow{
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 2px;
  &-title{
    line-height: 30px;
    font-size: 12px;
    width: 100%;
  }
}

</style>
