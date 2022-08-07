<template>
  <div style="height: 100%;display: flex; justify-content: left;margin-left: -10px">
    <el-tag size="medium"
            v-for="(tab, index) in tabList"
            :key="tab.path"
            @close="handleClose(tab, index)"
            @click="changeMenu(tab)"
            class="box-tag"
            :class="isChosen(tab)?'box-tag-chose':'box-tag-not-chose'"
            :closable="tab.name !== 'index'"
            :effect="activePath === tab.name ? 'dark' : 'plain'">
      {{ tab.name }}
    </el-tag>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: "TagRouter",
  data() {
    return {
      menuList: [],
    };
  },
  computed: {
    ...mapState({ // 从 state 中的到的计算属性
      activePath: state => state.activePath, // 已选中菜单
      tabList: state => state.tabList, // tags菜单列表
      catch_components: state => state.catch_components, // keepalive缓存
    })
  },
  methods: {
    // 清空当前vuex数据
    handleCommand() {
      this.$store.commit('clearVUEX')

    },
    // 点击菜单 - 传入name，添加到keepalive缓存页面
    selectMenu(item) {
      // console.log(item.name)
      // 加入keepalive缓存
      this.$store.commit('addKeepAliveCache', item.name)
      //添加tags标签
      //访问welcome 就代表home
      const name = item.name === this.$store.state.homeName ? this.$store.state.homeName : item.name;
      const submenu = {
        path: item.path,
        name: name,
      };
      // console.log(submenu)
      //更新选中菜单
      this.$store.commit('selectMenu', submenu)
    },
    // 点击标签跳转路由
    changeMenu(item) {
      // 历史选中菜单
      const oldActivePath = this.$store.state.activePath;
      // 首先判断点击的是否是自己，如果是自己则return
      if (oldActivePath === item.name) {
        return
      }
      // 存储菜单
      this.$store.commit('changeMenu', item.name)
      // 页面跳转
      this.$router.push({
        path: item.path
      })
    },
    // 关闭tab标签
    handleClose(tab, index) {
      if (tab.name === this.$store.state.homeName && this.tabList.length === 1) {
        this.$message.error('当前页面已无法关闭 /(ㄒoㄒ)/~~')
        return
      }
      // 历史选中菜单
      let oldActivePath = this.$store.state.activePath;
      // 历史已选中菜单列表
      let oldTabList = this.$store.state.tabList
      // 计算标签个数
      let length = oldTabList.length - 1
      // 删除tabList中的该对象
      for (let i = 0; i < oldTabList.length; i++) {
        let item = oldTabList[i]
        if (item.name === tab.name) {
          oldTabList.splice(i, 1);
        }
      }
      // 删除keepAlive缓存
      this.$store.commit('removeKeepAliveCache', tab.name)
      // 如果关闭的标签不是当前路由的话，就不跳转
      if (tab.name !== oldActivePath) {
        return
      }
      // 如果length为1，必然只剩下首页标签，此时关闭后，更新到首页
      if (length === 0) {
        // 同时存储菜单
        this.$store.commit('closeTab', {
          activePath: this.$store.state.homePath,
          tabList: [{
            path: this.$store.state.homePath,
            name: this.$store.state.homeName,
          }]
        })
        // tab页向左跳转
        this.$router.push({
          name: this.tabList[0].name,
        })
        // 不再向下执行
        this.isChosen(this.tabList[0])
        return
      }
      // 关闭的标签是最右边的话，往左边跳转一个
      if (index === length) {
        // 同时更新路径
        oldActivePath = oldTabList[index - 1].name
        // 同时存储菜单
        this.$store.commit('closeTab', {
          activePath: oldActivePath,
          tabList: oldTabList
        })
        // tab页向左跳转
        this.$router.push({
          name: oldTabList[index - 1].name
        })
      } else {
        // 同时更新路径
        oldActivePath = oldTabList[index].name
        // 同时存储菜单
        this.$store.commit('closeTab', {
          activePath: oldActivePath,
          tabList: oldTabList
        })
        // tab页向右跳转
        this.$router.push({
          name: oldTabList[index].name
        })
      }
    },
    isChosen(tab) {
      /*console.log(tab.name)
      console.log(this.$store.state.activePath)*/
      return tab.name === this.$store.state.activePath;
    }
  },
  watch: {
    // 路由发生变化时调用更新tab标签数据
    '$route': {
      handler(newValue) {
        this.selectMenu(newValue);
      },
      immediate: true
    }
  },
}
</script>

<style scoped>

/*  通用属性  */
.box-tag {
  margin-right: 7px;
  height: 32px;
  display: flex;
  justify-content: center;
  margin-top: 9px;
  align-items: center;
  border-radius: 10px;
  user-select: none;
}

.box-tag >>> .el-icon-close {
  display: inline-flex;
  font-size: 18px;
}

.box-tag >>> .el-tag__close {
  display: inline-flex;
  justify-content: right;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  padding-top: 3px;
  padding-right: 2px;
}

/*  选中时属性   */
.box-tag-chose {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: white;
}

.box-tag-chose >>> .el-tag__close:hover {
  background-color: #409eff;
}

.box-tag-chose >>> .el-tag__close {
  color: #409eff;
}

/*  未选中时属性  */
.box-tag-not-chose {
  background-color: #c7e5f9;
  color: #fff;
  border-color: white;
}

.box-tag-not-chose >>> .el-tag__close {
  color: white;
}

.box-tag-not-chose >>> .el-tag__close:hover {
  background-color: #fff;
}

</style>
