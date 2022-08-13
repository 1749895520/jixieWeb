<template>
  <div>
    <div ref="img" class="img"/>
  </div>
</template>

<script>

export default {
  name: "GIF",
  data() {
    return {
      y: 0,
    }
  },
  created() {
    setTimeout(() => {
      this.load()
    }, 300)
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
  },
  methods: {
    handleScroll() {
      this.y = this.$store.state.scrollY
    },
    load() {
      let img = document.querySelector('.img')
      let deg = 0
      let imgx = 0
      let imgy = 0
      let imgl = 0
      let imgt = 0
      let y = 0
      let index = 0
      let sro = 0
      window.addEventListener('mousemove', function (xyz) {
        // 获取网页左侧距离的图片位置
        sro = this.y ? this.y : sro
        imgx = xyz.x - img.offsetLeft - img.clientWidth / 2
        // 多去网页顶部距离图片的位置
        imgy = xyz.y - img.offsetTop - img.clientHeight / 2 + sro
        // 套入公式，定义图片的旋转角度
        deg = 360 * Math.atan(imgy / imgx) / (2 * Math.PI)
        // 每当鼠标移动的时候重置index
        index = 0
        // 定义当前鼠标的位置
        let x = event.clientX
        // 当鼠标的x轴大于图片的时候，提普安就要对着鼠标，所以需要将图片翻转过来
        // 否则就不用翻转
        if (img.offsetLeft < x) {
          y = -180
        } else {
          y = 0
        }
      })
      setInterval(() => {
        // 设置小图片的旋转和翻转
        img.style.transform = "rotateZ(" + deg + "deg) rotateY(" + y + "deg)"
        index++
        // 在这里设置小图片的位置和速度，并判断小图片到达鼠标位置时停止移动
        if (index < 50) {
          imgl += imgx / 50
          imgt += imgy / 50 + this.y / 50
        }
        img.style.left = imgl + "px"
        img.style.top = imgt + "px"
      }, 10)
    }
  }
}
</script>

<style scoped>
.img {
  width: 100px;
  height: 100px;
  position: absolute;
  background-image: url('../../../public/images/飞舞蜜蜂.gif');
  background-size: cover;
}
</style>
