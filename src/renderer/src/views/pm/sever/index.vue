<template>
  <div class="addEnvironment">
    <addEnvironment  :ssh="ssh" />
    <!--    <environmentList />-->
  </div>
</template>
<script setup lang="tsx">
import addEnvironment from './components/addEnvironment/addEnvironment.vue'
// import environmentList from './components/environment-list/environment-list.vue'
import { ref, onMounted } from 'vue'
import ssh2 from '@renderer/hooks/ssh2'
const { start, exec, execOnce, upload ,on,hostPath} = ssh2()
const ssh = ref({
  start,
  exec,
  execOnce,
  upload,
  on,
  hostPath
})

onMounted(async () => {
  // const res = await start({
  //   host: '47.113.184.182',
  //   username: 'root',
  //   password: 'AAxiaoyu001',
  //   port: 22,
  //   verifyType: 'password'
  // })
  // console.log('res',res);
  // setTimeout(async () => {
  //   const res2 = await execOnce('docker ps')
  // console.log('res2',res2);
  // }, 500);
  
  // console.log(getPath.filePaths[0]);

  //  upload()
})
</script>
<style scoped lang="scss">
.addEnvironment {
  width: 100%;
  height: 100%;
}
</style>
