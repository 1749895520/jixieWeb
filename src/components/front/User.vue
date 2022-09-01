<template>
  <div style="position: absolute;right: 20px;top: 8px">
    <div v-if="!this.$store.state.user.username"
         class="box-user-information">
      <el-button class="box-user-login" @click="$store.state.isLogin = true">登录</el-button>
    </div>
    <div v-else class="box-user-information front-avatar">
      <div :class="{'box-isShow':this.$store.state.windowSize==='xs'}">
        <p style="font-size: 14px;text-align: right">你好，{{ this.$store.state.user.nickname }}</p>
        <p style="font-size: 14px;color: #6b7280;text-align: right">{{ this.$store.state.strDate }}</p>
      </div>
      <div style="display: inline-flex;width: 40px;height: 40px">
        <el-dropdown style="width: 70px; cursor: pointer">
            <span><img v-if="this.$store.state.user.avatarUrl" :src="this.$store.state.user.avatarUrl" alt=""
                       style="width: 40px;height: 40px;border-radius: 50%">
              <i
                  v-else
                  style="width: 40px;height: 40px;border-radius: 50%"
                  class="el-icon-avatar"
              /></span>
          <el-dropdown-menu slot="dropdown" class="dropdown" style="margin-top: 20px">
            <el-dropdown-item class="dropdown-item">
              <span style="text-decoration: none" @click="toCenter">个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-item">
              <span style="text-decoration: none" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {resetRoutes} from "@/router";
import {serverIp} from "../../../public/config";
import Storage from "../../../public/storage";

let storage = new Storage()

export default {
  name: "User",
  data() {
    return {
      serverIp: serverIp,
    }
  },
  methods: {
    toCenter() {
      /*      let routerGoto = this.$router.resolve('/center/home')
            window.open(routerGoto.href, '_blank');*/
      this.$router.push('/center/home')
    },
    logout() {
      storage.removeItem('user')
      localStorage.removeItem('menus')
      //  重置路由
      resetRoutes()
      location.reload()
      this.$message.success('退出成功 ヾ(￣▽￣)Bye~Bye~')
    },
  }
}
</script>

<style scoped>
.front-avatar {
  margin-right: 20px;
}

.dropdown {
  width: 100px;
  text-align: center;
}

.dropdown-item {
  font-size: 14px;
  padding: 5px 0;
}

.dropdown-item:hover {
  font-size: 14px;
  padding: 5px 0;
}
</style>
