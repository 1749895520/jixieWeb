<template>
  <el-row style="display: inline-flex;width: 100%" class="box-header">
    <el-col :span="1" class="box-guide">
      <!--    导航栏按钮-->
      <span :class="collapseBtnClass" style="cursor: pointer;color: #0f0f0f;"
            @click="collapse"></span>
    </el-col>
    <el-col :span="15">
      <!--    路由导航-->
      <div class="box-route" v-show="this.$store.state.windowOrPhone">
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       style="display: inline-block; margin-left: 10px;"
        >
          <el-breadcrumb-item to="/center/home">{{ this.$store.state.homeName }}</el-breadcrumb-item>
          <el-breadcrumb-item
              v-for="(item,index) in breadList"
              v-if="item.name!=='manage'"
              :key="index"
          >{{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </el-col>
    <el-col :span="8" :xs="16">
      <!--    登录用户信息-->
      <div class="box-user-information">
        <div v-if="$store.state.windowSize==='lg'">
          <p style="font-size: 14px;text-align: right">你好，{{ this.$store.state.user.nickname }}</p>
          <p style="font-size: 14px;color: #6b7280;text-align: right">{{ this.$store.state.strDate }}</p>
        </div>
        <div style="display: inline-flex;width: 40px;height: 40px">
          <el-dropdown style="width: 70px; cursor: pointer">
            <span><img v-if="this.$store.state.user.avatarUrl" :src="this.$store.state.user.avatarUrl" alt=""
                       style="width: 40px;height: 40px;border-radius: 50%">
              <i
                  v-else
                  class="el-icon-avatar"
                  style="width: 40px;height: 40px;border-radius: 50%"/></span>
            <el-dropdown-menu slot="dropdown" class="dropdown" style="margin-top: 20px">
              <el-dropdown-item class="dropdown-item">
                <span style="text-decoration: none" @click="toFront">主页</span>
              </el-dropdown-item>
              <el-dropdown-item class="dropdown-item">
                <span style="text-decoration: none" @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import {serverIp} from "../../public/config";

export default {
  name: "Header",
  props: {
    collapseBtnClass: String,
    collapse: "",
  },
  data() {
    return {
      breadList: [], // 路由集合
      windowOrPhone: true,
      serverIp: serverIp
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    isHome(route) {
      return route.name === this.$store.state.homeName;
    },
    getBreadcrumb() {
      let matched = this.$route.matched
      /*      console.log("打印matched")
            console.log(matched)*/
      if (!this.isHome(matched[1])) {
        this.breadList = matched;
      } else {
        this.breadList = []
      }
    },
    toFront() {
      this.$router.push('/front/home')
    },
    logout() {
      this.$store.commit('logout')
      this.$message.success('退出成功 ヾ(￣▽￣)Bye~Bye~')
      this.$router.push('/front/home')
      setTimeout(() => {
        location.reload()
      }, 2000)
    },
  },
  created() {
    this.getBreadcrumb();
  }
}
</script>

<style scoped>
.dropdown {
  width: 100px;
  text-align: center;
}

.dropdown-item {
  font-size: 14px;
  padding: 5px 0;
}
</style>
