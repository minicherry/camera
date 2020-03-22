import Vue from 'vue'
import Router from 'vue-router'
//页面
import User from './views/user/user.vue'
import Login from './views/login/index.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/user',
        name: 'User',
        component: User
    }, {
        path: '/login',
        name: 'Login',
        component: Login
    }]
})