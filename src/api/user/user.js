import {
    request
} from './../../utils/request'

// 根据获得用户列表
export default function userList() {
    return request({
        url: '/user/userList',
        method: 'get'
    })
}

// 登录接口
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}