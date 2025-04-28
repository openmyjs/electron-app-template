<template>
  <a-layout class="f-wh100" >
    <a-layout-sider class="hostMenu" v-model:collapsed="collapsed">
      <div class="f-wh100 f-scroll-y f-no-scroll hostMenu-page">
        <menuList :collapsed="collapsed" />
        <div class="hostMenu-page-arrow f-button" @click="collapsed = !collapsed">
          <RightCircleOutlined :rotate="collapsed? 0 : 180" style="font-size: 15px" />
        </div>
      </div>
    </a-layout-sider>
    <a-layout class="hostLayout">
      <a-layout-header class="hostHeader" >
        <div class="f-wh100 hostHeader-page">

        </div>
      </a-layout-header>
      <a-layout-content class="hostContent">
        <div class="hostContent-page f-scroll-y f-no-scroll">
          <RouterView />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import menuList from './menu.vue'
import {
  RightCircleOutlined
} from '@ant-design/icons-vue'
const collapsed = ref(false)

const collapse= ()=>{
  console.log('breakpoint')
}
</script>
<style scoped lang="scss">
$headerHeight:60px;
.hostMenu{
  height:100%;
  background-color: var(--bg-color);
  padding: 8px 2px 8px 8px;
  position: relative;
  &-page {
    background-color: var(--bg-color-content);
    border-radius:var(--border-radius-lg);
    &-arrow {
      position: absolute;
      right: -10px;
      top: 20px;
      border-radius: 30px;
    }
  }
}
.hostHeader{
  width: 100%;
  height: $headerHeight;
  padding: 8px 8px 2px 2px;
  background-color: var(--bg-color);
  &-page{
    background-color: var(--bg-color-content);
    border-radius:var(--border-radius-lg);
  }
}
.hostLayout{
  width: 100%;

  background-color: var(--bg-color);
}

.hostContent{
  height:100%;
  width: 100%;
  background-color: var(--bg-color);
  padding: 2px 8px 8px 2px;
  &-page {
    height:100%;
    width: 100%;
    border-radius:var(--border-radius-lg);
    //超出范围 不显示
    overflow: hidden;
  }
}
</style>
