import {
    request
} from './../../utils/request'

// 根据主键测试数据库
export default function userList() {
    return request({
        url: '/user/userList',
        method: 'get',
    })
}