<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <!-- 可以添加返回首页的链接 -->
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  console.log('router', router)
})
</script>

<style scoped>
.not-found {
  /* 你的样式 */
}
</style>
