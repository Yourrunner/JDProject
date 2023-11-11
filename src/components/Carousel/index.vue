<template>
  <div class="swiper-container" ref="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  props: ["list"],
  name: "Carousel",
  watch: {
    list: {
      // 立即监听一次
      // 为什么watch监听不到list的变化  因为list从来没变化过（数据是父组件给的，给的时候就是一个对象，对象里面该有的都是有的）
      immediate: true,
      handler() {
        // 只能监听到数据已经有了,但是v-for动态渲染结构我们还是没有办法去确定的,因此还需要用到nextTick
        this.$nextTick(() => {
          new Swiper(this.$refs.floor1Swiper, {
            loop: true,
            pagination: {
              el: ".swiper-pagination",
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
</script>

<style>
</style>