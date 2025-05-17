<template>
  <div class="rightWindow">
    <a-button style="width: 100%" type="link" v-for="(item,index) in list" :key="index" @click="item.click"> {{item.title}}</a-button>
  </div>
</template>

<script setup lang="ts">
import {rendererBetweenMessage} from '../module'
const list = ref([
  {
    title: 'show',
    click: () => {
      console.log('show')

      send('i m the reply message from right')
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



const{send,on} = rendererBetweenMessage({ myFrom: 'right'})

on((args)=>{
  console.log('rightToMain-----------',args)
  // event.sender.send('mainTrayIcon', {
  //   type: 'mainAndTrayToMessage',
  //   data: {
  //     type: 'rightToMain',
  //     data: 'my from right message!',
  //   },
  // })
  send('i m the reply message from right')
})
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  border-radius: 2px;
  background-color: #fff;
  padding: 3px;
  &-title{
    line-height: 30px;
    font-size: 12px;
    width: 100%;
  }
}

</style>
