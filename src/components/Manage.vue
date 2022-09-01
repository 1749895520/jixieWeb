<template>
  <transition leave-active-class="animate__animated animate__slideOutUp">
    <el-container style="height: 100%;position: fixed;width: 100%;animation-duration: 2s"
                  :class="{'animate__animated animate__fadeInDown':this.$store.state.windowSize!=='xs'}">
      <div class="el-aside">
        <Aside :isDrawer="isDrawer" :collapse="collapse"/>
      </div>
      <el-container>
        <el-header style="border-bottom: 1px solid white">
          <Header style="height: 100%" :collapseBtnClass="collapseBtnClass" :collapse="collapse"/>
        </el-header>
        <el-header style="border-bottom: 1px solid white;height: 50px">
          <TagRouter/>
        </el-header>
        <el-main style="padding-bottom: 100px">
          <!--        表示当前页面的子路由会在router-view里面展示   -->
          <router-view class="animate__animated animate__fadeIn"/>
        </el-main>
      </el-container>
      <!--    云朵-1  -->
      <div style='position:fixed; z-index:999;top: 75%' class="cloud-pos-1">
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
      <div style='position:fixed; z-index:999;top: 75%' class="cloud-pos-2">
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
      <div style='position:fixed; z-index:999;top: 75%' class="cloud-pos-3">
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
    </el-container>
  </transition>
</template>
<script>

import Aside from "@/components/Aside";
import Header from "@/components/Header";
import TagRouter from "@/components/TagRouter";
import Storage from "../../public/storage";

let storage = new Storage()

export default {
  name: 'Home',
  data() {
    return {
      screenWidth: null,
      collapseBtnClass: 'el-icon-more-outline',
      menuOrDrawer: true,
      isDrawer: false,
      list: []
    }
  },
  created() {
    this.getUser()
    this.getData()
  },
  components: {
    Aside,
    Header,
    TagRouter
  },
  methods: {
    getData() {
      let date = new Date();
      let year = date.getFullYear(); //月份从0~11，所以加一
      let dateArr = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
      for (let i = 0; i < dateArr.length; i++) {
        if (dateArr[i] >= 1 && dateArr[i] <= 9) {
          dateArr[i] = "0" + dateArr[i];
        }
      }
      this.$store.state.strDate = year + '-' + dateArr[0] + '-' + dateArr[1] + ' ' + dateArr[2] + ':' + dateArr[3] +
          ':' +
          dateArr[4];
      this.list = this.$store.state.strDate
    },
    timer() {
      return setTimeout(() => {
        this.getData()
      }, 1000)
    },
    collapse() {  //  点击收缩按钮触发
      this.$store.state.logoTextShow = !this.$store.state.logoTextShow
      if (this.menuOrDrawer) {
        this.$store.state.isCollapse = !this.$store.state.isCollapse
        if (this.$store.state.isCollapse) {  //  收缩
          // this.sideWidth = 64
          this.collapseBtnClass = 'el-icon-more'
        } else {  //  展开
          // this.sideWidth = 200
          this.collapseBtnClass = 'el-icon-more-outline'
        }
      } else {
        this.isDrawer = !this.isDrawer
        if (this.isDrawer) {  //  收缩
          // this.sideWidth = 64
          this.collapseBtnClass = 'el-icon-more-outline'
        } else {  //  展开
          // this.sideWidth = 200
          this.collapseBtnClass = 'el-icon-more'
        }
      }
    },
    getUser() {
      let id = storage.getItem("user") ? storage.getItem('user').id : ""
      if (id) {
        this.$store.state.asidePath = localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : ""
        this.request.get("/user/" + id).then(res => {
          this.$store.state.user = res.data
        })
      }
    }
  },
  mounted() {
    this.screenWidth = document.body.clientWidth
    window.onresize = () => {   //屏幕尺寸变化就重新赋值
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  },
  watch: {
    list() {
      this.timer()
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    screenWidth: {
      handler: function (val, oldVal) {
        this.$store.state.windowSize = val < 768 ? 'xs' : val < 992 ? 'sm' : val < 1200 ? 'md' : 'lg'
        if (val < 768) {
          this.menuOrDrawer = false
          this.$store.state.isCollapse = false
          this.$store.state.windowOrPhone = false
          this.collapseBtnClass = 'el-icon-more'
          // console.log('屏幕宽度小于768px')
        } else {
          this.menuOrDrawer = true
          this.isDrawer = false
          this.$store.state.windowOrPhone = true
          this.collapseBtnClass = 'el-icon-more-outline'
          // console.log('屏幕宽度大于768px')
        }
      },
      immediate: true
    },
  },
}
</script>

<style>
.container {
  width: 1px;
  height: 1px;
  position: relative;
}
</style>


