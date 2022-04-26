import request from '@/utils/request'

// 获取所有作业
export function listWork(userId) {
    return request({
        url: `/work/list/${userId}`,
        method: 'get',
    })
}

// 通过id获取作业
export function getWorkById(id) {
    return request({
        url: `/work/getById/${id}`,
        method: 'get',
    })
}

// 新增作业
export function addWork(work) {
    return request({
        url: '/work/save',
        method: 'post',
        data: work
    })
}

// 修改作业信息
export function update(work) {
    return request({
        url: '/work/update',
        method: 'post',
        data: work
    })
}

// 删除作业
export function deleteById(id) {
    return request({
        url: `/work/removeById/${id}`,
        method: 'get'
    })
}