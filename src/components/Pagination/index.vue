<template>
  <div class="pagination">
    <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="startNumAndEndNum.start>1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <button v-if="startNumAndEndNum.start>2">···</button>

    <!-- 中间部分 -->
    <div style="display:inline-block;" v-for="(page,index) in startNumAndEndNum.end" :key="index">
        <button  v-if="page>startNumAndEndNum.start-1" @click="$emit('getPageNo',page)" :class="{active:pageNo==page}">{{page}}</button>
    </div>
    
    <button v-if="startNumAndEndNum.end<totalPage-1">···</button>
    <button v-if="startNumAndEndNum.end<totalPage" @click="$emit('getPageNo',totalPage)" :class="{active:pageNo==totalPage}">{{totalPage}}</button>
    <button :disabled="pageNo==totalPage" @click="$emit('getPageNo',pageNo+1)">下一页</button>
    
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
    props:['pageNo','pageSize','total','continues'],
    computed:{
        // 计算出总共有多少页
        totalPage(){
          // 计算出来的结果要进行向上取整
          return Math.ceil(this.total/this.pageSize)
        },
        // 计算出连续页码的起始数字和结束数字 [连续页码至少是5]
        startNumAndEndNum(){
            // 先定义两个变量存储起始数据结束数据
            let start = 0 , end = 0
            // 连续页码数字是5  所以分页器至少5页  如果出现不正常的现象[就是不够五页]
            if(this.continues > this.totalPage){
                // 不正常，总页数没有连续的页码多
                start = 1
                end = this.totalPage
            }
            else {
                // 正常现象，总页数大于分页数
                start = this.pageNo - parseInt(this.continues/2)
                end = this.pageNo + parseInt(this.continues/2)
                // 把出现不正常的现象[start数字出现0或者负数] 
                if(start < 1)
                {
                  start = 1
                  end = this.continues
                };
                // [end出现大于总页数的情况]
                if(end > this.totalPage){
                  start = this.totalPage - this.continues + 1
                  end = this.totalPage
                }
            }
            return {start,end}
        }
    }
  }
</script>

<style lang="less" scoped>
  .pagination {
    text-align: center;
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;
      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: rgb(238, 75, 43);
        color: #fff;
      }
    }
  }
  
</style>