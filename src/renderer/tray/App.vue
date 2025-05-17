<template>
  <div class="app">
        <RouterView />
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
</script>
<style scoped lang="scss">
.app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  //background-color: #813737;
  border-radius: 5px;
}
</style>
