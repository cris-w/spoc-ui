import request from '@/utils/request'

// 获取所有小组
export function listClassroom(name) {
    return request({
        url: '/classroom/list',
        method: 'get',
        params: name
    })
}

// 通过老师id获取小组
export function listByTeacherId(id) {
    return request({
        url: `/classroom/listByTeacherId/${id}`,
        method: 'get',
    })
}

// 获取老师列表
export function getTeacherList() {
    return request({
        url: '/classroom/getTeacherList',
        method: 'get',
    })
}

// 通过id获取小组
export function getClassroomById(id) {
    return request({
        url: `/classroom/getById/${id}`,
        method: 'get',
    })
}

// 新增小组
export function addClassroom(classroom) {
    return request({
        url: '/classroom/save',
        method: 'post',
        data: classroom
    })
}

// 修改小组信息
export function update(classroom) {
    return request({
        url: '/classroom/update',
        method: 'post',
        data: classroom
    })
}

// 删除小组
export function deleteById(id) {
    return request({
        url: `/classroom/removeById/${id}`,
        method: 'get'
    })
}

// 通过小组id 获取小组成员
export function listMember(classId) {
    return request({
        url: `/classroom/listMemberByClassId/${classId}`,
        method: 'get'
    })
}

// 移除小组
export function removeMember(classId, userId) {
    return request({
        url: `/classroom/removeMemberById/${classId}/${userId}`,
        method: 'get'
    })
}

// 查询学生列表
export function listStudent() {
    return request({
        url: `/classroom/listStudent`,
        method: 'get'
    })
}

// 学生加入小组
export function joinClass(classId, userIds) {
    return request({
        url: `/classroom/joinClass/${classId}`,
        method: 'post',
        data: userIds
    })
}