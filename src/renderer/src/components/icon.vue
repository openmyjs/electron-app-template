<template>
  <svg
    aria-hidden="true"
    :style="{ height: size, width: size }"
    @mouseover="isHovered = true"
    @mouseout="isHovered = false"
    class="svg-icon"
  >
    <use :xlink:href="symbolId"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  //图标大小
  size: {
    type: [Number, String],
    default: '22px'
  },
  //图标颜色
  color: {
    type: String,
    default: ''
  },
  //是否开启hover效果

  //图标前缀，默认icon
  prefix: {
    type: String,
    default: 'icon'
  },
  //图标名称
  type: {
    type: String,
    default: ''
  }
})
const isHovered = ref(false)
const symbolId = computed(() => `#${props.prefix}-${props.type}`)
</script>

<style scoped lang="scss">
.svg-icon {
  fill: var(--text-color);
}
</style>
