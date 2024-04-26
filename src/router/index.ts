import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MyClassesView from '@/views/MyClassesView.vue'
import MyNormativesView from '@/views/MyNormativesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateOrUpdateNormativeView from '@/views/CreateOrUpdateNormativeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {mobileTitle: 'Дневник тренера'},
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,

    },
    {
      path: '/app',
      name: 'app',
      /*component: AppView,*/
      redirect: {name: 'my-classes'},
      meta: {mobileTitle: 'Дневник тренера'},
    },
    {
      path: '/app/my-classes',
      name: 'my-classes',
      component: MyClassesView,
      meta: {mobileTitle: 'Мои классы'},
    },
    {
      path: '/app/my-normatives',
      name: 'my-normatives',
      component: MyNormativesView,
      meta: {mobileTitle: 'Мои нормативы'},
    },
    {
      path: '/app/my-normatives/create',
      name: 'create-normative',
      component: CreateOrUpdateNormativeView,
      meta: {mobileTitle: 'Создание норматива'},
    },
    {
      path: '/app/my-normatives/update/:id',
      name: 'update-normative',
      component: CreateOrUpdateNormativeView,
      meta: {mobileTitle: 'Обновление норматива'},
    },
    {
      path: '/app/profile',
      name: 'profile',
      component: ProfileView,
      meta: {mobileTitle: 'Профиль'},
    },
  ]
})

export default router
