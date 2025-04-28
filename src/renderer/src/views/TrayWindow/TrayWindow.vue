

<template>
  <div class="TrayWindow" @mouseenter="mouseenter" @mouseleave="mouseleave">
    TrayWindow
  </div>
</template>
<script setup lang="ts">

const mouseenter = () => {
  // console.log('mouseenter')
  window.electron.ipcRenderer.send('mainTrayWindow', {
    type:'mouseToWindow',
    data:{
      status: true
    }

  })
}
const mouseleave = () => {
  // console.log('mouseleave')
  window.electron.ipcRenderer.send('mainTrayWindow', {
    type:'mouseToWindow',
    data:{
      status: false
    }
  })
}
</script>
<style scoped lang="scss">
.TrayWindow{
  width: 100vw;
  height: 100vh;
  background-color: #0b57d0
}
</style>