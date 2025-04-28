<template>
  <div class="swiper">
    <div class="swiper-place x" :class="`transform-${current}`" :style="{ transitionDuration: duration + 'ms' }">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  current: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 400
  }
})
</script>
<style scoped lang="scss">
.swiper {
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  //overflow-x: auto;
  //white-space: nowrap;
  &-place {
    width: 100%;
    height: 100%;
    //transition: transform 0.5s ease-in-out;
    transition-property: transform;
    transition-timing-function: ease-in-out;
  }
}
@for $i from 1 through 10 {
  .transform-#{$i} {
    transform: translateX($i * -100%);
  }
}
</style>
