<template>
  <div class="downTimeIcon">
    {{ waitingTime }}
<!--    <button @click="startTiming">开始等待</button>-->
<!--    <button @click="stopTiming">停止等待</button>-->
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const waitingTime = ref(0); // 定义响应式变量，用于存储等待时间
let timer = null; // 定义一个变量，用于存储定时器的引用

// 定义开始计时的方法
const startTiming = () => {
  waitingTime.value = 0; // 重置等待时间
  timer = setInterval(() => {
    waitingTime.value++; // 每隔一秒，等待时间加一
  }, 1000);
};

// 定义停止计时的方法
const stopTiming = () => {
  clearInterval(timer); // 清除定时器
  timer = null; // 将定时器引用置为 null
};
onMounted(() => {
  startTiming(); // 在组件挂载时开始计时
});
// 在组件卸载时清除定时器
onUnmounted(() => {
  stopTiming();
});
</script>

<style scoped lang="scss">
.downTimeIcon{
  height: 22px;
  color: #5187e8;
}

</style>