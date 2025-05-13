<template>
  <div class="home y">
    <div class="home-search x">
      <a-input
        class="home-input"
        :value="inputValue"
        ref="inputRef"
        placeholder="Hi,user"
        size="large"
        :bordered="false"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="input"
        :style="{ width: inputWidth + 'px' }"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
      <div class="home-search-r x-c-r" :style="{ width: `calc(100vw - ${inputWidth + 50}px)` }">
        <div class="center" style="width: 30px; height: 100%">
          <WindowsOutlined />
        </div>
      </div>
    </div>
    <a-button type="primary" @click="openWindow">
      打开新窗口
    </a-button>
    <a-button type="primary" @click="openTrayFlash">
      开启托盘图标闪动
    </a-button>
    <a-button type="primary" @click="closeTrayFlash">
      关闭托盘图标闪动
    </a-button>
    <a-button type="primary" @click="testMessage">
      test message
    </a-button>
  </div>
</template>

<script lang="ts" setup>

import { SearchOutlined, WindowsOutlined } from '@ant-design/icons-vue'

// 处理拖动事件
import { bindDragEvent } from 'electron-drag-window/renderer'

const inputRef: any = ref(null)
const inputValue = ref('')
const inputWidth = ref(100)
// 计算文本宽度的函数
function calculateTextWidth(text: string, font: string): number {
  if (text.length === 0) {
    return 0
  }
  // 创建一个离屏的 canvas 元素
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (context) {
    // 设置字体样式
    context.font = font

    // 使用 measureText 方法计算文本宽度
    const metrics = context.measureText(text)
    return metrics.width
  } else {
    console.error('Failed to get 2D rendering context for canvas')
    return 0
  }
}
const handleFocus = () => {}

const handleBlur = () => {
  // nextTick(() => {
  //   inputRef.value.focus()
  // })
}

const input = (e: any) => {
  const getWidth = calculateTextWidth(e.target.value, '16px Arial') + 70
  inputWidth.value = getWidth > 500 ? 500 : getWidth
  inputValue.value = e.target.value
}



const openWindow = () => {
  window.electron.ipcRenderer.send('createWindow', {
    router:{
      path: '/login'
    },
    // width: 1000,
    // height: 212,
  })
}
const openTrayFlash = () => {
  window.electron.ipcRenderer.send('mainTrayIcon', {
    type: 'openMainTrayFlash',
    data: {
      // 动态配置 FlashIcon 窗口尺寸大小
      config:{
        width: 100,
        height: 400
      },
      // 当点击tray icon 的时候  跳转到main window 需要传递的参数
      param:{
        test:  'test-------1'
      }
    }
  })
}

const testMessage = () => {
  window.electron.ipcRenderer.send('mainTrayIcon', {
    type: 'mainAndTrayToMessage',
    data: {
      message: 'my from main message!'
    }
  })
}

const closeTrayFlash = () => {
  window.electron.ipcRenderer.send('mainTrayIcon', {
    type: 'closeMainTrayFlash',
  })
}
onMounted(() => {
  nextTick(() => {
    inputRef.value.focus()
  })
})
onMounted(() => {
  // electron.setSize({
  //   width: 1000,
  //   height: 212,
  // })
  // console.log('theme',props.themeName)
  bindDragEvent(window.electron.ipcRenderer.send, {
    dragMode: 1,
    appointClassNames: ['home-search-r']
  })

})
</script>

<style scoped lang="scss">
.home {
  //width: 100vw;
  //height: 100vh;
  gap: 5px;
  &-search {
    position: relative;
    background-color: var(--bg-color-content);
    border-radius: var(--border-radius-win-page);
    &-input {
      min-width: 100px;
      max-width: 500px;
      //宽度变化 动画效果
      //transition: width 0.3s ease-in-out;
    }
    &-r {
      position: absolute;
      right: 0;
      top: 0;
      height: 40px;
      //background-color: red;
    }
  }
  &-lately {
    width: 100%;
    height: 100%;
    background-color: var(--bg-color-content);
    border-radius: var(--border-radius-win-page);
    padding: 10px;
    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
}
</style>
