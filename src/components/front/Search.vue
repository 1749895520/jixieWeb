<template>
  <div>
    <!--    博客搜索栏   -->
    <div
        v-if="$store.state.frontPath.split('?')[0]==='/front/blog'||$store.state.frontPath.split('?')[0]==='/front/blogDetail'"
        class="front-search">
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
      <div style="margin-left: 20px">
        <el-button class="button-publish" type="primary" @click="reset">刷新</el-button>
        <el-button class="button-publish" type="primary" @click="gotoPublish()">发布博客</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Storage from "../../../public/storage";

let storage = new Storage()
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
    },
    gotoPublish() {
      if (storage.getItem('user')) {
        let routerGoto = this.$router.resolve('/center/publish/blog')
        window.open(routerGoto.href, '_blank');
      } else {
        this.$message.warning('请先登录再执行此操作(#^.^#)')
      }
    },
    reset() {
      this.$store.state.frontBlogName = ''
      this.load()
    },
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

.button-publish {
  border-radius: 20px;
  width: 80px;
}

</style>
