import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: () => import('../views/LandingPage.vue'),
    },
    {
      path: '/Recordatorios',
      name: 'Recordatorios',
      component: () => import('../views/Recordatorios.vue'),
      meta: { requiereAuth: true },
    },
    {
      path: '/Admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue'),
      meta:{requiereAuth: true}
    }
  ],
})

router.beforeEach((to) => {
  const user = getAuth().currentUser

  if (to.meta.requiereAuth && !user) {
    return false;
  }
  return true
})


export default router
