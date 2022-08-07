<template>
  <div>
    <el-menu
        :default-active="this.$store.state.frontPath"
        class="el-menu-demo front-top-menu"
        router
        mode="horizontal"
        @select="handleSelect">
      <el-menu-item class="front-menu" index="/front/home">协会首页</el-menu-item>
      <el-menu-item class="front-menu" index="/front/data">协会资料</el-menu-item>
      <el-menu-item class="front-menu" index="/front/blog">协会博客</el-menu-item>
      <el-menu-item class="front-menu" index="/front/more">更多</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    handleSelect(key) {
      this.$store.state.frontPath = key
    },
  }
}
</script>

<style lang="less" scoped>
.front-top-menu {
  height: 60px;
  margin-left: 30px;

  .el-menu-item {
    width: auto;
    color: #000;
    align-content: center;
  }

  .el-menu-item:hover {
    background-color: #d0e7f6;
    color: #fff;
  }

  .el-menu-item:focus {
    background-color: #c7e5f9;
    color: #fff;
  }

  .is-active {
    background-color: #c7e5f9;
    color: #fff;
    border-bottom: 0;
    border-top: 3px solid #5eabffAA;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.15);
  }

}

.front-menu {
  position: relative;
  width: 100px;
  background-color: transparent;
  border: 0;
}
</style>
