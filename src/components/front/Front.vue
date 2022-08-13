<template>
  <div ref="tree" class="front-background">
    <!--  跟随装饰  -->
    <GIF style="position: absolute;z-index: 999;" v-if="this.$store.state.clickRing"/>
    <!--    背景云朵  -->
    <div class="front-cloud" style="opacity: 50%">
      <!--    云朵-1  -->
      <div style='position:fixed; z-index:1;top: -20%' class="cloud-pos-1">
        <div class="container cloud-1">
          <div class="cloud"/>
        </div>
        <div class="container cloud-2">
          <div class="cloud"/>
        </div>
        <div class="container cloud-3">
          <div class="cloud"/>
        </div>
        <div class="container cloud-4">
          <div class="cloud"/>
        </div>
        <div class="container cloud-5">
          <div class="cloud"/>
        </div>
        <div class="container cloud-6">
          <div class="cloud"/>
        </div>
        <div class="container cloud-7">
          <div class="cloud"/>
        </div>
        <div class="container cloud-8">
          <div class="cloud"/>
        </div>
      </div>
      <!--    云朵-2  -->
      <div style='position:fixed; z-index:1;top: -20%' class="cloud-pos-2">
        <div class="container cloud-9">
          <div class="cloud"/>
        </div>
        <div class="container cloud-10">
          <div class="cloud"/>
        </div>
        <div class="container cloud-4">
          <div class="cloud"/>
        </div>
        <div class="container cloud-5">
          <div class="cloud"/>
        </div>
        <div class="container cloud-6">
          <div class="cloud"/>
        </div>
      </div>
      <!--    云朵-3  -->
      <div style='position:fixed; z-index:1;top: -20%' class="cloud-pos-3">
        <div class="container cloud-9">
          <div class="cloud"/>
        </div>
        <div class="container cloud-10">
          <div class="cloud"/>
        </div>
        <div class="container cloud-4">
          <div class="cloud"/>
        </div>
        <div class="container cloud-5">
          <div class="cloud"/>
        </div>
        <div class="container cloud-6">
          <div class="cloud"/>
        </div>
      </div>
    </div>
    <!--    太阳  -->
    <div v-if="this.$store.state.windowSize!=='xs'"
         class="front-sun rotate">
      <i class="el-icon-front-sun front-sun-icon"></i><!--太阳-->
      <i class="el-icon-front-yun front-yun-icon"></i><!--表情-->
    </div>
    <!--    页眉导航栏   -->
    <div class="box-slideDown front-title box-onTop">
      <div v-if="$store.state.windowSize==='lg'">
        <img src="../../../public/front-logo.png" alt="" class="front-title-icon">
      </div>
      <div v-else>
        <img src="../../../public/front-logo.png" alt="" class="front-title-icon"
             @click="$store.state.frontDrawer = true">
      </div>
      <div class="front-title-text">AHPU 计算机协会</div>
      <!--      菜单栏   -->
      <Menu/>
      <!--      搜索框   -->
      <Search v-if="this.$store.state.windowSize==='lg'" @load="load"/>
      <!--    登录用户信息-->
      <User/>
    </div>
    <el-drawer
        v-if=""
        :visible.sync="$store.state.frontDrawer"
        :with-header="false"
        direction="ltr"
        :before-close="collapse"
        class="hidden-sm-and-up"
        style="width: 830px;z-index: 999"
        ref="navDrawer"
        :modal-append-to-body="false"
    >
      <div style="background-color: #e0f2fe;display: flex">
        <img src="../../../public/front-logo.png" alt="" class="front-title-icon"
             style="margin: 10px"
             @click="$store.state.frontDrawer = true">
        <span style="font-size: 20px;font-weight: bold;margin-top: 15px">AHPU 计算机协会</span>
      </div>
      <el-menu :default-active="$route.path" style="min-height: 100%; overflow-x: hidden; font-weight: 530;"
               active-text-color="#409eff"
               class="el-menu-vertical-demo"
               router
               @select="handleSelect"
      >
        <el-menu-item class="front-menu" index="/front/home">协会首页</el-menu-item>
        <el-menu-item class="front-menu" index="/front/data">协会资料</el-menu-item>
        <el-menu-item class="front-menu" index="/front/blog">协会博客</el-menu-item>
        <el-menu-item class="front-menu" index="/front/totalUser">用户列表</el-menu-item>
        <el-menu-item class="front-menu" index="/front/more">更多</el-menu-item>
      </el-menu>
    </el-drawer>
    <!--    主页面   -->
    <div ref="sro">
      <el-card class="front-main animate__animated animate__fadeIn"
               :class="{'w-100':this.$store.state.windowSize==='xs','w-90':this.$store.state.windowSize==='sm' ||
         this.$store.state.windowSize=== 'md','w-80':this.$store.state.windowSize==='lg'}">
        <router-view ref="son"/>
      </el-card>
    </div>
    <!--    背景山 -->
    <div class="front-mountain ">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25" class="shape-fill"></path>
        <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5" class="shape-fill"></path>
        <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            class="shape-fill"></path>
      </svg>
    </div>
    <el-backtop/>
  </div>
</template>

<script>
import {serverIp} from "../../../public/config";
import Menu from './Menu'
import User from "@/components/front/User";
import Search from "@/components/front/Search";
import GIF from "@/components/front/GIF";

export default {
  name: "Front",
  components: {
    GIF,
    Menu,
    User,
    Search
  },
  data() {
    return {
      centerUrl: serverIp + ':8080/center/home',
      screenWidth: null,
      serverIp: serverIp,
      hoverHome: false,
      hoverData: false,
      hoverBlog: false,
      hoverMore: false,
      list: [],
    }
  },
  created() {
    this.getUser()
    this.getData()
    this.$store.state.frontPath = this.$route.matched[1].path
  },
  mounted() {
    this.screenWidth = document.body.clientWidth
    window.onresize = () => {   //屏幕尺寸变化就重新赋值
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
    window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
  },
  watch: {
    list() {
      this.timer()
      this.ringing()
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    screenWidth: {
      handler: function (val, oldVal) {
        this.$store.state.windowSize = val < 768 ? 'xs' : val < 992 ? 'sm' : val < 1200 ? 'md' : 'lg'
      }
    },
    immediate: true
  },
  methods: {
    // 获取页面滚动距离
    handleScroll() {
      this.$store.state.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    },
    // 滚动重置
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    /*  兄弟组件通信  */
    load() {
      this.$refs.son.load()
    },
    handleSelect(key) {
      this.$store.state.frontPath = key
      this.$refs.navDrawer.closeDrawer()
    },
    collapse() {
      this.$store.state.frontDrawer = false
    },
    getData() {
      let date = new Date();
      let year = date.getFullYear(); //月份从0~11，所以加一
      let dateArr = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
      for (let i = 0; i < dateArr.length; i++) {
        if (dateArr[i] >= 0 && dateArr[i] <= 9) {
          dateArr[i] = "0" + dateArr[i];
        }
      }
      this.$store.state.strDate = year + '-' + dateArr[0] + '-' + dateArr[1] + ' ' + dateArr[2] + ':' + dateArr[3] +
          ':' +
          dateArr[4];
      this.list = this.$store.state.strDate
    },
    getUser() {
      let id = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : ""
      if (id) {
        this.$store.state.asidePath = localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : ""
        this.request.get("/user/" + id).then(res => {
          this.$store.state.user = res.data
        })
      }
    },
    timer() {
      return setTimeout(() => {
        this.getData()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>

/*  背景  */
.front-background {
  background: linear-gradient(to top, #e0f2fe, #409eff) fixed;
  background-size: cover;
  position: absolute;
  min-width: 100%;
  min-height: 100vh;
}

.container {
  width: 1px;
  height: 1px;
  position: relative;
  top: -20px;
}

/*  太阳  */
.front-sun {
  position: fixed;
  width: 150px;
  height: 150px;
  z-index: 1;
  top: 8%;
  background: fixed;
}

.front-sun-icon {
  width: 100%;
  height: 100%;
}

.front-yun-icon {
  position: absolute;
  width: 50%;
  height: 50%;
}

/*  页眉导航栏 */
.front-title {
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.15) !important;
  background: #e0f2fe fixed;
  border-bottom: 1px solid #fff;
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 60px;
}

.front-title-icon {
  width: 40px;
  height: 40px;
  margin: 10px 20px;
  background-color: transparent;
}

.front-title-text {
  padding-top: 15px;
  font-size: 20px;
  font-weight: 800;
}

.front-menu {
  position: relative;
  width: 100px;
  background-color: transparent;
  border: 0;
}

/*  主页面 */
.front-main {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  background-color: #fff;
  margin: 200px auto 20px;
  border: 1px solid #fff;
}

/*  背景山 */
.front-mountain {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  transform: rotate(180deg);
  animation: front-mountain 1s ease-out;
  z-index: 0;
}

@keyframes front-mountain {
  from {
    bottom: -300px;
  }
  to {
    bottom: 0;
  }
}

.front-mountain svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: 400px;
}

.front-mountain .shape-fill {
  fill: #95E1D3;
}

/*  动效设置  */

</style>
