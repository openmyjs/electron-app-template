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
    },
  },
  {
    title: 'exit',
    click: () => {
      console.log('exit')
    },
  },
])
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
