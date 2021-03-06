import request from '@/utils/request'

// 获取所有作业
export function listScore(tworkId) {
    return request({
        url: `/score/list/${tworkId}`,
        method: 'get',
    })
}

// 通过id获取作业
export function getScoreById(id) {
    return request({
        url: `/score/getById/${id}`,
        method: 'get',
    })
}


// 批阅
export function update(score) {
    return request({
        url: '/score/update',
        method: 'post',
        data: score
    })
}

// 打回作业
export function deleteById(id) {
    return request({
        url: `/score/removeById/${id}`,
        method: 'get'
    })
}

// 通过学生id查询已完成的作业ids
export function listWorkedIds(id) {
    return request({
        url: `/score/listWorkIdByUserId/${id}`,
        method: 'get'
    })
}

// 提交作业
export function submitWork(score) {
    return request({
        url: '/score/submitWork',
        method: 'post',
        data: score
    })
}