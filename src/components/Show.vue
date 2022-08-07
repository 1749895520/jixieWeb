<template>
  <div class="front-background">
    <!--    背景云朵  -->
    <div class="front-cloud show-cloud" style="opacity: 50%">
      <!--    云朵-1  -->
      <div style='position:fixed; z-index:1;top: -20%' class="cloud-pos-1">
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
      <i class="el-icon-front-sun front-sun-icon"></i>
      <i class="el-icon-front-yun front-yun-icon"></i>
    </div>
    <!--    show   -->
    <el-row>
      <el-col :xs="4" :sm="4" :md="4" :lg="6" style="border: 1px solid transparent"></el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="12">
        <div :class="{'front-not-show':this.isTurnOn}" class=" front-show-top">Computer Association of AHPU</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="2" :sm="4" :md="4" :lg="6" style="border: 1px solid transparent"></el-col>
      <el-col :xs="20" :sm="16" :md="16" :lg="12">
        <div class="front-show"
             :class="{'font-size-68':this.$store.state.windowSize==='lg' || this.$store.state.windowSize==='md',
         'font-size-48':this.$store.state.windowSize==='sm',
         'font-size-42':this.$store.state.windowSize==='xs',
         'front-not-show':this.isTurnOn}">
          <span style="animation-delay: .1s" class="animate__animated animate__flipInX">A</span>
          <span style="animation-delay: .2s" class="animate__animated animate__flipInX">H</span>
          <span style="animation-delay: .3s" class="animate__animated animate__flipInX">P</span>
          <span style="animation-delay: .4s" class="animate__animated animate__flipInX">U</span>
          <span style="animation-delay: .5s" class="animate__animated animate__flipInX">计</span>
          <span style="animation-delay: .6s" class="animate__animated animate__flipInX">算</span>
          <span style="animation-delay: .7s" class="animate__animated animate__flipInX">机</span>
          <span style="animation-delay: .8s" class="animate__animated animate__flipInX">协</span>
          <span style="animation-delay: .9s" class="animate__animated animate__flipInX">会</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="4" :sm="4" :md="4" :lg="6" style="border: 1px solid transparent"></el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="12">
        <div :class="{'front-not-show':this.isTurnOn}" class=" front-show-bottom">尚德敏学，唯实惟新</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="4" :sm="4" :md="4" :lg="6" style="border: 1px solid transparent"></el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="12">
        <div :class="{'front-not-show':this.isTurnOn}" class=" front-tips">立即进入</div>
      </el-col>
    </el-row>
    <!--    开机  -->
    <div :style="openBox"
         :class="{'w-100':this.$store.state.windowSize==='xs','w-90':this.$store.state.windowSize==='sm' ||
         this.$store.state.windowSize=== 'md','w-80':this.$store.state.windowSize==='lg'}" class="front-turn-on">
        <span @click="toTurnOn" :class="{'front-openbox-open':this.isTurnOn}" class="front-openbox">
        <i v-if="!isTurnOn" class="el-icon-front-turn-on front-turn-on-icon"></i>
      </span>
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
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "Show",
  data() {
    return {
      isTurnOn: false,
      screenWidth: null,
      clickLamp: false,
      serverIp: serverIp,
      openBox: {
        display: 'block',
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
      }
    },
    immediate: true
  },
  methods: {
    toTurnOn() {
      this.isTurnOn = true;
      this.toDisappear()
    },
    toDisappear() {
      let that = this
      setTimeout(function () {
        that.openBox.display = 'none'
      }, 2000)
      setTimeout(() => {
        this.$router.push('/front/home')
      }, 2000)
    },
    isClickLamp() {
      this.clickLamp = !this.clickLamp
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

/*  云朵  */
.show-cloud {
  opacity: 50%;
  animation: cloud 1s ease-in-out;
}

@keyframes cloud {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 50%;
  }
}

/*  太阳  */
.front-sun {
  position: fixed;
  width: 150px;
  height: 150px;
  z-index: 0;
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

/*  show  */
.front-show-top {
  position: absolute;
  justify-content: space-around;
  color: #fff;
  opacity: 100%;
  top: 150px;
  left: 50%;
  transform: translate(-50%);
  font-size: 15px;
  font-weight: 300;
  animation: show-top .5s ease-out;
}

@keyframes show-top {
  0% {
    top: 200px;
    opacity: 0;
  }
  100% {
    top: 150px;
    opacity: 100%;
  }
}

.front-show-bottom {
  position: absolute;
  justify-content: space-around;
  color: #8978b0;
  opacity: 100%;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  font-size: 24px;
  font-weight: 500;
  animation: show-bottom 1s ease-out;
}

@keyframes show-bottom {
  0% {
    top: 100px;
    opacity: 0;
  }
  100% {
    top: 20px;
    opacity: 100%;
  }
}

/*  进入提示  */
.front-tips {
  position: absolute;
  justify-content: space-around;
  color: #fff;
  opacity: 100%;
  z-index: 10;
  top: 180px;
  left: 50%;
  transform: translate(-50%);
  font-size: 24px;
  font-weight: 500;
  animation: tips 1s ease-out;
}

@keyframes tips {
  0% {
    opacity: 0;
    top: 150px;
  }
  100% {
    opacity: 100%;
    top: 180px;
  }
}

.front-show {
  display: flex;
  justify-content: space-around;
  height: 100px;
  color: #fff;
  text-shadow: 5px 5px 10px #000;
  font-weight: bold;
  margin-top: 200px;
  z-index: 10;
  transition-duration: .5s;
}

.front-not-show {
  opacity: 0;
  margin-top: 100px;
}

/*  开机  */
.front-turn-on {
  position: absolute;
  margin: auto;
  z-index: 999;
  height: 80px;
  top: 400px;
  left: 50%;
  transform: translate(-50%);
}

.openbox {
  display: block;
}

.front-openbox {
  display: flex;
  position: relative;
  margin: auto;
  width: 80px;
  height: 100%;
  border-radius: 50%;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5) !important;
  background-color: #ec4e4e;
}

.front-openbox:hover {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5) !important;
  background-color: #d04545;
}

.front-openbox-open {
  background-color: #e0f2fe;
  border-radius: 4px;
  margin: -180px auto auto;
  width: 100%;
  height: 100vh;
  animation: open 2s ease-in-out;
}

@keyframes open {
  0% {
    margin: 0 auto auto;
    width: 80px;
    height: 100%;
    border-radius: 50%;
    background-color: #f38181;
  }
  30% {
    margin: -180px auto auto;
    width: 80px;
    height: 40px;
    border-radius: 4px;
    background-color: #e0f2feEE;
  }
  70% {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    margin: -180px auto auto;
    background-color: #e0f2feCC;
  }
  100% {
    background-color: #e0f2feAA;
    border-radius: 4px;
    margin: -180px auto auto;
    width: 100%;
    height: 100vh;
  }
}

.front-turn-on-icon {
  display: inline-block;
  width: 50%;
  height: 50%;
  margin: auto;
}

/*  背景拉灯 */
.front-lamp-click {
  animation: front-lamp-click .5s ease-out;
}

@keyframes front-lamp-click {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.front-lamp {
  position: absolute;
  top: -300px;
  left: 1400px;
  width: 50px;
  height: 50px;
  transform: rotateX(180deg);
  animation: front-lamp .8s ease-in;
}

@keyframes front-lamp {
  0% {
    top: -500px;
  }
  100% {
    top: -300px;
  }
}

.front-lamp-scope {
  width: 5px;
  height: 200px;
  background: linear-gradient(to bottom, #644e4e, #926f6e, #644e4e);
  position: absolute;
  top: -495px;
  left: 1422px;
  animation: front-lamp-scope .8s ease-in;
}

@keyframes front-lamp-scope {
  0% {
    height: 0;
  }
  100% {
    height: 200px;
  }
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
