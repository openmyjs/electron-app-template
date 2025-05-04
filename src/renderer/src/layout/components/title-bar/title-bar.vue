<template>
  <div class="title-bar">
    <div class="nav-app-region" @dblclick="dblclick"></div>
    <div class="title-bar-nav center">
      <!--      <LeftOutlined v-if="backIconState" class="title-bar-nav-leftIcon" @click="router.back()" />-->
    </div>
    <div class="title-bar-area x-c-r" @mouseleave="mouseleave">
      <div class="title-bar-area-iconList x">
        <a-dropdown :trigger="['contextmenu']" v-model:open="dropdownOpen">
          <div class="title-bar-area-iconList-mini" @click="moreTap">
            <SvgIcon hover="#fff" type="more" size="15px" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
                <template #icon>
                  <SvgIcon type="theme-light-dark" size="15px" />
                </template>
                <div class="x-c-l">
                  <a-switch v-model:checked="theme" size="default" @change="switchChange">
                    <template #checkedChildren>
                      <SvgIcon type="daytime" size="10px" />
                    </template>
                    <template #unCheckedChildren>
                      <SvgIcon type="night" size="10px" />
                    </template>
                  </a-switch>
                </div>
              </a-menu-item>
              <a-sub-menu key="sub1" :title="langName">
                <template #icon>
                  <SvgIcon type="lang" size="15px" />
                </template>
                <a-menu-item v-for="(item, index) in langList" :key="index" @click="langTap(item)">
                  <template #icon>
                    <SvgIcon :type="item.icon" size="15px" />
                  </template>
                  {{ item.label }}
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </template>
        </a-dropdown>

        <div class="center" style="width: 2px; height: 100%">
          <div style="width: 1px; height: 30%; background-color: var(--text-color)"></div>
        </div>

        <div class="title-bar-area-iconList-mini" @click="minimize">
          <SvgIcon hover="#fff" type="minimize" size="15px" />
        </div>

        <div class="center" style="width: 2px; height: 100%">
          <div style="width: 1px; height: 30%; background-color: var(--text-color)"></div>
        </div>

        <div class="title-bar-area-iconList-mini" @click="exit">
          <SvgIcon hover="#fff" type="winClose" size="15px" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { LeftOutlined } from '@ant-design/icons-vue'
import SvgIcon from '@renderer/components/icon.vue'
// 处理拖动事件
import { bindDragEvent } from 'electron-drag-window/renderer'
const router = useRouter()
const props = defineProps({
  themeName: {
    type: String,
    default: 'light'
  },
  lang: {
    type: String,
    default: 'en'
  }
})
const backIconState = computed(() => {
  return router.currentRoute.value.path !== '/'
})
const emit = defineEmits(['change'])

const theme = ref(props.themeName === 'light')

watch(
  () => props.themeName,
  (newValue) => {
    theme.value = newValue === 'light'
  }
)

const langName = computed(() => {
  return langList.value.filter((item) => item.value === props.lang)[0].label
})

const dropdownOpen = ref(false)

const moreTap = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const minzeStatus = ref()
const dblclick = () => {
  // console.log('dblclick')
  // minzeStatus.value = !minzeStatus.value
  // if(!minzeStatus.value){
  //   electron.unmaximize()
  // }else{
  //   electron.maximize()
  // }
}
const langList = ref([
  {
    label: 'English',
    value: 'en',
    icon: 'english'
  },
  {
    label: '简体中文',
    value: 'zh',
    icon: 'chinese'
  }
])

const langTap = (e) => {
  dropdownOpen.value = false
  emit('change', { type: 'lang', data: e.value })
  // console.log('langTap',e)
}

const minimize = () => {
  electron.minimize()
}
const switchChange = (e: boolean) => {
  // console.log('switchChange',e)
  switch (e) {
    case true:
      emit('change', { type: 'theme', data: 'light' })
      break
    case false:
      emit('change', { type: 'theme', data: 'dark' })
      break
    default:
      break
  }
}
// const router  = useRouter()
const exit = () => {
  electron.close()
}

const mouseleave = () => {
  // moreTap()
}
onMounted(() => {
  // console.log('theme',props.themeName)
  bindDragEvent(window.electron.ipcRenderer.send, {
    dragMode: 1,
    appointClassNames: ['title-bar']
  })
})
</script>
<style scoped lang="scss">
.nav-app-region {
  //-webkit-app-region: no-drag;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.title-bar {
  display: flex;
  //-webkit-app-region: drag; // 仅适用于 Electron 环境
  height: 45px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  &-nav {
    width: 50px;
    height: 100%;
    &-leftIcon {
      color: #ccc;
      &:hover,
      &:active {
        color: #6e6e6e;
      }
    }
  }
  &-area {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    &-iconList {
      //-webkit-app-region: no-drag;
      margin-right: 10px;
      height: 30px;
      border-radius: 30px;
      background-color: #dcd9d9;
      &-mini {
        position: relative;
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        //background-color: #741baf;
      }
    }
  }
}
</style>
