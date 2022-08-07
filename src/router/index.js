import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store"

Vue.use(VueRouter)

const routes = [
    {
        name: '展示',
        path: '/show',
        component: () => import('../components/Show'),
    },
    {
        name: '登录',
        path: '/login',
        component: () => import('../views/Login.vue'),
    },
    {
        name: '404',
        path: '/404',
        component: () => import('../views/404.vue'),
    },
    {
        name: 'front',
        path: '/front',
        redirect: '/front/home',
        component: () => import('../components/front/Front'),
        children: [
            {
                name: '协会首页',
                path: 'home',
                component: () => import('../views/front/Home')
            },
            {
                name: '协会资料',
                path: 'data'
            },
            {
                name: '协会博客',
                path: 'blog',
                component: () => import('../views/front/Blog')
            },
            {
                name: '博客详情',
                path: 'blogDetail',
                component: () => import('../views/front/BlogDetail')
            },
            {
                name: '更多',
                path: 'more',
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//  重置路由方法
export const resetRoutes = () => {
    router.matcher = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
}

export const setRoutes = () => {
    //  浏览器缓存取出menus集合
    const user = localStorage.getItem("user");
    if (user) {
        //  拼装动态路由
        const manageRoute = {
            path: '/',
            name: 'manage',
            component: () => import('../components/Manage.vue'),
            redirect: '/center/home',
            children: []
        }
        const menus = JSON.parse(localStorage.getItem("menus"));
        menus.forEach(item => {
                if (item.pagePath) {    //  首页路由
                    let itemMenu = {
                        path: item.path[0] === '/' ? item.path.replace("/", "") : item.path,
                        name: item.name,
                        component: () => import('../views/' + item.pagePath + '.vue'),
                    }
                    manageRoute.children.push(itemMenu)
                } else {   //  path为空时为二级菜单
                    let itemMenu = {
                        path: item.path,
                        name: item.name,
                        component: {render: (e) => e("router-view")},
                        children: []
                    }
                    item.children.forEach(childrenItem => {
                        let childrenItemMenu = {
                            path: childrenItem.path[0] === '/' ? childrenItem.path.replace("/", "") : childrenItem.path,
                            name: childrenItem.name,
                            component: () => import('../views/' + childrenItem.pagePath + '.vue'),
                        }
                        itemMenu.children.push(childrenItemMenu)
                    })
                    manageRoute.children.push(itemMenu)
                }
            }
        )
        const currentRouters = router.getRoutes().map(v => v.name);
        //  当路由中不含有manage时再添加
        if (!currentRouters.includes('manage')) {
            //  添加到现在的路由中去
            router.addRoute(manageRoute)
        }
    }
}
//  重置就重新调用路由设置
setRoutes()


//  路由守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next('/show')
    }
    localStorage.setItem("currentPathName", to.name) //  设置当前路由名称，为了在header组件中使用
    store.commit("setPath") //  触发store的数据更新
    let paths = to.path.split("/");
    if (paths[1] !== 'front') {
        //  未找到路由的情况
        if (to.matched.length === 0 && from.path !== '/login') {
            //  获取当前menus
            const storeMenus = JSON.parse(localStorage.getItem('menus'))
            if (storeMenus) {
                next("/404")  //  放行路由
            } else {
                next("/show")  //  跳回登录
            }
        }
    }
    if (to.name) {
        document.title = to.name + '-AHPU 计算机协会'
    }
    next()
})

export default router
