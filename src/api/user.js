import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/userInfo',
    method: 'get',
    params: { token }
  })
}

// 获取所有用户
export function list(username) {
  return request({
    url: '/user/list',
    method: 'get',
    params: username
  })
}

// 通过id获取用户
export function getUserById(id) {
  return request({
    url: `/user/getById/${id}`,
    method: 'get',
  })
}

// 新增用户
export function addUser(user) {
  return request({
    url: '/user/save',
    method: 'post',
    data: user
  })
}

// 修改用户信息
export function update(user) {
  return request({
    url: '/user/update',
    method: 'post',
    data: user
  })
}

// 删除用户
export function deleteById(id) {
  return request({
    url: `/user/delete/${id}`,
    method: 'get'
  })
}

// 批量删除
export function delBatch(ids) {
  return request({
    url: `/user/delBatch`,
    method: 'post',
    data: ids
  })
}
