import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MyClassesView from '@/views/MyClassesView.vue'
import MyNormativesView from '@/views/MyNormativesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CreateOrUpdateNormativeView from '@/views/CreateOrUpdateNormativeView.vue'
import CreateOrUpdateStudentView from '@/views/CreateOrUpdateStudentView.vue'
import StudentView from '@/views/StudentView.vue'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { mobileTitle: 'Дневник тренера' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: isNotAuthenticated
    },
    {
      path: '/app',
      name: 'app',
      /*component: AppView,*/
      redirect: { name: 'my-classes' },
      meta: { mobileTitle: 'Дневник тренера' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-classes',
      name: 'my-classes',
      component: MyClassesView,
      meta: { mobileTitle: 'Мои классы' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-classes/create',
      name: 'create-student',
      component: CreateOrUpdateStudentView,
      meta: { mobileTitle: 'Создание ученика' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-classes/update/:id',
      name: 'update-student',
      component: CreateOrUpdateStudentView,
      meta: { mobileTitle: 'Обновление ученика' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-normatives',
      name: 'my-normatives',
      component: MyNormativesView,
      meta: { mobileTitle: 'Мои нормативы' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-normatives/create',
      name: 'create-normative',
      component: CreateOrUpdateNormativeView,
      meta: { mobileTitle: 'Создание норматива' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-normatives/update/:id',
      name: 'update-normative',
      component: CreateOrUpdateNormativeView,
      meta: { mobileTitle: 'Обновление норматива' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/profile',
      name: 'profile',
      component: ProfileView,
      meta: { mobileTitle: 'Профиль' },
      beforeEnter: isAuthenticated
    },
    {
      path: '/app/my-classes/:id',
      name: 'student',
      component: StudentView,
      meta: { mobileTitle: 'Ученик' },
      beforeEnter: isAuthenticated
    }
  ]
})


function isAuthenticated(): RouteLocationRaw | undefined {
  if (!useUserStore().isLoggedIn) {
    return {
      name: 'login'
    }
  }
}

function isNotAuthenticated(): RouteLocationRaw | undefined {
  if (useUserStore().isLoggedIn) {
    return {
      name: 'my-classes'
    }
  }
}


export default router
