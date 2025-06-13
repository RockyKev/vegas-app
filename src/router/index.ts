import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/networking-tips',
      name: 'networking-tips',
      component: () => import('../views/NetworkingTipsView.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView
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