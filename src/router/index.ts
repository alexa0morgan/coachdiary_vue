import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MyClassesView from '@/views/MyClassesView.vue'
import MyNormativesView from '@/views/MyNormativesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateNormativeView from '@/views/CreateNormativeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/app',
      name: 'app',
      /*component: AppView,*/
      redirect: {name: 'my-classes'}
    },
    {
      path: '/app/my-classes',
      name: 'my-classes',
      component: MyClassesView
    },
    {
      path: '/app/my-normatives',
      name: 'my-normatives',
      component: MyNormativesView
    },
    {
      path: '/app/my-normatives/create',
      name: 'create-normative',
      component: CreateNormativeView,
    },
    {
      path: '/app/profile',
      name: 'profile',
      component: ProfileView
    }
  ]
})

export default router
