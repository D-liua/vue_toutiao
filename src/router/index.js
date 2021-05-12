import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      // 如果父路由有默认子路由, 那么它的 name 就没有意义
      { path: '/', name: 'home', component: () => import('@/views/home') },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/my') }
    ]
  },
  { path: '/search', name: 'search', component: () => import('@/views/search') },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: r => ({ articleId: r.params.articleId })
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
