import Vue from 'vue'
import Vuex from "vuex";
import App from './App.vue'
import router from './router'
import store from './store'
import * as ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../public/gloable.css';
import '../public/animation.css'
import '../public/icon.css';
import '../public/decoration.css'
import request from "../src/utils/request";
import 'element-ui/lib/theme-chalk/display.css';
import VueParticles from 'vue-particles'
import VueAnimateNumber from 'vue-animate-number'
// main.js 全局注册
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueRouter from 'vue-router'

Vue.use(VueAnimateNumber)
// use
Vue.use(mavonEditor)
Vue.use(Vuex)
Vue.use(VueRouter)

Vue.config.productionTip = false

Vue.use(ElementUI, {size: "small"})
Vue.use(VueParticles)
Vue.prototype.request = request

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

