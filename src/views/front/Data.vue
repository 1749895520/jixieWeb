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
            <span class="front-name-title">列表</span>
          </div>
          <div style="margin: 20px;display: flex;justify-content: center;flex-direction: column">
            <div class="menu-item" style="padding-left: 25%" v-for="item in dataList">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change(item.id)" :class="{'isFocus':menuType===item.id+''}">
                {{ item.name }}
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
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="18">
        <el-card style="min-height: 100vh">
          <div class="front-name">
            <i class="el-icon-blue-6 front-name-icon"></i>
            <span class="front-name-title">内容</span>
          </div>
          <el-empty style="margin-top: 20%" v-if="!menuType" description="未选择资料"/>
          <div v-if="menuType">
            <div class="front-UserBox">
              <div class="pd-10 front-blog-eachUser">
                <i v-if="$store.state.windowSize!=='xs'" class="el-icon-my-calendar mr-1"></i>
                <span v-if="$store.state.windowSize!=='xs'">{{ official.name }}</span>
                <i class="el-icon-my-user ml-5 mr-1"></i>
                <span>{{ official.user }}</span>
                <i class="el-icon-my-time ml-5 mr-1"></i>
                <span>{{ official.time }}</span>
              </div>
            </div>
            <mavon-editor
                style="box-shadow: none;  background-color: #fff;padding: 0"
                class="md front-blog-main"
                :value="official.content"
                :subfield="false"
                :default-open="'preview'"
                :toolbars-flag="false"
                :scroll-style="true"
                :ishljs="true"
                ref="official"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Data",
  data() {
    return {
      isfixTab: false,
      dataList: [],
      menuType: this.$route.query.id,
      total: 0,
      pageNum: 1,
      pageSize: 12,
      content: '',
      user: '',
      time: '',
      official: {},
    }
  },
  created() {
    this.$store.state.frontPath = '/front/data?id=72'
    this.load()
    if (this.menuType) {
      this.loadData()
    }
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
      this.request.get('/official/data', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.$store.state.frontOfficialName,
          content: this.content,
          user: this.user,
          time: this.time
        }
      }).then(res => {
        this.dataList = res.data.records.reverse()
        this.total = res.data.total
      })
    },
    loadData() {
      this.menuType = this.$route.query.id
      this.request.get("official/" + this.menuType).then(res => {
        this.official = res.data
        this.userId = res.data.userId
      })
    },
    handleTabFix() {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#main').offsetTop
      scrollTop > offsetTop + 120 ? this.isfixTab = true : this.isfixTab = false
    },
    change(id) {
      if (this.menuType !== id + '') {
        this.$router.push('/front/data?id=' + id)
        this.loadData()
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
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

.front-blog-main {
  min-height: 80vh;
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
