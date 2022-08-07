<template>
  <div>
    <!--    博客搜索栏   -->
    <div
        v-if="$store.state.frontPath.split('?')[0]==='/front/blog'||$store.state.frontPath.split('?')[0]==='/front/blogDetail'"
        class="search-input front-search">
      <div>
        <el-input
            suffix-icon="el-icon-search"
            class="front-search-input"
            size="small"
            placeholder="请输入要查找的博客标题"
            v-model="$store.state.frontBlogName"></el-input>
      </div>
      <div>
        <el-button class="front-search-button" type="primary" @click="load">搜索</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Search",
  data() {
    return {}
  },
  methods: {
    load() {
      // 搜索时强制返回博客首页
      if (this.$route.path !== '/front/blog') {
        this.$router.push('/front/blog')
      }
      this.$emit('load')
    }
  }
}
</script>

<style scoped>
.front-search {
  display: flex;
  justify-content: center;
  margin: 12px;
  border-radius: 20px 0 20px 0;
  position: absolute;
  right: 20%;
}

.front-search-input >>> .el-input__inner {
  border-radius: 20px 0 0 20px !important;
}

.front-search-button {
  border-radius: 0 20px 20px 0 !important;
}

</style>
