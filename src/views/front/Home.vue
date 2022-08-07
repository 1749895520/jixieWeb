<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="14" :md="14" :lg="14">
        <div class="front-name">
          <span class="front-name-title">通知公告</span>
          <a href="#" class="front-more-btn">更多 ></a>
        </div>
        <el-carousel
            indicator-position="outside"
            class="front-carousel"
            :class="{'front-carousel-container-lg':this.$store.state.windowSize==='lg',
                    'front-carousel-container-md':this.$store.state.windowSize==='md'||this.$store.state.windowSize==='sm',
                      'front-carousel-container-xs':this.$store.state.windowSize==='xs'}">
          <el-carousel-item v-for="item in 4" :key="item">
            <img src="../../../public/images/01.jpeg" alt="" class="front-img">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "FrontHome",
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

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
  filter: brightness(80%);
}

</style>
