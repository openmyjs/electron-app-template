<template>
  <a-card title="配置页面">
    <a-card-grid
      v-for="(item, index) in list"
      :key="index"
      class="f-button f-wh100"
      style="width: 25%; height: 25%; text-align: center"
    >
      {{ item.title }}
    </a-card-grid>
  </a-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const list = ref([
  {
    title: '添加数据库',
    content: 'Card Content'
  }
])
</script>
<style scoped lang="scss"></style>
