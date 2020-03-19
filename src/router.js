import Vue from 'vue'
import Router from 'vue-router'
//页面
import User from './views/user/user.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/user',
        name: 'User',
        component: User
    }, ]
})