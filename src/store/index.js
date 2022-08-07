import Vue from 'vue'
import Vuex from 'vuex'
import router, {resetRoutes} from "@/router";

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        currentPathName: '',
        isCollapse: false,
        logoTextShow: true,
        windowOrPhone: true,
        asideShow: true,
        homePath: '/front/home',
        homeName: '数据公布',
        userinfo: [],
        strDate: "",
        asidePath: [],
        user: {},
        windowSize: 'lg',
        isOpen: false,
        frontPath: '',
        frontBlogName: '',
        /*  tag路由导航 */
        // 缓存组件页面
        catch_components: [],
        // 当前选中的菜单 - 默认选择首页
        activePath: '/center/home',
        // 菜单项 - 需要展示到tag的页面
        tabList: [],
    },
    mutations: {
        setPath(state) {
            state.currentPathName = localStorage.getItem("currentPathName")
        },

        /*  tag路由导航（动态修改数据） */
        //清空vuex数据
        clearVUEX(state) {
            state.catch_components = []
            state.activePath = this.$store.state.homePath
            state.tabList = [{
                path: this.$store.state.homePath,
                name: this.$store.state.homeName,
            }]
        },
        // 跳转页面执行
        selectMenu(state, submenu) {
            // 首页就是 welcome   也就是 home
            if (submenu.name === this.homeName) {
                submenu.name = this.$store.state.homeName
                submenu.path = "/center/home"
            }
            // 当前选中菜单
            const activePath = submenu.name;
            // 历史已选中菜单列表
            const oldTabList = state.tabList;

            // 将菜单信息添加到tablist - 添加时判断是否已有该路由标签
            const result = oldTabList.some(item => {
                if (item.name === activePath) {
                    // console.log('--------', item.fullPath != submenu.fullPath)
                    // 有该路由标签是否为多次点击(相当于查看同路由下的详情，该过程只改变了参数)
                    if (!item.path !== submenu.path) {
                        item.path = submenu.path
                    }
                    return true
                }
            });
            // 如果不包含该对象，则添加
            if (!result) {
                oldTabList.push({
                    path: submenu.path,
                    name: submenu.name,
                })
            }
            // 重新赋值标签路由和当前选中菜单
            state.activePath = activePath
            state.tabList = oldTabList
        },
        // 添加keepalive缓存
        addKeepAliveCache(state, val) {
            // 如果是首页不缓存
            if (val === this.homeName) {
                return
            }
            // console.log(state.catch_components)

            // 添加时判断，如果该组件已存在，便不添加
            if (state.catch_components.indexOf(val) === -1) {
                // 不存在，缓存页面
                state.catch_components.push(val)
            }
        },
        // 删除keepalive缓存
        removeKeepAliveCache(state, val) {
            let cache = state.catch_components
            for (let i = 0; i < cache.length; i++) {
                if (cache[i] === val) {
                    cache.splice(i, 1);
                }
            }
            state.catch_components = cache
        },
        //关闭菜单
        closeTab(state, val) {
            // 重新赋值
            state.activePath = val.activePath
            state.tabList = val.tabList
        },
        // 点击标签选择菜单
        changeMenu(state, val) {
            state.activePath = val
        },
        logout() {
            localStorage.removeItem('user')
            localStorage.removeItem('menus')
            router.push('/login')

            //  重置路由
            resetRoutes()
        },
    }
})

export default store
