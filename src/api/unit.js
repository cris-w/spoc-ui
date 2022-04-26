import request from '@/utils/request'

// 获取所有单元
export function listUnit(classroomId) {
    return request({
        url: `/unit/list/${classroomId}`,
        method: 'get',
    })
}

// 通过id获取单元
export function getUnitById(id) {
    return request({
        url: `/unit/getById/${id}`,
        method: 'get',
    })
}

// 新增单元
export function addUnit(unit) {
    return request({
        url: '/unit/save',
        method: 'post',
        data: unit
    })
}

// 修改单元信息
export function update(unit) {
    return request({
        url: '/unit/update',
        method: 'post',
        data: unit
    })
}

// 删除单元
export function deleteById(id) {
    return request({
        url: `/unit/removeById/${id}`,
        method: 'get'
    })
}

// 通过id获取小节
export function getVideoById(id) {
    return request({
        url: `/video/getById/${id}`,
        method: 'get',
    })
}

// 新增小节
export function addVideo(video) {
    return request({
        url: '/video/save',
        method: 'post',
        data: video
    })
}

// 修改小节信息
export function updateVideo(video) {
    return request({
        url: '/video/update',
        method: 'post',
        data: video
    })
}

// 删除小节
export function deleteVideoById(id) {
    return request({
        url: `/video/removeById/${id}`,
        method: 'get'
    })
}

// 删除小节视频
export function deleteVideo(fileName) {
    return request({
        url: `/oos/fileOos/delete/${fileName}`,
        method: 'get'
    })
}

