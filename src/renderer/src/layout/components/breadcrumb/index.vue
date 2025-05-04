<template>
  <div class="layoutBreadcrumb y">
    <div class="layoutBreadcrumb-bc">
      <a-breadcrumb>
        <a-breadcrumb-item v-for="(item, index) in list" :key="index" @click="tap(item.path)" class="f-pointer">
          <!--        <p @click="tap(item.path)">{{ t(item.i18nName) }}</p>-->
          {{ t(item.i18nName) }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="layoutBreadcrumb-page">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import createBreadcrumb from './hooks/createBreadcrumb'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { list } = createBreadcrumb()
import { useRouter } from 'vue-router'
const router = useRouter()
const tap = (path: string) => {
  // console.log('breadcrumb/path', path)
  router.push(path + '?breadcrumb=true')
}
</script>

<style scoped lang="scss">
$BreadcrumbHeight: 30px;
.layoutBreadcrumb {
  width: 100%;
  height: 100%;
  /* 黑色虚线，2像素宽 */
  &-bc {
    width: 100%;
    height: $BreadcrumbHeight;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  &-page {
    width: 100%;
    padding-top: 5px;
    height: calc(100% - $BreadcrumbHeight);
  }
}
</style>
