<template>
  <div @click="send('i m the message from left')">
    leftWindow
  </div>
</template>
<script setup lang="ts">
import {rendererBetweenMessage} from '../module'

const{send,on} = rendererBetweenMessage({ myFrom: 'left'})

on((event)=>{
  console.log('rightToMain-----------',event)
  // event.sender.send('mainTrayIcon', {
  //   type: 'mainAndTrayToMessage',
  //   data: {
  //     type: 'rightToMain',
  //     data: 'my from right message!',
  //   },
  // })
  send('i m the reply message from left')
})
</script>

<style scoped lang="scss">

</style>
