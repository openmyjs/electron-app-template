

<template>
  <div>
    <a-button type="default" @click="addTemplate">创建数据组</a-button>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
const addTemplate = () => {
  router.push({
    path: '/host/dataList/add'
  })
}
</script>
<style scoped lang="scss">

</style>