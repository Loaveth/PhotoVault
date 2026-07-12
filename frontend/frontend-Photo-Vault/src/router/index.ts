import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PhotosView from '../views/PhotosView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView},
    { path: '/photos', name: 'photos', component: PhotosView },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('token') !== null

  // routes that require login
  const protectedRoutes = ['photos', 'profile']

  if (protectedRoutes.includes(to.name as string) && !isLoggedIn) {
    return { name: 'home' }
  }
})

export default router
