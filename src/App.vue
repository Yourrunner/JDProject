<template>
  <div>
      <Header></Header>
      <!-- 一级路由组件出口的地方 -->
      <router-view></router-view>

      <!-- Footer 在Home或者Search的时候式显示的，在登录或者注册的时候隐藏 -->
      <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'

export default {
  name:'App',
  components:{
    Header,
    Footer
  },
  mounted() {
    // 通知Vuex发请求，获取数据，存储在仓库中
    // 在App根组件中发送请求只用发一次，而放在路由组件中发请求则会在每次组件挂载的时候都发送请求，占用资源过多
    this.$store.dispatch('category')
  },
}
</script>

<style>

</style>
