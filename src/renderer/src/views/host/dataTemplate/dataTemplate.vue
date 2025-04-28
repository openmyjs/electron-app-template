

<template>
  <div>
    <a-button type="default" @click="addTemplate">创建模版</a-button>
  </div>
</template>
<script setup lang="ts">
const router = useRouter()
const addTemplate = () => {
  console.log('addTemplate')
  router.push({
    path: '/host/dataTemplate/add'
  })
}
</script>
<style scoped lang="scss">

</style>