import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
]

export const asyncRoutes = [
  // 用户管理
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'UserList',
        meta: { title: '用户管理', icon: 'user', roles: ['admin'] }
      }
    ]
  },

  // 小组管理
  {
    path: '/group',
    component: Layout,
    redirect: "/group/index",
    alwaysShow: true,
    meta: { title: '学习小组', icon: 'el-icon-sugar', roles: ['teacher'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/group/index'),
        name: 'Group',
        meta: { title: '小组管理', icon: 'el-icon-dessert', roles: ['admin'] }
      },
      {
        path: 'member',
        component: () => import('@/views/group/member'),
        name: 'Member',
        meta: { title: '我的小组', icon: 'el-icon-ice-cream', roles: ['teacher'] }
      },
      {
        path: 'unit/:id',
        component: () => import('@/views/unit/index'),
        name: 'Unit',
        hidden: true,
        meta: { title: '单元管理', roles: ['teacher'] }
      },
      {
        path: 'addMember/:id',
        component: () => import('@/views/group/addMember'),
        name: 'AddMember',
        hidden: true,
        meta: { title: '小组成员', roles: ['teacher'] }
      }
    ]
  },

  // 作业
  {
    path: '/work',
    component: Layout,
    redirect: "/work/index",
    alwaysShow: true,
    meta: { title: '作业管理', icon: 'el-icon-edit-outline', roles: ['teacher'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/work/index'),
        name: 'Work',
        meta: { title: '作业列表', icon: 'el-icon-document', roles: ['teacher'] }
      },
      {
        path: 'publish',
        component: () => import('@/views/work/publish'),
        name: 'WorkPublish',
        meta: { title: '发布作业', icon: 'el-icon-document-add', roles: ['teacher'] }
      },
      {
        path: 'read/:id',
        component: () => import('@/views/work/read'),
        name: 'Work',
        hidden: true,
        meta: { title: '批阅作业', roles: ['teacher'] }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
