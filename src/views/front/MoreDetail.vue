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
          <div style="margin: 20px;display: flex;justify-content: center;flex-direction: column;text-align: center">
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('1')" :class="{'isFocus':menuType==='1'}">通知公告</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('2')" :class="{'isFocus':menuType==='2'}">
                协会动态</span>
            </div>
            <div class="menu-item">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change('3')" :class="{'isFocus':menuType==='3'}">
                友情链接</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" :md="14" :lg="18">
        <el-card style="min-height: 100vh">
          <div class="front-name">
            <i class="el-icon-blue-6 front-name-icon"></i>
            <span class="front-name-title">内容</span>
          </div>
          <div class="front-UserBox">
            <div class="pd-10 front-blog-eachUser">
              <i class="el-icon-my-calendar mr-1"></i>
              <span>{{ official.name }}</span>
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "MoreDetail",
  data() {
    return {
      isfixTab: false,
      menuType: '',
      official: {},
      userId: 0,
      officialId: this.$route.query.id,
    }
  },
  created() {
    this.load()
    this.$store.state.frontPath = '/front/more'
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
      this.request.get("official/" + this.officialId).then(res => {
        this.official = res.data
        this.userId = res.data.userId
        this.menuType = this.official.type + ''
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
  }
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

.front-blogCard >>> .el-card__body {
  padding: 0;
}

.front-blogTitle {
  margin: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.front-TitleBox {
  margin: 10px 20px 10px 20px;
}


.front-blog-eachName {
  text-align: center;
}

.front-blog-main {
  min-height: 80vh;
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
