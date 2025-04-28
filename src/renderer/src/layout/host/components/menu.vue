<template>
  <div class="f-wh100 layoutHostMenu">
    <div class="center layoutHostMenu-logo">
      <logo v-if="props.collapsed"  style="width: 15px;height: 15px" />
      <logo v-else style="width: 80px;height: 80px" />
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
import logo from '@renderer/assets/vue.svg'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
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
    key: '/host/dataTemplate',
    icon: () => h(PieChartOutlined),
    label: '数据管理',
    title: '数据管理',
    children:[
      {
        key: '/host/dataList',
        icon: () => h(PieChartOutlined),
        label: '数据列表',
        title: '数据列表',
      },
      {
        key: '/host/dataTemplate',
        icon: () => h(PieChartOutlined),
        label: '模板列表',
        title: '模板列表',
      },

    ]
  },

  {
    key: '2',
    icon: () => h(PieChartOutlined),
    label: '脚本管理',
    title: '脚本管理',
  },
  {
    key: '3',
    icon: () => h(DesktopOutlined),
    label: '代理管理',
    title: '代理管理',
  },
  {
    key: '4',
    icon: () => h(DesktopOutlined),
    label: '设备列表',
    title: '设备列表',
  },

  {
    key: '5',
    icon: () => h(DesktopOutlined),
    label: '执行日志',
    title: '执行日志',
  }
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
