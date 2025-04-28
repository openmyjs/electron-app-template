<template xmlns:a-col="http://www.w3.org/1999/xhtml">
  <div class="flex-center">

    <Form @change="FormChange"></Form>
<!--    <a-button type="primary" @click="tap">录制脚本</a-button>-->
<!--    <a-button type="primary" @click="dataV">dataV</a-button>-->
  </div>
</template>
<script setup lang="ts">
// import {CaretRightOutlined} from '@ant-design/icons-vue'
import Form from './components/form.vue'
// import browser from './hooks/browser'

const router = useRouter()

const tap = ()=>{
  router.push("/puppeteer/record")
}

const dataV = ()=>{
  router.push({
    path: '/puppeteer/dataV',
    query: {
      data: JSON.stringify({
        filePath: 'dataV',
        formData:{}
      })
    }
  })

}














const FormChange =async (data: any) => {
  console.log('FormChange', data)
}

</script>
<style>
.flex-center {
  display: flex;
  flex-direction: column;
}

.listButton {
  color: #ffffff;
  cursor: pointer;
}
</style>
