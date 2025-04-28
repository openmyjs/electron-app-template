<template>
  <div class="f-wh100 layoutHostMenu">
    <div class="center layoutHostMenu-logo">
      <img
        src="@renderer/assets/logo.png"
        alt="logo"
        v-if="props.collapsed"  style="width: 15px;height: 15px"
      />
      <img
        src="@renderer/assets/logo.png"
        alt="logo"
        v-else style="width: 80px;height: 80px"
      />
<!--      <logo v-if="props.collapsed"  style="width: 15px;height: 15px" />-->
<!--      <logo v-else style="width: 80px;height: 80px" />-->
    </div>
    <a-divider />
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      class="layoutHostMenu-menu"
      mode="inline"
      :open-keys="state.openKeys"
      :items="items"
      @click="menuClick"
    ></a-menu>
  </div>
</template>
<script lang="ts" setup>
// import logo from '@renderer/assets/logo.png'
import {
  MenuFoldOutlined,
  UserOutlined,
  FieldTimeOutlined,
  RobotOutlined,
  AlignLeftOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const items = reactive([
  {
    key: '',
    icon: () => h(MenuFoldOutlined),
    label: '收录',
    title: '收录',
    children:[
      {
        key: '/yiyang/client',
        icon: () => h(UserOutlined),
        label: '客户',
        title: '客户',
      },
      {
        key: '/yiyang/staff',
        icon: () => h(RobotOutlined),
        label: '驾驶员',
        title: '驾驶员',
      },
      {
        key: '/yiyang/order',
        icon: () => h(AlignLeftOutlined),
        label: '订单',
        title: '订单',
      },

    ]
  },

  {
    key: '/yiyang',
    icon: () => h(FieldTimeOutlined),
    label: '订单排班',
    title: '订单排班',
  },
]);

const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
const router = useRouter();
const menuClick = (e:any)=>{
  router.push({
    path:e.key
  })
}
</script>
<style scoped lang="scss">
.layoutHostMenu {
  background-color: var(--bg-color-content);
  height: 100%;
  &-logo {
    height: 100px;
  }
  &-menu {
    height: calc(100% - 150px);
    background-color: var(--bg-color-content);
  }
}
</style>
