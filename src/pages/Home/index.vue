<template>
  <div>
      <!-- 三级联动的全局组件 它已经是全局组件了 不需要再在script中引入了 -->
      <TypeNav/>
      <ListContainer/>
      <Recommend/>
      <Rank/>
      <Like/>
      <Floor v-for="floor in floorList" :key="floor.id"  :list='floor'/>
      <Brand/>
      
  </div>
</template>

<script>
// 引入其余的组件
import ListContainer from '@/pages/Home/ListContainer'
import Recommend from '@/pages/Home/Recommend'
import Rank from '@/pages/Home/Rank'
import Like from '@/pages/Home/Like'
import Floor from '@/pages/Home/Floor'
import Brand from '@/pages/Home/Brand'
import {mapState} from 'vuex'


export default {
  name:'',
  components:{
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  mounted() {
      // 派发action获取floor组件的数据
      this.$store.dispatch('getFloor')
  },
  
  computed:{
  ...mapState({
      floorList:(state)=>{
          return state.home.floorList
      }
  })
  }
}
</script>

<style>

</style>