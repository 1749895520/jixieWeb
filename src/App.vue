<template>
  <div id="app">
    <router-view/>
  </div>

</template>

<script>
export default {
  created() {
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },
}
</script>

<style>
#app {
  height: 100%;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
</style>
