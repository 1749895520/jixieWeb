<template>
  <div>

    <!--    主页面   -->
    <el-row id="main" :gutter="10" style="margin-top: 20px">
      <el-col :span="6" v-if="isfixTab && this.$store.state.windowSize==='lg'"
              style="border: 1px solid transparent"></el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="6">
        <el-card style="margin-bottom: 10px"
                 :class="{ 'fixed front-blog-person':isfixTab && this.$store.state.windowSize==='lg'}">
          <div class="front-name">
            <i class="el-icon-blue-4 front-name-icon"></i>
            <span class="front-name-title">置顶博客</span>
          </div>
          <div v-for="item in tableData" :key="item.id">
            <div v-if="item.top">
              <span class="front-blog-top-box"/>
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
              <span class="front-blog-top-group" @click="goto(item.id)">
                 {{ getTitle(item.name) }}
              </span>
              </el-tooltip>
              <span style="color: #aaa;position: relative;float: right">{{ item.time.substring(0, 10) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="18">
        <el-card>
          <div class="front-name">
            <i class="el-icon-blue-5 front-name-icon"></i>
            <span class="front-name-title">所有博客</span>
          </div>
          <div class="front-blog-main">
            <div class="front-blog-each" v-for="(item,index) in tableData" :key="item.id">
            <span class="front-blog-eachName" @click="goto(item.id)">{{
                item.name
              }}</span>
              <div class="pd-10 front-blog-eachUser">
                <i class="el-icon-my-user mr-1"></i>
                <span class="box-getUser" @click="gotoUser(item.userId)">{{ item.user }}</span>
                <i class="el-icon-my-time ml-5 mr-1"></i>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </div>
          <div style="padding: 10px 0;justify-content: space-around">
            <el-pagination
                class="box-pagination front-pagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
                v-show="this.$store.state.windowOrPhone">
            </el-pagination>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="box-pagination"
                background
                layout="prev, pager, next"
                :total="total"
                v-show="!this.$store.state.windowOrPhone">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Manage from "@/components/Manage";

export default {
  name: "Blog",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 7,
      content: '',
      user: '',
      time: '',
      isfixTab: false,
    }
  },
  components: {
    Manage,
  },
  created() {
    //  请求分页查询数据
    this.load()
  },
  mounted() {
    window.addEventListener('scroll', this.handleTabFix, true)
  },
  //离开当前组件前一定要清除滚动监听，否则进入其他路由会报错
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('scroll', this.handleTabFix, true)
    next()
  },
  methods: {
    load() {
      this.request.get("article/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.$store.state.frontBlogName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    reset() {
      this.$store.state.frontBlogName = ''
      this.content = ''
      this.user = ''
      this.time = ''
      this.load()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    goto(id) {
      let routerGoto = this.$router.resolve('/front/blogDetail?id=' + id)
      window.open(routerGoto.href, '_blank');
    },
    gotoUser(id) {
      let routerGoto = this.$router.resolve('/front/totalUser?id=' + id)
      window.open(routerGoto.href, '_blank');
    },
    handleTabFix() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#main').offsetTop
      scrollTop > offsetTop + 120 ? this.isfixTab = true : this.isfixTab = false
    },
    getTitle(name) {
      if (name.length > 5) {
        return name.substring(0, 5) + "..."
      } else {
        return name
      }
    }
  }
}
</script>

<style scoped>

/*  置顶博客框 */
.front-blog-top-box {
  width: 6px;
  height: 6px;
  background-color: #aaa;
  position: relative;
  top: 14px;
  margin-left: 10px;
  display: flex;
}

.front-blog-top-group {
  margin-left: 30px;
  cursor: pointer;
}

.front-blog-top-group:hover {
  color: #006ED7;
}

/*  博客框 */
.front-blog-main {
  position: relative;
  z-index: 0;
  min-height: 100vh;
  margin: 10px;
}

.front-blog-each {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.front-blog-each:hover {
  background-color: #fafafa !important;
}

.front-blog-eachName {
  padding-left: 10px;
  font-size: 20px;
  color: #409eff;
  cursor: pointer;
  width: auto;
}

.front-blog-eachName:hover {
  color: #006ed7;
  text-decoration: underline 2px solid #006ed7;
}

.front-blog-eachUser {
  display: flex;
  justify-content: left;
  font-size: 14px;
  position: relative;
  top: 20px;
  color: gray;
}

.front-blog-person {
  top: 80px;
  left: 11.2%;
  width: 19%;
}

.front-pagination >>> button.btn-prev {
  background-color: #fff;
}

.front-pagination >>> button.btn-next {
  background-color: #fff;
}

.front-pagination >>> li.number {
  background-color: #fff;
}

.front-pagination >>> li.number.active {
  background-color: #fff;
}
</style>
