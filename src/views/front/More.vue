<template>
  <div>
    <el-row id="main" :gutter="10" style="margin-top: 20px">
      <el-col :span="6" v-if="isfixTab && this.$store.state.windowSize==='lg'"
              style="border: 1px solid transparent"></el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="6">
        <el-card style="margin-bottom: 10px"
                 :class="{ 'fixed front-blog-person':isfixTab && this.$store.state.windowSize==='lg'}">
          <div class="front-name">
            <i class="el-icon-blue-4 front-name-icon"></i>
            <span class="front-name-title">目录</span>
          </div>
          <div style="margin: 20px;display: flex;justify-content: center;flex-direction: column">
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('1')" :class="{'isFocus':menuType==='1'}">通知公告</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('2')" :class="{'isFocus':menuType==='2'}">协会动态</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('3')" :class="{'isFocus':menuType==='3'}">友情链接</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="18">
        <el-card style="min-height: 100vh">
          <div class="front-name" @change="$forceUpdate">
            <i class="el-icon-blue-5 front-name-icon"></i>
            <span class="front-name-title">详情</span>
          </div>
          <el-empty style="margin-top: 20%" v-if="!menuType" description="未选择目录"/>
          <div v-else>
            <div v-for="item in tableData" :key="item.id">
              <div class="front-news" :key="tableShow">
                <i class="el-icon-blue-point icon-point"></i>
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <span v-if="menuType!=='3'" @click="goto(item.id)" class="front-news-title">
                  {{ getTitle(item.name, getNum) }}
                </span>
                  <span v-else @click="gotoOther(item.content)" class="front-news-title">{{
                      getTitle(item.name, 35)
                    }}
                </span>
                </el-tooltip>
                <span v-if="$store.state.windowSize!=='xs'" class="front-news-time">
                {{ item.time }}
            </span>
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "More",
  data() {
    return {
      tableShow: 1,
      tableData: [],
      noticeList: [],
      newsList: [],
      linkList: [],
      getNum: 35,
      noticeTotal: 0,
      noticePageNum: 1,
      noticePageSize: 15,
      newsTotal: 0,
      newsPageNum: 1,
      newsPageSize: 15,
      linkTotal: 0,
      linkPageNum: 1,
      linkPageSize: 15,
      total: 0,
      pageNum: 1,
      pageSize: 15,
      content: '',
      user: '',
      time: '',
      isfixTab: false,
      menuType: this.$route.query.id,
      getUrl: '',
    }
  },
  created() {
    this.menuType = this.$route.query.id
    this.$store.state.frontPath = '/front/more?id=1'
    this.loadNotice()
    this.loadNews()
    this.loadLink()
    setTimeout(() => {
      this.load()
      this.getNum = this.$store.state.windowSize === 'lg' ? 35 : 15
    }, 200)
  },
  watch: {
    '$route'() { //监听URL地址栏参数变化
      let menuId = this.$route.query.id;
      if (menuId) {
        this.menuType = menuId
        this.load()
      }
    },
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
      if (this.menuType === '1') {
        this.tableData = this.noticeList
        this.total = this.noticeTotal
        this.pageNum = this.noticePageNum
        this.pageSize = this.noticePageSize
      } else if (this.menuType === '2') {
        this.tableData = this.newsList
        this.total = this.newsTotal
        this.pageNum = this.newsPageNum
        this.pageSize = this.newsPageSize
      } else {
        this.tableData = this.linkList
        this.total = this.linkTotal
        this.pageNum = this.linkPageNum
        this.pageSize = this.linkPageSize
      }
    },
    loadNotice() {
      this.request.get('/official/notice', {
        params: {
          pageNum: this.noticePageNum,
          pageSize: this.noticePageSize,
          name: this.$store.state.frontOfficialName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.noticeList = res.data.records
        this.noticeTotal = res.data.total
      })
    },
    loadNews() {
      this.request.get('/official/news', {
        params: {
          pageNum: this.newsPageNum,
          pageSize: this.newsPageSize,
          name: this.$store.state.frontOfficialName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.newsList = res.data.records
        this.newsTotal = res.data.total
      })
    },
    loadLink() {
      this.request.get('/official/link', {
        params: {
          pageNum: this.linkPageNum,
          pageSize: this.linkPageSize,
          name: this.$store.state.frontOfficialName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.linkList = res.data.records
        this.linkTotal = res.data.total
      })
    },
    change(id) {
      this.$router.push('/front/more?id=' + id)
    },
    handleTabFix() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#main').offsetTop
      scrollTop > offsetTop + 120 ? this.isfixTab = true : this.isfixTab = false
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
      this.$router.push('/front/moreDetail?id=' + id)
    },
    gotoOther(url) {
      window.open(url, '_blank');
    },
    getTitle(name, num) {
      if (name.length > num) {
        return name.substring(0, num) + "..."
      } else {
        return name
      }
    }
  },
}
</script>

<style scoped>
.front-blog-person {
  top: 80px;
  left: 11.2%;
  width: 19%;
}

.menu-item {
  margin-bottom: 5px;
  background-color: #f0f0f0;
  height: 30px;
  padding-top: 3px;
  padding-left: 25%;
}

.icon-point {
  margin-right: 5px;
}

.menu-title {
  margin-right: 20px;
  cursor: pointer;
}

.menu-title:hover {
  color: #006ED7;
}

.isFocus {
  font-weight: bold;
  color: #006ED7;
}

.front-news {
  width: 100%;
  height: 45px;
  border-bottom: 1px dashed #aaa;
  padding-top: 10px;
  padding-left: 10px;
}

.front-news-title {
  cursor: pointer;
}

.front-news-title:hover {
  color: #006ED7;
}

.front-news-time {
  color: #aaa;
  font-size: 14px;
  float: right;
}

.icon-point {
  margin-right: 5px;
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
