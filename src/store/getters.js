const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  id: state => state.user.id,
  avatar: state => state.user.avatar,
  role: state => state.user.role,
  name: state => state.user.name,
  nickname: state => state.user.nickname,
  permission_routes: state => state.permission.routes,
}
export default getters
