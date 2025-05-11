<template>
  <electronTrayWindow type="left" :send="send">
    <theme>
      <router-view />
    </theme>
  </electronTrayWindow>
</template>
<script setup lang="ts">
import { electronTrayWindow } from '@openmyjs/electron/tray/renderer'
import theme from '../components/theme.vue'
const send = ref(window.electron.ipcRenderer.send)
</script>
<style scoped lang="scss"></style>
