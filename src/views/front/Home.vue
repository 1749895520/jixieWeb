<template>
  <div>
    <el-row :gutter="30">
      <el-col :xs="24" :sm="14" :md="14" :lg="14">
        <i class="el-icon-ring box-ring" @click="$store.state.clickRing = !$store.state.clickRing"/>
        <el-carousel
            indicator-position="outside"
            class="front-carousel"
            :class="{'front-carousel-container-lg':this.$store.state.windowSize==='lg',
                    'front-carousel-container-md':this.$store.state.windowSize==='md'||this.$store.state.windowSize==='sm',
                      'front-carousel-container-xs':this.$store.state.windowSize==='xs'}">
          <el-carousel-item v-for="item in carouselList" :key="item.id">
            <img :src="item.content" alt="" class="front-img animate__animated animate__fadeIn">
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="10">
        <div class="front-name">
          <i class="el-icon-blue-1 front-name-icon"></i>
          <span class="front-name-title">通知公告</span>
          <a @click="$router.push('/front/more?id=1')" class="front-more-btn">更多 ></a>
        </div>
        <div class="front-notice" v-for="(item,index) in noticeList" v-if="index<5" :key="item.id">
          <div class="front-notice-time-outside">
            <div class="front-notice-time">
              <span style="font-size: 20px;margin-left: 20px">
                {{ item.time.substring(5, 10) }}
              </span>
              <span style="margin-left: 10px;color: #aaa">
                {{ item.time.substring(0, 4) }}
              </span>
            </div>
          </div>
          <div class="front-notice-title">
            <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
              <span class="front-blog-top-group" @click="goto(item.id)">
                 {{ getTitle(item.name, 10) }}
              </span>
            </el-tooltip>
            <i v-if="isToday(item.time)" class="el-icon-new front-name-icon" style="left: 5px;
            bottom: 7px;position: relative"/>
          </div>
          <div class="front-notice-icon" :class="'el-icon-list-'+(index+1)"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="16" :lg="16">
        <div class="front-name">
          <i class="el-icon-blue-2 front-name-icon"></i>
          <span class="front-name-title">协会动态</span>
          <a @click="$router.push('/front/more?id=2')" class="front-more-btn">更多 ></a>
        </div>
        <div v-for="(item,index) in newsList" v-if="index<7">
          <div class="front-news">
            <i class="el-icon-blue-point icon-point"></i>
            <span @click="goto(item.id)" class="front-news-title">{{ getTitle(item.name, 15) }}</span>
            <i v-if="isToday(item.time)" class="el-icon-new front-name-icon" style="left: 5px;
            bottom: 5px;position: relative"/>
            <span class="front-news-time">
                {{ item.time }}
            </span>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="8" :md="8" :lg="8">
        <div class="front-name">
          <i class="el-icon-blue-3 front-name-icon"></i>
          <span class="front-name-title">友情链接</span>
          <a @click="$router.push('/front/more?id=3')" class="front-more-btn">更多 ></a>
        </div>
        <div v-for="(item,index) in linkList" v-if="index<7">
          <div @click="gotoOther(item.content)" class="front-link">
            {{ item.name }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {serverIp} from "../../../public/config";

export default {
  name: "FrontHome",
  data() {
    return {
      carouselList: [],
      noticeList: [],
      newsList: [],
      linkList: [],
      serverIp: serverIp,
      date: '',
    }
  },
  created() {
    this.loadCarousel()
    this.loadNotice()
    this.loadNews()
    this.loadLink()
    this.date = new Date().getDate()
  },
  methods: {
    isToday(time) {
      return time.substring(8, 10) === this.date + ''
    },
    loadCarousel() {
      this.request.get('/official/carousel').then(res => {
        this.carouselList = res.data
      })
    },
    loadNotice() {
      this.request.get('/official/notice/show').then(res => {
        this.noticeList = res.data.reverse()
      })
    },
    loadNews() {
      this.request.get('/official/news/show').then(res => {
        this.newsList = res.data.reverse()
      })
    },
    loadLink() {
      this.request.get('/official/link/show').then(res => {
        this.linkList = res.data
      })
    },
    goto(id) {
      let routerGoto = this.$router.resolve('/front/moreDetail?id=' + id)
      window.open(routerGoto.href, '_blank');
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
  }
}
</script>

<style scoped>
.box-ring {
  position: absolute;
  z-index: 15;
  width: 70px;
  height: 70px;
  transform: rotate(330deg);
  transition: .5s;
  top: -15px;
  left: -10px;
}

.box-ring:hover {
  transform: rotate(360deg);
}

.box-ring:active {
  animation: ring .5s infinite;
}

.box-ring-click {
  transform: rotate(360deg);
  animation: ring .5s infinite;
}

@keyframes ring {
  0% {
    transform: rotate(380deg);
  }
  25% {
    transform: rotate(340deg);
  }
  50% {
    transform: rotate(380deg);
  }
  75% {
    transform: rotate(340deg);
  }
  100% {
    transform: rotate(380deg);
  }
}

.front-cover >>> .el-card__body {
  padding: 1px;
}

.front-carousel-container-lg >>> .el-carousel__container {
  width: 100%;
  height: 26vw;
}

.front-carousel {
  width: 100%;
}

.front-carousel-container-xs >>> .el-carousel__container {
  width: 100%;
  height: 52vw;
}

.front-carousel-container-md >>> .el-carousel__container {
  width: 100%;
  height: 30vw;
}

.front-img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.front-notice {
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  background-color: #f0f0f0;
}

.front-notice-icon {
  height: 50px;
  width: 50px;
  margin-top: 5px;
  margin-right: 5px;
  transition-duration: .5s;
}

.front-notice-icon:hover {
  width: 55px;
  height: 55px;
}

.front-notice-title {
  width: 65%;
  margin-left: 10px;
  padding-top: 12px;
  cursor: pointer;
}

.front-notice-title:hover {
  color: #006ED7;
}

.front-notice-time-outside {
  background-color: #e0f2fe;
  border-radius: 0 0 0 5px;
  height: 63px;
  width: 100px;
  margin-left: 15px;
  transform: skewX(-20deg);
  border-right: 1px solid #84bffc;
}

.front-notice-time {
  background-color: #e0f2fe;
  border-bottom: 1px solid #84bffc;
  height: 62px;
  width: 100px;
  margin-left: -15px;
  transform: skewX(20deg);
  padding: 5px;
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

.front-link {
  cursor: pointer;
  height: 35px;
  background-color: #f0f0f0;
  text-align: center;
  padding-top: 5px;
  font-size: 15px;
  margin: 10px 10% 10px 10%;
}

.front-link:hover {
  color: #006ED7;
}

</style>
