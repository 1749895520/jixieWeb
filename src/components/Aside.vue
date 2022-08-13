<template>
  <div
      :class="{'close-aside box-aside-menu':this.$store.state.isCollapse&&this.$store.state.windowOrPhone,'box-aside-menu':!this.$store.state.isCollapse&&this.$store.state.windowOrPhone}">
    <div style="display: flex;justify-content: center;height: 56px" v-show="this.$store.state.windowOrPhone">
      <div class="box-aside-title">
        <div class="box-img-title">
          <img src="../../public/logo.png" alt="">
        </div>
        <div class="box-aside-titleText"
             v-show="!this.$store.state.isCollapse">
          <span class="box-text-title"
                v-if="this.$store.state.logoTextShow">
            个人中心</span>
        </div>
      </div>
    </div>
    <el-menu :default-active="$route.path"
             style="min-height: 100%; overflow-x: hidden; font-weight: 530;border: none;"
             active-text-color="#409eff"
             :collapse="this.$store.state.isCollapse"
             class="el-menu-vertical-demo hidden-xs-only"
             :unique-opened="true"
             :hide-timeout="5000"
             router
    >
      <div v-for="item in this.$store.state.asidePath" :key="item.id">
        <div v-if="item.path!=='/'">
          <el-menu-item :index="item.path">
            <i class="icon-size" :class="item.icon"/>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
        <div v-else>
          <el-submenu :index="item.name">
            <template slot="title">
              <i class="icon-size" :class="item.icon"/>
              <span slot="title">{{ item.name }}</span>
            </template>
            <div v-for="subItem in item.children">
              <el-menu-item :index="subItem.path">
                <i class="icon-size" :class="subItem.icon"/>
                <span slot="title">{{ subItem.name }}</span>
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
      </div>
    </el-menu>

    <el-drawer
        :visible.sync="isDrawer"
        :with-header="false"
        direction="ltr"
        :before-close="collapse"
        class="hidden-sm-and-up"
        style="width: 830px;z-index: 999"
        ref="navDrawer"
        :modal-append-to-body="false"
    >
      <el-menu :default-active="$route.path" style="min-height: 100%; overflow-x: hidden; font-weight: 530;"
               active-text-color="#409eff"
               class="el-menu-vertical-demo"
               router
               @select="menuActive"
      >
        <div style="display: flex;justify-content: center;height: 56px">
          <div class="box-aside-title">
            <div class="box-img-title">
              <img src="../../public/logo.png" alt="">
            </div>
            <div class="box-aside-titleText">
          <span class="box-text-title">
            个人中心</span>
            </div>
          </div>
        </div>
        <!--    选项栏     -->
        <div v-for="item in this.$store.state.asidePath" :key="item.id">
          <div v-if="item.path!=='/'">
            <el-menu-item :index="item.path">
              <i class="icon-size" :class="item.icon"/>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </div>
          <div v-else>
            <el-submenu :index="item.name">
              <template slot="title">
                <i class="icon-size" :class="item.icon"/>
                <span slot="title">{{ item.name }}</span>
              </template>
              <div v-for="subItem in item.children">
                <el-menu-item :index="subItem.path">
                  <i class="icon-size" :class="subItem.icon"/>
                  <span slot="title">{{ subItem.name }}</span>
                </el-menu-item>
              </div>
            </el-submenu>
          </div>
        </div>
      </el-menu>
    </el-drawer>
  </div>

</template>

<script>

export default {
  name: "Aside",
  props: {
    isDrawer: Boolean,
    collapse: "",
  },
  methods: {
    /*  用于在点击时关闭抽屉  */
    menuActive() {
      this.$refs.navDrawer.closeDrawer()
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}
</style>
