<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- 事件的委派|事件委托 -->
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过度动画 -->
        <transition name="sort">
          <!-- 三级联动 -->
          <div class="sort" v-show="show">
            <!-- 利用事件委派和编程式导航实现路由的跳转与参数的传递 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item bo"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                :class="{ cur: currentIndex === index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二级，三级分类 -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === index ? 'block' : 'none',
                  }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// 引入了lodash的全部功能
// 按需引入 lodash
import throttle from "lodash/throttle";

export default {
  data() {
    return {
      //存储用户鼠标移动到哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  name: "TypeNav",
  // 组件挂载完毕就可以向服务器发请求
  mounted() {
    // 当组件挂载完毕，让show的属性变为false
    // 如果不是home路由组件，将TypeNav隐藏
    if (this.$route.path !== "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      // 右侧需要的是一个函数，当使用这个计算属性的时候右侧的函数会立即执行一次，注入一个参数state，其实即为大仓库中的数据
      categoryList: (state) => {
        return state.home.categoryList;
      },
    }),
  },
  methods: {
    // 鼠标进入，修改响应式数据currentIndex
    /* changeIndex(index){
            this.currentIndex = index
            // console.log('鼠标进入',index)
        }, */

    // 节流写法  注意throttle回调函数别用箭头函数会出现this的指向问题
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),

    // 一级分类鼠标移除事件的回调
    leaveIndex() {
      this.currentIndex = -1;
      // 鼠标移除  search组件的三级组件不展示
      if (this.$route.path !== "/home") {
        this.show = false;
      }
    },

    // 进行路由跳转的方法
    goSearch(even) {
      //最好的解决方案是用编程式导航+事件委派
      // 事件委派把全部的子节点的事件委派给父节点，当点击a标签的时候才进行路由的跳转
      // 利用事件委派存在的问题：1.怎么知道点击的一定是a标签  2.如何获取参数[1.2.3级分类的名字和id]
      // 即使能够确定点击的是a标签，那又如何区分一级二级三级标签
      // 1.把子节点当中a标签，加上自定义属性 data-categoryName,其余的子节点是没有的
      let element = even.target;
      // 获取到被当前这个事件触发的节点[h3，a，dt，dl]，后续需要判断节点是否带有data-categoryName,如果带一定是a标签
      // 节点有一个属性dataset属性，可以获取节点的自定义属性，与属性值，可以以此来判断是否带有categoryName自定义属性
      let { categoryname, category1id, category2id, category3id } = element.dataset;
      // 如果有categoryName一定是a标签
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: "search" };
        let query = { categoryName: categoryname };
        // 几级分类
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else if (category3id) {
          query.category3Id = category3id;
        }
        location.query = query;
        // 判断 如果路由跳转的时候带有params参数，则需要捎带传过去
        if (this.$route.params) {
          // 整理参数完毕
          location.params = this.$route.params;
        }
        // 路由的跳转
        this.$router.push(location);
      }
    },
    // 在search组件中 鼠标移入显示三级导航
    enterShow() {
      this.show = true;
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
    // 过度动画的样式
    // 过度动画开始状态（进入的开始状态）
    .sort-enter {
      height: 0px;
    }
    // 过度动画的结束状态
    .sort-enter-to {
      height: 461px;
    }
    // 定义动画的时间，速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>