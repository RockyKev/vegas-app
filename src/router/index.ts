import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/networking-tips',
      name: 'networking-tips',
      component: () => import('../views/NetworkingTipsView.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/CalendarView.vue')
    },
    {
      path: '/travel-info',
      name: 'travel-info',
      component: () => import('../views/TravelInfoView.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue')
    },
    {
      path: '/networking-targets',
      name: 'networking-targets',
      component: () => import('../views/NetworkingTargetsView.vue')
    }
  ]
})

export default router 