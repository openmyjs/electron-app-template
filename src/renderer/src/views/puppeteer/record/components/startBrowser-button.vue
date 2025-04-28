<template>
  <a-dropdown-button @click="handleButtonClick">
    浏览器列表
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item v-for="(item) in menuList" :key="item.user_id">
          <UserOutlined />
          {{item.name}}: {{item.user_id}}:{{item.serial_number}}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown-button>
</template>
<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const emit = defineEmits(['update:BrowserNum']);
const props = defineProps({
  getBrowserInfo: {
    type: Function,
    default: ''
  }
});

const menuList:any = ref([])
const handleButtonClick =async (e: Event) => {
  console.log('click left button', e);
  const res = await props.getBrowserInfo()
   menuList.value = res.data.list
  console.log('getBrowserInfo------`', res)
};

const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
  emit('update:BrowserNum', e.key)
};

</script>

