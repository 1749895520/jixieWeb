<template>
  <div class="box-notfound">
    <div class="box-notfound-title">
      <p>当前页面无法访问</p>
      <br>
    </div>
    <div class="box-notfound-image">
      <img src="../../public/images/notFound.jpg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
.box-notfound {
  align-content: center;
  align-items: center;
  text-align: center;
  margin-top: 10%;
}

.box-notfound-title {
  font-size: 40px;
  font-weight: bold;
}
</style>
