<template>
  <a-menu
    v-model:openKeys="openKeys"
    v-model:selectedKeys="menuKeys"
    style="width: 200px"
    mode="vertical"
    :items="items"
    @click="handleClick"
  />
</template>
<script lang="ts" setup>
import {
  MailOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const props = defineProps({
  selectedKeys:{
    type: String,
    default: () => 'click'
  }
})
const menuKeys = computed(()=>{
  return[props.selectedKeys]
})
const emit = defineEmits(['change'])
// const selectedKeys = ref(['click']);
const openKeys = ref([]);
const items = ref([
  {
    key: 'newPageGoto',
    icon: () => h(MailOutlined),
    label: '循环子脚本',
    title: 'newPageGoto',
  },
  {
    key: 'newPageGoto',
    icon: () => h(MailOutlined),
    label: 'newPageGoto',
    title: 'newPageGoto',
  },
  {
    key: 'click',
    icon: () => h(MailOutlined),
    label: 'click',
    title: 'click',
  },
  // {
  //   key: 'mouseClick',
  //   icon: () => h(CalendarOutlined),
  //   label: 'mouseClick',
  //   title: 'mouseClick',
  // },
  // {
  //   key: 'waitMouseClick',
  //   icon: () => h(CalendarOutlined),
  //   label: 'waitMouseClick',
  //   title: 'waitMouseClick',
  // },
  {
    key: 'input',
    icon: () => h(CalendarOutlined),
    label: 'input',
    title: 'input',
  },
  {
    key: 'upLoadFile',
    icon: () => h(CalendarOutlined),
    label: 'upLoadFile',
    title: 'upLoadFile',
  },
  {
    key: 'select',
    icon: () => h(CalendarOutlined),
    label: 'select',
    title: 'select',
  }
]);
const handleClick: MenuProps['onClick'] = menuInfo => {
  emit('change', menuInfo.key)
  // console.log('click ', menuInfo);
};
</script>

