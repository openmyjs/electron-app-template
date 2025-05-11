<!--主题/语言 统一配置-->

<template>
  <!--  data-theme="theme-light"-->
  <div class="layoutHome">
    <a-config-provider
      :locale="AntDesignLang"
      :theme="{
        algorithm: algorithm
      }"
    >
      <div class="layoutHome-content">
        <RouterView />
      </div>
    </a-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { theme as antTheme } from 'ant-design-vue'
import theme from '@renderer/hooks/theme'
// import LeftArrows from '@renderer/icon/file/LeftArrows.svg'
import vueI18n from '@renderer/hooks/I18n'

//-------------------语言------------------------------->
const { AntDesignLang, lang, setLang } = vueI18n()
//<-------------------语言-------------------------------

// -------------------主题------------------------------->

const { themeName, setTheme } = theme()

const algorithm = computed(() => {
  if (themeName.value === 'dark') {
    return antTheme.darkAlgorithm
  } else {
    return antTheme.defaultAlgorithm
  }
})
// <-------------------主题-------------------------------

</script>

<style lang="scss" scoped>
.layoutHome {
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  fill: var(--text-color-placeholder);
  border-radius: var(--border-radius-win-page);
  overflow: hidden;
  padding: 5px;
  &-content {
    width: 100%;
    height: 100%;
  }
}
</style>
