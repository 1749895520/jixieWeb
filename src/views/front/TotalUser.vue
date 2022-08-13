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
            <span class="front-name-title">用户列表</span>
          </div>
          <div style="margin: 20px;display: flex;justify-content: center;flex-direction: column;">
            <div class="menu-item" style="padding-left: 25%" v-for="item in userList">
              <i class="el-icon-blue-point icon-point"></i>
              <span class="menu-title" @click="change(item.id)" :class="{'isFocus':menuType===item.id+''}">
                {{ item.nickname }}
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
        <el-card style="min-height: 80vh">
          <div class="front-name">
            <i class="el-icon-blue-6 front-name-icon"></i>
            <span class="front-name-title">用户详情</span>
          </div>
          <el-empty style="margin-top: 20%" v-if="!menuType" description="未选择用户"/>
          <div v-if="menuType" style="margin-top: 10%;">
            <el-card style="background-color: #c7e5f9;">
              <el-row :gutter="12">
                <el-col :xs="24" :sm="24" :md="8" :lg="8" style="display: flex;justify-content: center">
                  <el-card style="height: 100%;background-color: #f0f9ff;margin-top: 20px;margin-bottom: 20px">
                    <img v-if="user.avatarUrl" :src="user.avatarUrl"
                         class="avatar" style="width: 200px;height: 200px;border-radius: 10px"
                         alt="">
                    <i
                        v-else
                        class="avatar el-icon-avatar"
                        style="width: 200px;height: 200px;border-radius: 10px"/>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="24" :md="16" :lg="16">
                  <el-card style="background-color: #f0f9ff">
                    <el-descriptions class="margin-top" :column="1" size="big" border>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-user"></i>
                          用户名
                        </template>
                        {{ user.username }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-s-opportunity"></i>
                          昵称
                        </template>
                        {{ user.nickname }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-notebook-2"></i>
                          专业
                        </template>
                        {{ user.speciality }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-school"></i>
                          班级
                        </template>
                        {{ user.gradeClass }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-house"></i>
                          故乡
                        </template>
                        {{ user.address }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          <i class="el-icon-user-solid"></i>
                          用户头衔
                        </template>
                        <!--                        <el-tag size="small">管理员</el-tag>-->
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {serverIp} from "../../../public/config";

export default {
  name: "TotalUser",
  data() {
    return {
      isfixTab: false,
      serverIp: serverIp,
      userList: [],
      menuType: this.$route.query.id,
      total: 0,
      pageNum: 1,
      pageSize: 12,
      username: "",
      nickname: "",
      speciality: "",
      gradeClass: "",
      address: "",
      user: {},
    }
  },
  created() {
    this.$store.state.frontPath = '/front/totalUser'
    this.load()
    if (this.menuType) {
      setTimeout(() => {
        this.loadUser()
      }, 200)
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
      this.request.get('/user/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          nickname: this.nickname,
          speciality: this.speciality,
          gradeClass: this.gradeClass,
          address: this.address
        }
      }).then(res => {
        this.userList = res.data.records
        this.total = res.data.total
      })
    },
    loadUser() {
      this.menuType = this.$route.query.id
      this.request.get("/user/" + this.menuType).then(res => {
        this.user = res.data
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
        this.$router.push('/front/totalUser?id=' + id)
        this.loadUser()
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

