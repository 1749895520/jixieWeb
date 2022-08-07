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

</style>
