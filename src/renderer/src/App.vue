<template>
  <!--  data-theme="theme-light"-->
  <RouterView />
</template>

<script lang="ts" setup>
const initPassWord = ref('321')
onMounted(async () => {
  const getPassWord = sessionStorage.getItem('initPassword') || ''
  if (!getPassWord) {
    sessionStorage.setItem('initPassword', initPassWord.value)
  }
})
window.electron.ipcRenderer.on('clickTrayIconParams', (_event, args) => {
  console.log('clickTrayIconParams', args)
})
</script>

<style lang="scss" scoped></style>
