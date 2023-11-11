<template>
  <div class="swiper-container" ref="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slider,index) in skuImageList" :key="slider.id">
        <img :class="{active:isShow === index}" @click="changeStyle(index,slider.imgUrl)" :src="slider.imgUrl">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  export default {
    data() {
      return {
        isShow:0
      }
    },
    name: "ImageList",
    props:['skuImageList'],
    methods: {
      changeStyle(index,imgUrl){
        this.isShow = index
        // 点击哪张图就让上面的框中（兄弟组件）显示哪张图
        this.$bus.$emit('postImg',imgUrl)
        // this.$bus.$emit('postImg',this.isShow)
      }
    },
    watch:{
      // 监听数据：可以保证数据一定是好的，但是不能保证v-for遍历的结构是否完事
      skuImageList(){
        this.$nextTick(()=>{
          new Swiper (this.$refs.floor1Swiper,{
            pagination:{
                el:'.swiper-pagination',
            },
            navigation:{
                nextEl:'.swiper-button-next',
                prevEl:'.swiper-button-prev'
            },
            // 显示几个图片
            slidesPerView: 3,
            // 一次享有移动两个图片
            slidesPerGroup:2,
          });
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>