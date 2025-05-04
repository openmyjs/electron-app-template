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
</script>

<style lang="scss" scoped></style>
