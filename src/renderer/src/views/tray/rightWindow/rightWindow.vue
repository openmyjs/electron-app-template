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
